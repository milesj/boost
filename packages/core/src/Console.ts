/* eslint-disable no-console */

import exit from 'exit';
import cliSize from 'term-size';
import ansiEscapes from 'ansi-escapes';
import Emitter from './Emitter';
import Tool from './Tool';
import Output from './Output';
import SignalError from './SignalError';
import { Debugger } from './types';

// 8 FPS (60 FPS is actually too fast as it tears)
export const FPS_RATE = 125;

// Bind our writable streams for easy access
export const BOUND_WRITERS = {
  stderr: process.stderr.write.bind(process.stderr),
  stdout: process.stdout.write.bind(process.stdout),
};

export const WRAPPED_STREAMS = {
  stderr: false,
  stdout: false,
};

export type StreamType = 'stderr' | 'stdout';

export interface ConsoleState {
  disabled: boolean;
  final: boolean;
  started: boolean;
  stopped: boolean;
}

export default class Console extends Emitter {
  bufferedStreams: Set<() => void> = new Set();

  debug: Debugger;

  errorLogs: string[] = [];

  logs: string[] = [];

  outputQueue: Output[] = [];

  tool: Tool<any>;

  protected renderTimer: NodeJS.Timer | null = null;

  protected state: ConsoleState = {
    disabled: false,
    final: false,
    started: false,
    stopped: false,
  };

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
        // @ts-ignore
        .on('unhandledRejection', this.handleFailure);
    }
  }

  /**
   * Disable the render loop entirely.
   */
  disable(): this {
    this.state.disabled = true;

    return this;
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
   * Enable the render loop.
   */
  enable(): this {
    this.state.disabled = false;

    return this;
  }

  /**
   * Write a message to `stderr` with optional trailing newline(s).
   */
  err(message: string, nl: number = 0): this {
    if (!this.isSilent()) {
      this.writers.stderr(message + '\n'.repeat(nl));
    }

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
    const outputs = this.outputQueue.filter((out, i) => i === 0 || out.isConcurrent());

    // Erase the previous output
    outputs.forEach(output => {
      output.erasePrevious();
    });

    // Write buffered output
    this.flushBufferedStreams();

    // Write the next output
    outputs.forEach(output => {
      output.render();
    });

    // Remove completed outputs
    this.outputQueue = this.outputQueue.filter(out => !out.isComplete());

    // Stop the render loop once the queue is empty
    if (this.isEmptyQueue()) {
      this.stopRenderLoop();
    } else {
      this.startRenderLoop();
    }

    return this;
  }

  /**
   * Handle uncaught exceptions and unhandled rejections that bubble up.
   */
  handleFailure = (error: Error) => {
    this.start();
    this.debug('Uncaught exception or unresolved promise handled');
    this.stop(error);

    exit(2);
  };

  /**
   * Handle SIGINT and SIGTERM interruptions.
   */
  handleSignal = (signal: NodeJS.Signals) => {
    this.start();
    this.debug('SIGINT or SIGTERM handled');
    this.stop(new SignalError(this.tool.msg('errors:processTerminated'), signal));

    exit(2);
  };

  /**
   * Hide the console cursor.
   */
  hideCursor(): this {
    console.warn('Console#hideCursor is deprecated. Use Reporter#hideCursor instead.');

    this.out(ansiEscapes.cursorHide);

    return this;
  }

  /**
   * Return true if the render loop has been disabled.
   */
  isDisabled(): boolean {
    return this.state.disabled;
  }

  /**
   * Return true if the output queue is empty.
   */
  isEmptyQueue(): boolean {
    return this.outputQueue.length === 0;
  }

  /**
   * Return true if the final render.
   */
  isFinalRender(): boolean {
    return this.state.final;
  }

  /**
   * Return true if the there should be no output.
   */
  isSilent(): boolean {
    // Check all objects since these might not have been loaded yet
    return this.tool && this.tool.config && this.tool.config.silent;
  }

  /**
   * Return true if the defined stream has been wrapped by the console layer.
   */
  isStreamWrapped(type: StreamType): boolean {
    return !!WRAPPED_STREAMS[type];
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
    console.warn('Console#logLive is deprecated. Use console.log instead.');

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
    if (!this.isSilent()) {
      this.writers.stdout(message + '\n'.repeat(nl));
    }

    return this;
  }

  /**
   * Enqueue a block of output to be rendered.
   */
  render(output: Output): this {
    if (this.isDisabled()) {
      throw new Error(
        'Output cannot be enqueued as the render loop has been disabled. This is usually caused by conflicting reporters.',
      );
    }

    if (!this.outputQueue.includes(output)) {
      this.outputQueue.push(output);
    }

    // Only run the render loop when output is enqueued
    this.startRenderLoop();

    return this;
  }

  /**
   * Handle the final rendering of all output before stopping.
   */
  renderFinalOutput(error: Error | null) {
    this.debug('Rendering final console output');
    this.state.final = true;

    // Mark all output as final
    this.outputQueue.forEach(output => {
      output.enqueue(true);
    });

    // Recursively render the remaining output
    while (!this.isEmptyQueue()) {
      this.flushOutputQueue();
    }

    // Stop the render loop
    this.stopRenderLoop();

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

    // Show the cursor incase it has been hidden
    this.out(ansiEscapes.cursorShow);
  }

  /**
   * Reset the cursor back to the bottom of the console.
   */
  resetCursor(): this {
    console.warn('Console#resetCursor is deprecated. Use Reporter#resetCursor instead.');

    this.out(ansiEscapes.cursorTo(0, cliSize().rows));

    return this;
  }

  /**
   * Show the console cursor.
   */
  showCursor(): this {
    console.warn('Console#showCursor is deprecated. Use Reporter#showCursor instead.');

    this.out(ansiEscapes.cursorShow);

    return this;
  }

  /**
   * Start the console by wrapping streams and buffering output.
   */
  start(args: any[] = []): this {
    if (this.state.started) {
      return this;
    }

    this.debug('Starting console render loop');
    this.emit('start', args);
    this.wrapStreams();
    this.displayHeader();
    this.state.started = true;

    return this;
  }

  /**
   * Automatically render the console in a timeout loop at 8 FPS.
   */
  startRenderLoop() {
    if (this.isSilent() || this.isDisabled() || this.renderTimer) {
      return;
    }

    this.renderTimer = setTimeout(() => {
      this.renderTimer = null;
      this.flushOutputQueue();
    }, FPS_RATE);
  }

  /**
   * Stop the console rendering process.
   */
  stop(error: Error | null = null) {
    if (this.state.stopped) {
      return;
    }

    if (error) {
      this.debug('Stopping console with an error');
      this.errorLogs.push(...this.logs);
      this.logs = [];
    } else {
      this.debug('Stopping console render loop');
    }

    this.renderFinalOutput(error);
    this.unwrapStreams();
    this.emit('stop', [error]);
    this.state.stopped = true;
    this.state.started = false;
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
  unwrapStreams() {
    if (this.isSilent() || process.env.NODE_ENV === 'test') {
      return;
    }

    ['stderr', 'stdout'].forEach(key => {
      const name = key as StreamType;

      if (!this.isStreamWrapped(name)) {
        return;
      }

      this.debug('Unwrapping `%s` stream', name);

      process[name].write = this.writers[name] as any;

      WRAPPED_STREAMS[name] = false;
    });
  }

  /**
   * Wrap the `stdout` and `stderr` streams and buffer the output as
   * to not collide with our render loop.
   */
  wrapStreams() {
    if (this.isSilent() || this.isDisabled() || process.env.NODE_ENV === 'test') {
      return;
    }

    ['stderr', 'stdout'].forEach(key => {
      const name = key as StreamType;
      const stream = process[name];
      let buffer = '';

      if (this.isStreamWrapped(name)) {
        return;
      }

      this.debug('Wrapping `%s` stream', name);

      this.bufferedStreams.add(() => {
        if (stream.isTTY && buffer) {
          this.writers[name](buffer);
        }

        buffer = '';
      });

      stream.write = (chunk: string) => {
        // No output, display immediately
        if (this.isEmptyQueue()) {
          this.writers[name](chunk);
        } else {
          buffer += String(chunk);
        }

        return true;
      };

      WRAPPED_STREAMS[name] = true;
    });
  }
}
