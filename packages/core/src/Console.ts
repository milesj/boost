/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable unicorn/no-hex-escape, no-param-reassign */

import Emitter from './Emitter';
import Tool from './Tool';
import { Debugger } from './types';

export const REFRESH_RATE = 100;
export const BG_REFRESH_RATE = 500;

export type WrappedStream = (message: string) => void;

export default class Console extends Emitter {
  bufferedOutput: string = '';

  bufferedStreams: (() => void)[] = [];

  debug: Debugger;

  err?: WrappedStream;

  errorLogs: string[] = [];

  refreshTimer: NodeJS.Timer | null = null;

  lastOutputHeight: number = 0;

  logs: string[] = [];

  out?: WrappedStream;

  renderTimer: NodeJS.Timer | null = null;

  restoreCursorOnExit: boolean = false;

  tool: Tool;

  constructor(tool: Tool) {
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
   * Clear the entire console.
   */
  clearOutput(): this {
    this.out!('\x1Bc');
    this.lastOutputHeight = 0;

    return this;
  }

  /**
   * Clear defined lines from the console.
   */
  clearLinesOutput(): this {
    this.out!('\x1B[1A\x1B[K'.repeat(this.lastOutputHeight));
    this.lastOutputHeight = 0;

    return this;
  }

  /**
   * Display a footer after all final output.
   */
  displayFooter() {
    const { footer } = this.tool.options;

    if (footer) {
      this.debug('Displaying console footer');
      this.write(footer, 1);
    }
  }

  /**
   * Display a header before all final output.
   */
  displayHeader() {
    const { header } = this.tool.options;

    if (header) {
      this.debug('Displaying console header');
      this.write(header, 1);
    }
  }

  /**
   * Display logs in the final output.
   */
  displayLogs(logs: string[]) {
    if (logs.length > 0) {
      this.write(`\n${logs.join('\n')}\n`);
    }
  }

  /**
   * Force exit the application.
   */
  exit(message: string | Error | null, code: number = 1, force: boolean = false) {
    let error = null;

    if (message !== null) {
      error = message instanceof Error ? message : new Error(message);
    }

    if (error) {
      this.debug('Exiting console with an error: %s', error.message);
    } else {
      this.debug('Exiting console');
    }

    this.emit('stop', [error, code]);

    // Render final output
    this.handleFinalRender(error);

    // Unwrap our streams
    this.err = this.unwrapStream(process.stderr, 'stderr');
    this.out = this.unwrapStream(process.stdout, 'stdout');

    // Run in the next tick so that listeners have a chance to run
    process.nextTick(() => {
      if (force) {
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(code);
      } else {
        process.exitCode = code;
      }
    });
  }

  /**
   * Flush buffered output that has been logged.
   */
  flushBufferedOutput(): this {
    const lines = this.bufferedOutput;

    if (lines) {
      this.out!(lines);
      this.lastOutputHeight = Math.max(lines.split('\n').length - 1, 0);
    }

    this.bufferedOutput = '';

    return this;
  }

  /**
   * Flush buffered streams output after clearing lines rendered by the reporter.
   */
  flushBufferedStreams(): this {
    this.bufferedStreams.forEach(buffer => {
      buffer();
    });

    return this;
  }

  /**
   * Handle uncaught exceptions and unhandled rejections that bubble up.
   */
  handleFailure = (error: Error) => {
    this.start();
    this.debug('Uncaught exception or unresolved promise handled. Terminating.');
    this.exit(error, 1, true);
  };

  /**
   * Handle the final render before exiting.
   */
  handleFinalRender = (error: Error | null = null) => {
    this.resetTimers();
    this.clearLinesOutput();
    this.flushBufferedStreams();
    this.displayHeader();

    if (error) {
      this.emit('render');
      this.displayLogs(this.errorLogs);
      this.emit('error', [error]);
    } else {
      this.emit('render');
      this.displayLogs(this.logs);
    }

    this.displayFooter();
    this.flushBufferedOutput();
    this.flushBufferedStreams();

    // Remover listeners so that we avoid unwanted re-renders
    this.flushListeners('render');
    this.flushListeners('error');
  };

  /**
   * Handle the entire rendering and flushing process.
   */
  handleRender = (error: Error | null = null, final: boolean = false) => {
    this.resetTimers();
    this.clearLinesOutput();
    this.flushBufferedStreams();
    this.emit('render');

    if (error) {
      this.emit('error', [error]);
    }

    this.flushBufferedOutput();
    this.startBackgroundTimer();
  };

  /**
   * Handle SIGINT and SIGTERM interruptions.
   */
  handleSignal = () => {
    this.start();
    this.debug('SIGINT or SIGTERM handled. Terminating.');
    this.exit('Process has been terminated.', 1, true);
  };

  /**
   * Hide the console cursor.
   */
  hideCursor(): this {
    this.out!('\x1B[?25l');

    if (!this.restoreCursorOnExit) {
      this.restoreCursorOnExit = true;

      /* istanbul ignore next */
      process.on('exit', () => {
        this.showCursor();
      });
    }

    return this;
  }

  /**
   * Store the log message.
   */
  log(message: string): this {
    this.logs.push(message);

    return this;
  }

  /**
   * Store the error message.
   */
  logError(message: string): this {
    this.errorLogs.push(message);

    return this;
  }

  /**
   * Debounce the render as to avoid tearing.
   */
  render(): this {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    if (!this.renderTimer) {
      this.renderTimer = setTimeout(() => {
        this.handleRender();
      }, REFRESH_RATE);
    }

    return this;
  }

  /**
   * Reset the cursor back to the bottom of the console.
   */
  resetCursor(): this {
    this.out!(`\x1B[${process.stdout.rows};0H`);

    return this;
  }

  /**
   * Reset both the render and background refresh timers.
   */
  resetTimers(): this {
    if (this.renderTimer) {
      clearTimeout(this.renderTimer);
      this.renderTimer = null;
    }

    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    return this;
  }

  /**
   * Show the console cursor.
   */
  showCursor(): this {
    this.out!('\x1B[?25h');

    return this;
  }

  /**
   * Start the console by wrapping streams and buffering output.
   */
  start(args: any[] = []): this {
    if (!this.err) {
      this.err = this.wrapStream(process.stderr, 'stderr');
    }

    if (!this.out) {
      this.out = this.wrapStream(process.stdout, 'stdout');
    }

    this.debug('Starting console rendering process');
    this.emit('start', args);
    this.startBackgroundTimer();

    return this;
  }

  /**
   * Automatically refresh in the background if some tasks are taking too long.
   */
  startBackgroundTimer() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    this.refreshTimer = setTimeout(() => {
      this.handleRender();
    }, BG_REFRESH_RATE);
  }

