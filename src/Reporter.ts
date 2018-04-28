/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable unicorn/no-hex-escape */

import rl from 'readline';
import chalk from 'chalk';
import optimal, { bool, number, string, Struct } from 'optimal';
import { ConsoleInterface } from './Console';
import Module, { ModuleInterface } from './Module';
import { TaskInterface } from './Task';

export const REFRESH_RATE = 100;
export const SLOW_THRESHOLD = 10000; // ms

export interface WrappedStream {
  (message: string): boolean;
}

export interface ReporterOptions extends Struct {
  footer: string;
  refreshRate: number;
  silent: boolean;
  slowThreshold: number;
  verbose: 0 | 1 | 2 | 3;
}

export interface ReporterInterface extends ModuleInterface {
  err: WrappedStream;
  out: WrappedStream;
}

export default class Reporter<T, To extends ReporterOptions> extends Module<To>
  implements ReporterInterface {
  bufferedOutput: string = '';

  bufferedStreams: (() => void)[] = [];

  err: WrappedStream;

  lastOutputHeight: number = 0;

  lines: T[] = [];

  options: To;

  out: WrappedStream;

  renderScheduled: boolean = false;

  renderTimer?: NodeJS.Timer;

  restoreCursorOnExit: boolean = false;

  startTime: number = 0;

  stopTime: number = 0;

  constructor(options: Partial<To> = {}) {
    super(options);

    this.options = optimal(
      options,
      {
        footer: string().empty(),
        refreshRate: number(REFRESH_RATE),
        silent: bool(),
        slowThreshold: number(SLOW_THRESHOLD),
        verbose: number(0).between(0, 3, true),
      },
      {
        name: this.constructor.name,
        unknown: true,
      },
    );

    this.err = this.wrapStream(process.stderr);
    this.out = this.wrapStream(process.stdout);
  }

  /**
   * Register console listeners.
   */
  bootstrap(cli: ConsoleInterface) {
    cli.on('start', this.handleBaseStart);
    cli.on('stop', this.handleBaseStop);
  }

  /**
   * Add a line to be rendered.
   */
  addLine(line: T): this {
    this.lines.push(line);

    return this;
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
   * Debounce the render as to avoid tearing.
   */
  debounceRender(): this {
    if (this.renderScheduled) {
      return this;
    }

    this.renderScheduled = true;
    this.renderTimer = setTimeout(this.handleRender, this.options.refreshRate);

    return this;
  }

  /**
   * Display an error and it's stack.
   */
  displayError(error: Error): void {
    this.err(`\n${chalk.red.bold(error.message)}\n`);

    // Remove message line from stack
    if (error.stack) {
      const stack = chalk.gray(
        error.stack
          .split('\n')
          .slice(1)
          .join('\n'),
      );

      this.err(`\n${stack}\n`);
    }

    this.err('\n');
  }

  /**
   * Display the final output when an error occurs, or when all routines are complete.
   */
  displayFinalOutput(error?: Error | null) {
    if (this.renderTimer) {
      clearTimeout(this.renderTimer);
    }

    this.handleRender();

    if (error) {
      this.displayError(error);
    } else {
      this.displayFooter();
    }
  }

  /**
   * Display a footer after all other output.
   */
  displayFooter() {
    const { footer } = this.options;
    const time = this.getElapsedTime(this.startTime, this.stopTime, false);

    if (footer) {
      this.out(`${footer} ${chalk.gray(`(${time})`)}\n`);
    } else {
      this.out(chalk.gray(`Ran in ${time}\n`));
    }
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
   * Calculate the elapsed time and highlight as red if over the threshold.
   */
  getElapsedTime(start: number, stop: number, highlight: boolean = true): string {
    const time = stop - start;
    const isSlow = time > this.options.slowThreshold;

    // eslint-disable-next-line no-magic-numbers
    const elapsed = `${(time / 1000).toFixed(2)}s`;

    return isSlow && highlight ? chalk.red(elapsed) : elapsed;
  }

  /**
   * Handle the entire rendering and flushing process.
   */
  handleRender = () => {
    this.clearLinesOutput();
    this.flushBufferedStreams();
    this.render();
    this.flushBufferedOutput();
    this.renderScheduled = false;
  };

  /**
   * Set start time.
   */
  handleBaseStart = () => {
    this.startTime = Date.now();
  };

  /**
   * Set stop time and render.
   */
  handleBaseStop = (event: any, error: Error | null) => {
    this.stopTime = Date.now();
    this.displayFinalOutput(error);
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
   * Create an indentation based on the defined length.
   */
  indent(length: number = 0): string {
    return ' '.repeat(length);
  }

  /**
   * Log a message to `stdout` without a trailing newline or formatting.
   */
  log(message: string, nl: number = 0): this {
    if (!this.options.silent) {
      this.bufferedOutput += message + '\n'.repeat(nl);
    }

    return this;
  }

  /**
   * Remove a line to be rendered.
   */
  removeLine(callback: (item: T) => boolean): this {
    this.lines = this.lines.filter(line => !callback(line));

    return this;
  }

  /**
   * Render output.
   */
  render() {
    this.lines.forEach(line => {
      this.log(String(line), 1);
    });
  }

  /**
   * Reset the cursor back to the bottom of the console.
   */
  resetCursor(): this {
    this.out(`\x1B[${process.stdout.rows};0H`);

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

      return true;
    };

    const flushBuffer = () => {
      if (buffer) {
        originalWrite(buffer);
      }

      buffer = '';
    };

    this.bufferedStreams.push(flushBuffer);

    // eslint-disable-next-line no-param-reassign
    stream.write = (chunk: string) => {
      buffer += String(chunk);

      return true;
    };

    return write;
  }
}
