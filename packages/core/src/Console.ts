/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import exit from 'exit';
import cliTruncate from 'cli-truncate';
import cliSize from 'term-size';
import ansiEscapes from 'ansi-escapes';
import stripAnsi from 'strip-ansi';
import wrapAnsi from 'wrap-ansi';
import Emitter from './Emitter';
import Tool from './Tool';
import { Debugger } from './types';
import Output, { Renderer } from './Output';

// 16 FPS (60 FPS is actually too fast as it tears)
const FPS_RATE = 62.5;

// Bind our writable streams for easy access
const write = {
  stderr: process.stderr.write.bind(process.stderr),
  stdout: process.stdout.write.bind(process.stdout),
};

export default class Console extends Emitter {
  bufferedStreams: (() => void)[] = [];

  debug: Debugger;

  errorLogs: string[] = [];

  exiting: boolean = false;

  logs: string[] = [];

  outputQueue: Output[] = [];

  renderTimer: NodeJS.Timer | null = null;

  restoreCursorOnExit: boolean = false;

  tool: Tool<any, any>;

  constructor(tool: Tool<any, any>) {
    super();

    this.debug = tool.createDebugger('console');
    this.tool = tool;

    /* istanbul ignore next */
    if (process.env.NODE_ENV !== 'test') {
      process
        .on('SIGINT', this.handleSignal)
        .on('SIGTERM', this.handleSignal)
        .on('uncaughtException', this.handleFailure)
        .on('unhandledRejection', this.handleFailure);
    }
  }

  /**
   * Create a new output to be rendered with the defined renderer function.
   */
  createOutput(renderer: Renderer): Output {
    return new Output(this, renderer);
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

    write.stderr(message + '\n'.repeat(nl));

    return this;
  }

  /**
   * Force exit the application.
   */
  exit(message: string | Error | null, code: number, force: boolean = false) {
    if (this.exiting) {
      return;
    }

    this.exiting = true;

    let error = null;

    if (message !== null) {
      error = message instanceof Error ? message : new Error(message);
    }

    if (error) {
      this.debug('Exiting console with an error');

      // Mark logs as errors
      if (force) {
        this.errorLogs.push(...this.logs);
        this.logs = [];
      }
    } else {
      this.debug('Exiting console rendering process');
    }

    this.emit('stop', [error, code]);

    // Render final output
    this.handleFinalRender(error);

    // Unwrap our streams
    this.unwrapStreams();

    // Exit after buffers have flushed
    if (force) {
      exit(code);
    } else {
      process.exitCode = code;
    }
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
    this.exit(error, 1, true);
  };

  /**
   * Handle the final render before exiting.
   */
  handleFinalRender = (error: Error | null = null) => {
    this.debug('Rendering final console output');

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

    // Stop the render loop
    this.stopRenderLoop();
  };

  /**
   * Handle the rendering and flushing process.
   */
  handleRender = () => {
    this.flushOutputQueue();
  };

  /**
   * Handle SIGINT and SIGTERM interruptions.
   */
  handleSignal = () => {
    this.start();
    this.debug('SIGINT or SIGTERM handled');
    this.exit('Process has been terminated.', 1, true);
  };

  /**
   * Hide the console cursor.
   */
  hideCursor(): this {
    this.out(ansiEscapes.cursorHide);

    if (!this.restoreCursorOnExit && !this.isSilent()) {
      this.restoreCursorOnExit = true;

      /* istanbul ignore next */
      process.on('exit', () => {
        process.stdout.write(ansiEscapes.cursorShow);
      });
    }

    return this;
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
    console.log(message);

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

    write.stdout(message + '\n'.repeat(nl));

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
   * Reset the cursor back to the bottom of the console.
   */
  resetCursor(): this {
    this.out(ansiEscapes.cursorTo(0, this.size().rows));

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
   * Return size information about the terminal window.
   */
  size(): { columns: number; rows: number } {
    return cliSize();
  }

  /**
   * Start the console by wrapping streams and buffering output.
   */
  start(args: any[] = []): this {
    this.debug('Starting console rendering process');

    this.wrapStreams();
    this.displayHeader();
    this.startRenderLoop();
    this.emit('start', args);

    return this;
  }

  /**
   * Automatically render the console in a loop at 16 FPS.
   */
  startRenderLoop() {
    this.renderTimer = setTimeout(() => {
      this.handleRender();
      this.startRenderLoop();
    }, FPS_RATE);
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
   * Strip ANSI escape characters from a string.
   */
  strip(message: string): string {
    return stripAnsi(message);
  }

  /**
   * Truncate a string that contains ANSI escape characters to a specific column width.
   */
  truncate(
    message: string,
    columns?: number,
    options?: { position?: 'start' | 'middle' | 'end' },
  ): string {
    return cliTruncate(message, columns || this.size().columns, options);
  }

  /**
   * Unwrap the native console and reset it back to normal.
   */
  unwrapStreams() {
    this.debug('Unwrapping streams');

    if (process.env.NODE_ENV === 'test') {
      return;
    }

    process.stderr.write = write.stderr as any;
    process.stdout.write = write.stdout as any;
  }

  /**
   * Wrap a string that contains ANSI escape characters to a specific column width.
   */
  wrap(
    message: string,
    columns?: number,
    options?: { hard?: boolean; trim?: boolean; wordWrap?: boolean },
  ): string {
    return wrapAnsi(message, columns || this.size().columns, {
      hard: true,
      trim: false,
      ...options,
    });
  }

  /**
   * Wrap the `stdout` and `stderr` streams and buffer the output as
   * to not collide with our render loop.
   */
  wrapStreams() {
    this.debug('Wrapping streams');

    if (process.env.NODE_ENV === 'test') {
      return;
    }

    ['stderr', 'stdout'].forEach(key => {
      const name = key as 'stderr' | 'stdout';
      const stream = process[name];
      let buffer = '';

      this.bufferedStreams.push(() => {
        if (stream.isTTY && buffer) {
          write[name](buffer);
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
