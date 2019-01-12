/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import cliSize from 'term-size';
import ansiEscapes from 'ansi-escapes';
import Emitter from './Emitter';
import Tool from './Tool';
import { Debugger } from './types';
import Output from './Output';

// 16 FPS (60 FPS is actually too fast as it tears)
const FPS_RATE = 62.5;

// Bind our writable streams for easy access
const BOUND_WRITERS = {
  stderr: process.stderr.write.bind(process.stderr),
  stdout: process.stdout.write.bind(process.stdout),
};

export default class Console extends Emitter {
  bufferedStreams: (() => void)[] = [];

  debug: Debugger;

  errorLogs: string[] = [];

  logs: string[] = [];

  outputQueue: Output[] = [];

  tool: Tool<any>;

  protected final: boolean = false;

  protected renderTimer: NodeJS.Timer | null = null;

  protected restoreCursorOnExit: boolean = false;

  protected started: boolean = false;

  protected stopped: boolean = false;

  private writers: typeof BOUND_WRITERS;

  constructor(tool: Tool<any>, /* test only */ testWriters: typeof BOUND_WRITERS = BOUND_WRITERS) {
    super();

    this.debug = tool.createDebugger('console');
    this.tool = tool;
    this.writers = testWriters;

    // istanbul ignore next
    if (process.env.NODE_ENV !== 'test') {
      process
        .on('SIGINT', this.handleSignal)
        .on('SIGTERM', this.handleSignal)
        .on('uncaughtException', this.handleFailure)
        .on('unhandledRejection', this.handleFailure);
    }
  }

  /**
   * Display a footer after all output.
   */
  displayFooter() {
    const { footer } = this.tool.options;

    if (footer) {
      this.out(footer, 1);
    }
  }

  /**
   * Display a header before all output.
   */
  displayHeader() {
    const { header } = this.tool.options;

    if (header) {
      this.out(header, 1);
    }
  }

  /**
   * Write a message to `stderr` with optional trailing newline(s).
   */
  err(message: string, nl: number = 0): this {
    if (this.isSilent()) {
      return this;
    }

    this.writers.stderr(message + '\n'.repeat(nl));

    return this;
  }

  /**
   * Flush buffered stream output.
   */
  flushBufferedStreams(): this {
    this.bufferedStreams.forEach(buffer => {
      buffer();
    });

    return this;
  }

  /**
   * Flush the top output block in the queue.
   */
  flushOutputQueue(): this {
    const output = this.outputQueue[0];

    // Erase the previous output
    if (output) {
      output.erasePrevious();
    }

    // Write buffered output
    this.flushBufferedStreams();

    // Write the next output
    if (output) {
      output.render();

      // Restart queue if the output is complete
      if (output.isComplete()) {
        this.outputQueue.shift();
        this.flushOutputQueue();
      }
    }

    return this;
  }

  /**
   * Handle uncaught exceptions and unhandled rejections that bubble up.
   */
  handleFailure = (error: Error) => {
    this.start();
    this.debug('Uncaught exception or unresolved promise handled');
    this.stop(error, true);
  };

  /**
   * Handle SIGINT and SIGTERM interruptions.
   */
  handleSignal = () => {
    this.start();
    this.debug('SIGINT or SIGTERM handled');
    this.stop(new Error('Process has been terminated.'), true);
  };

  /**
   * Hide the console cursor.
   */
  hideCursor(): this {
    this.out(ansiEscapes.cursorHide);

    if (!this.restoreCursorOnExit && !this.isSilent()) {
      this.restoreCursorOnExit = true;

      // istanbul ignore next
      process.on('exit', () => {
        process.stdout.write(ansiEscapes.cursorShow);
      });
    }

    return this;
  }

  /**
   * Return true if the final render.
   */
  isFinalRender(): boolean {
    return this.final;
  }

  /**
   * Return true if the there should be no output.
   */
  isSilent(): boolean {
    return this.tool.config.silent;
  }

  /**
   * Log a message to display on success during the final render.
   */
  log(message: string): this {
    this.logs.push(message);

    return this;
  }

  /**
   * Log a live message to display during the rendering process.
   */
  logLive(message: string): this {
    // Write to the wrapped buffer
    process.stdout.write(message);

    return this;
  }