  /**
   * Unwrap a stream and reset it back to normal.
   */
  unwrapStream(stream: NodeJS.WriteStream, name: string): undefined {
    this.debug('Unwrapping %s stream', name);

    if (process.env.NODE_ENV !== 'test') {
      // @ts-ignore
      stream.write = stream.originalWrite;
    }

    return undefined;
  }

  /**
   * Wrap a stream and buffer the output as to not collide with our reporter.
   */
  /* istanbul ignore next */
  wrapStream(stream: NodeJS.WriteStream, name: string): WrappedStream {
    this.debug('Wrapping %s stream', name);

    const originalWrite = stream.write.bind(stream);

    if (process.env.NODE_ENV === 'test') {
      return originalWrite;
    }

    let buffer = '';

    const write = (message: string) => {
      if (stream.isTTY) {
        originalWrite(message);
      }
    };

    const flush = () => {
      if (stream.isTTY && buffer) {
        originalWrite(buffer);
      }

      buffer = '';
    };

    this.bufferedStreams.push(flush);

    stream.write = (chunk: string) => {
      buffer += String(chunk);

      return true;
    };

    // @ts-ignore
    stream.originalWrite = originalWrite;

    return write;
  }

  /**
   * Log a message to `stdout` without a trailing newline or formatting.
   */
  write(message: string, nl: number = 0, prepend: boolean = false): this {
    if (this.tool.config.silent) {
      return this;
    }

    const buffer = message + '\n'.repeat(nl);

    if (prepend) {
      this.bufferedOutput = buffer + this.bufferedOutput;
    } else {
      this.bufferedOutput += buffer;
    }

    return this;
  }
}
