/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable unicorn/no-hex-escape */

import rl from 'readline';
import chalk from 'chalk';
import optimal, { bool, string, Struct } from 'optimal';
import { ConsoleInterface } from './Console';
import Module, { ModuleInterface } from './Module';
import { TaskInterface } from './Task';

const DEBOUNCE_MS = 25;

export interface ReporterOptions extends Struct {
  footer: string;
  silent: boolean;
}

export default class Reporter<T, To extends ReporterOptions> extends Module<To>
  implements ModuleInterface {
  hasOutput: boolean = false;

  lines: T[] = [];

  options: To;

  renderScheduled: boolean = false;

  renderTimer?: NodeJS.Timer;

  restoreCursorOnExit: boolean = false;

  startTime: number = 0;

  stopTime: number = 0;

  stream: NodeJS.WriteStream;

  constructor(options: Partial<To> = {}) {
    super(options);

    this.options = optimal(options, {
      footer: string().empty(),
      silent: bool(),
    });

    this.stream = process.stdout;
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

      if (this.renderTimer) {
        clearTimeout(this.renderTimer);
      }

      if (error) {
        this.renderError(error);
      } else {
        this.clearLinesOutput();
        this.render();
        this.renderFooter();
      }
    });
  }

  /**
   * Add a line to be rendered.
   */
  addLine(line: T): this {
    this.clearLinesOutput();
    this.lines.push(line);

    return this;
  }

  /**
   * Clear the entire console.
   */
  clearOutput(): this {
    if (this.stream.isTTY) {
      this.log('\x1Bc');
    }

    this.hasOutput = false;

    return this;
  }

  /**
   * Clear defined lines from the console.
   */
  clearLinesOutput(): this {
    if (!this.stream.isTTY || !this.hasOutput) {
      return this;
    }

    this.resetCursor();
    this.log('\x1B[1A\x1B[K'.repeat(this.lines.length));
    this.hasOutput = false;

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
      this.render();
      this.hasOutput = true;
      this.renderScheduled = false;
    }, DEBOUNCE_MS);

    return this;
  }

  /**
   * Hide the console cursor.
   */
  hideCursor(): this {
    if (!this.stream.isTTY) {
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
      this.stream.write(message + '\n'.repeat(nl));
    }

    return this;
  }

  /**
   * Remove a line to be rendered.
   */
  removeLine(callback: (item: T) => boolean): this {
    this.clearLinesOutput();
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
    this.log(chalk.red(String(error.stack)));
  }

  /**
   * Render a footer after all other output.
   */
  renderFooter() {
    const { footer } = this.options;
    // eslint-disable-next-line no-magic-numbers
    const time = ((this.stopTime - this.startTime) / 1000).toFixed(2);

    if (footer) {
      this.log(`${footer} ${chalk.gray(`(${time}s)`)}`, 1);
    } else {
      this.log(chalk.gray(`Ran in ${time}s`), 1);
    }
  }

  /**
   * Reset the cursor back to the bottom of the console.
   */
  resetCursor(): this {
    if (this.stream.isTTY) {
      rl.cursorTo(this.stream, 0, this.stream.rows);
    }

    return this;
  }

  /**
   * Show the console cursor.
   */
  showCursor(): this {
    if (this.stream.isTTY) {
      this.log('\x1B[?25h');
    }

    return this;
  }
}