  /**
   * Log an error message to display on failure during the final render.
   */
  logError(message: string): this {
    this.errorLogs.push(message);

    return this;
  }

  /**
   * Write a message to `stdout` with optional trailing newline(s).
   */
  out(message: string, nl: number = 0): this {
    if (this.isSilent()) {
      return this;
    }

    this.writers.stdout(message + '\n'.repeat(nl));

    return this;
  }

  /**
   * Enqueue a block of output to be rendered.
   */
  render(output: Output): this {
    if (!this.outputQueue.includes(output)) {
      this.outputQueue.push(output);
    }

    return this;
  }

  /**
   * Handle the final rendering of all output before stopping.
   */
  renderFinalOutput(error: Error | null) {
    this.debug('Rendering final console output');
    this.final = true;

    // Stop the render loop
    this.stopRenderLoop();

    // Mark all output as final
    this.outputQueue.forEach(output => {
      output.enqueue(true);
    });

    // Recursively render the remaining output
    this.flushOutputQueue();

    if (error) {
      if (this.errorLogs.length > 0) {
        this.err(`\n${this.errorLogs.join('\n')}\n`);
      }

      this.emit('error', [error]);
    } else {
      if (this.logs.length > 0) {
        this.out(`\n${this.logs.join('\n')}\n`);
      }

      this.displayFooter();
    }

    // Flush any stream output that still exists
    this.flushBufferedStreams();
  }

  /**
   * Reset the cursor back to the bottom of the console.
   */
  resetCursor(): this {
    this.out(ansiEscapes.cursorTo(0, cliSize().rows));

    return this;
  }

  /**
   * Show the console cursor.
   */
  showCursor(): this {
    this.restoreCursorOnExit = false;
    this.out(ansiEscapes.cursorShow);

    return this;
  }

  /**
   * Start the console by wrapping streams and buffering output.
   */
  start(args: any[] = []): this {
    if (this.started) {
      return this;
    }

    this.debug('Starting console render loop');
    this.wrapStreams();
    this.displayHeader();
    this.startRenderLoop();
    this.emit('start', args);
    this.started = true;

    return this;
  }

  /**
   * Automatically render the console in a timeout loop at 16 FPS.
   */
  startRenderLoop() {
    this.renderTimer = setTimeout(() => {
      this.flushOutputQueue();
      this.startRenderLoop();
    }, FPS_RATE);
  }

  /**
   * Stop the console rendering process.
   */
  stop(error: Error | null = null, force: boolean = false) {
    if (this.stopped) {
      return;
    }

    if (error) {
      this.debug('Stopping console with an error');
      this.errorLogs.push(...this.logs);
      this.logs = [];
    } else {
      this.debug('Stopping console render loop');
    }

    this.emit('stop', [error]);
    this.renderFinalOutput(error);
    this.unwrapStreams();
    this.stopped = true;
    this.started = false;

    if (error && force) {
      throw error;
    }
  }

  /**
   * Stop the background render loop.
   */
  stopRenderLoop() {
    if (this.renderTimer) {
      clearTimeout(this.renderTimer);
      this.renderTimer = null;
    }
  }

  /**
   * Unwrap the native console and reset it back to normal.
   */
  // istanbul ignore next
  unwrapStreams() {
    this.debug('Unwrapping `stderr` and `stdout` streams');

    if (process.env.NODE_ENV === 'test') {
      return;
    }

    process.stderr.write = this.writers.stderr as any;
    process.stdout.write = this.writers.stdout as any;
  }

  /**
   * Wrap the `stdout` and `stderr` streams and buffer the output as
   * to not collide with our render loop.
   */
  // istanbul ignore next
  wrapStreams() {
    this.debug('Wrapping `stderr` and `stdout` streams');

    if (process.env.NODE_ENV === 'test') {
      return;
    }

    ['stderr', 'stdout'].forEach(key => {
      const name = key as 'stderr' | 'stdout';
      const stream = process[name];
      let buffer = '';

      this.bufferedStreams.push(() => {
        if (stream.isTTY && buffer) {
          this.writers[name](buffer);
        }

        buffer = '';
      });

      stream.write = (chunk: string) => {
        buffer += String(chunk);

        return true;
      };
    });
  }
}
