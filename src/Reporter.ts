/**
 * @copyright   2017, Miles Johnson
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
  isTTY: boolean;
  write(message: string): void;
}

export interface ReporterOptions extends Struct {
  footer: string;
  refreshRate: number;
  silent: boolean;
  slowThreshold: number;
  verbose: 0 | 1 | 2 | 3;
}

export default class Reporter<T, To extends ReporterOptions> extends Module<To>
  implements ModuleInterface {
  bufferedOutput: (() => void)[] = [];

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
    cli.on('start', () => {
      this.startTime = Date.now();
    });

    cli.on('stop', (event: any, error: Error) => {
      this.stopTime = Date.now();
      this.renderFinalOutput(error);
    });
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
    if (this.out.isTTY) {
      this.log('\x1Bc');
    }

    this.lastOutputHeight = 0;

    return this;
  }

  /**
   * Clear defined lines from the console.
   */
  clearLinesOutput(): this {
    if (!this.out.isTTY) {
      return this;
    }

    this.resetCursor();
    this.log('\x1B[1A\x1B[K'.repeat(this.lastOutputHeight));
    this.flushBufferedOutput();
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
    this.renderTimer = setTimeout(() => {
      this.clearLinesOutput();
      this.render();
      this.renderScheduled = false;
    }, this.options.refreshRate);

    return this;
  }

  /**
   * Flush buffered output after clearing lines rendered by the reporter.
   */
  flushBufferedOutput(): this {
    this.bufferedOutput.forEach(buffer => {
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
   * Hide the console cursor.
   */
  hideCursor(): this {
    if (!this.out.isTTY) {
      return this;
    }

    if (!this.restoreCursorOnExit) {
      process.on('exit', () => {
        this.showCursor();
      });
    }

    this.log('\x1B[?25l');
    this.restoreCursorOnExit = true;

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
      this.out.write(message + '\n'.repeat(nl));
      this.lastOutputHeight += nl;
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
   * Render an error and it's stack. TODO
   */
  renderError(error: Error): void {
    const message = chalk.red.bold(error.message);

    this.err.write(`\n${message}\n`);

    // Remove message line from stack
    if (error.stack) {
      const stack = chalk.gray(
        error.stack
          .split('\n')
          .slice(1)
          .join('\n'),
      );

      this.err.write(`\n${stack}\n`);
    }

    this.err.write('\n');
  }

  /**
   * Render the final output when an error occurs, or when all routines are complete.
   */
  renderFinalOutput(error?: Error | null) {
    if (this.renderTimer) {
      clearTimeout(this.renderTimer);
    }

    this.clearLinesOutput();
    this.render();

    if (error) {
      this.renderError(error);
    } else {
      this.renderFooter();
    }
  }

  /**
   * Render a footer after all other output.
   */
  renderFooter() {
    const { footer } = this.options;
    const time = this.getElapsedTime(this.startTime, this.stopTime, false);

    if (footer) {
      this.log(`${footer} ${chalk.gray(`(${time})`)}`, 1);
    } else {
      this.log(chalk.gray(`Ran in ${time}`), 1);
    }
  }

  /**
   * Reset the cursor back to the bottom of the console.
   */
  resetCursor(): this {
    if (this.out.isTTY) {
      this.log(`\x1B[${process.stdout.rows};0H`);
    }

    return this;
  }

  /**
   * Show the console cursor.
   */
  showCursor(): this {
    if (this.out.isTTY) {
      this.log('\x1B[?25h');
    }

    return this;
  }

  /**
   * Wrap a stream and buffer the output as to not collide with our reporter.
   */
  wrapStream(stream: NodeJS.WriteStream): WrappedStream {
    const originalWrite = stream.write.bind(stream);
    let buffer: string[] = [];

    const flushBuffer = () => {
      const output = buffer.join('');
      buffer = [];

      if (output) {
        originalWrite(output);
      }
    };

    this.bufferedOutput.push(flushBuffer);

    // eslint-disable-next-line no-param-reassign
    stream.write = (chunk: string) => {
      buffer.push(String(chunk));

      return true;
    };

    return {
      isTTY: stream.isTTY || false,
      write: originalWrite,
    };
  }
}
