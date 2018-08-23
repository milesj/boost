/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable unicorn/no-hex-escape, no-param-reassign */

import optimal, { bool, number, string } from 'optimal';
import Emitter from './Emitter';

export const REFRESH_RATE = 100;
export const BG_REFRESH_RATE = 500;

export type WrappedStream = (message: string) => void;

export interface ConsoleOptions {
  footer: string;
  header: string;
  level: 0 | 1 | 2 | 3;
  silent: boolean;
  theme: string;
}

export default class Console extends Emitter {
  bufferedOutput: string = '';

  bufferedStreams: (() => void)[] = [];

  err: WrappedStream;

  errorLogs: string[] = [];

  refreshTimer: NodeJS.Timer | null = null;

  lastOutputHeight: number = 0;

  logs: string[] = [];

  options: ConsoleOptions;

  out: WrappedStream;

  renderTimer: NodeJS.Timer | null = null;

  restoreCursorOnExit: boolean = false;

  constructor(options: Partial<ConsoleOptions> = {}) {
    super();

    this.options = optimal(
      options,
      {
        footer: string().empty(),
        header: string().empty(),
        level: number(3).between(0, 3, true),
        silent: bool(),
        theme: string('default'),
      },
      {
        name: this.constructor.name,
      },
    );

    /* istanbul ignore next */
    if (process.env.NODE_ENV === 'test') {
      this.err = () => {};
      this.out = () => {};
    } else {
      this.err = this.wrapStream(process.stderr);
      this.out = this.wrapStream(process.stdout);

      this.startBackgroundTimer();

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
    this.out('\x1Bc');
    this.lastOutputHeight = 0;

    return this;
  }

  /**
   * Clear defined lines from the console.
   */
  clearLinesOutput(): this {
    this.out('\x1B[1A\x1B[K'.repeat(this.lastOutputHeight));
    this.lastOutputHeight = 0;

    return this;
  }

  /**
   * Display a footer after all final output.
   */
  displayFooter() {
    const { footer } = this.options;

    if (footer) {
      this.write(footer, 1);
    }
  }

  /**
   * Display a header before all final output.
   */
  displayHeader() {
    const { header } = this.options;

    if (header) {
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

    this.emit('stop', [error, code]);

    // Render final output
    this.handleFinalRender(error);

    // Unwrap our streams
    this.unwrapStream(process.stderr);
    this.unwrapStream(process.stdout);

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
      this.out(lines);
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
    this.emit('render');

    if (error) {
      this.emit('error', [error]);
    } else if (this.errorLogs.length > 0) {
      this.displayLogs(this.errorLogs);
    } else if (this.logs.length > 0) {
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
  };

  /**
   * Handle SIGINT and SIGTERM interruptions.
   */
  handleSignal = () => {
    this.exit('Process has been terminated.', 1, true);
  };

  /**
   * Hide the console cursor.
   */
  hideCursor(): this {
    this.out('\x1B[?25l');

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
    this.out(`\x1B[${process.stdout.rows};0H`);

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
    this.out('\x1B[?25h');

    return this;
  }

  /**
   * Automatically refresh in the background if some tasks are taking too long.
   */
  startBackgroundTimer() {
    this.refreshTimer = setTimeout(() => {
      this.handleRender();
      this.startBackgroundTimer();
    }, BG_REFRESH_RATE);
  }

  /**
   * Unwrap a stream and reset it back to normal.
   */
  unwrapStream(stream: NodeJS.WriteStream): void {
    if (process.env.NODE_ENV !== 'test') {
      // @ts-ignore
      stream.write = stream.originalWrite;
    }
  }

  /**
   * Wrap a stream and buffer the output as to not collide with our reporter.
   */
  /* istanbul ignore next */
  wrapStream(stream: NodeJS.WriteStream): WrappedStream {
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
    if (this.options.silent) {
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
