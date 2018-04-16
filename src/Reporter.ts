/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable unicorn/no-hex-escape, unicorn/escape-case */

import rl from 'readline';
import { Struct } from 'optimal';
import { ConsoleInterface } from './Console';
import Module, { ModuleInterface } from './Module';
import { TaskInterface } from './Task';
import chalk from 'chalk';

export const { isTTY } = process.stdout;

export default class Reporter<To extends Struct = {}> extends Module<To>
  implements ModuleInterface {
  restoreCursorOnExit: boolean = false;

  start: number = 0;

  stop: number = 0;

  /**
   * Register console listeners.
   */
  bootstrap(cli: ConsoleInterface) {
    cli.on('start', () => {
      this.start = Date.now();
    });

    cli.on('stop', () => {
      this.stop = Date.now();
    });
  }

  /**
   * Clear the entire console.
   */
  clear(): this {
    if (isTTY) {
      this.out('\x1Bc');
    }

    return this;
  }

  /**
   * Clear the last console line.
   */
  clearLastLine(): this {
    if (isTTY) {
      rl.moveCursor(process.stdout, 0, -1);
      rl.clearLine(process.stdout, 0);
    }

    return this;
  }

  /**
   * Hide the console cursor.
   */
  hideCursor(): this {
    if (!isTTY) {
      return this;
    }

    if (!this.restoreCursorOnExit) {
      process.on('exit', () => {
        this.showCursor();
      });
    }

    this.out('\u001b[?25l');
    this.restoreCursorOnExit = true;

    return this;
  }

  /**
   * Create an indentation based on the defined length.
   */
  indent(length: number = 0): string {
    return '  '.repeat(length);
  }

  /**
   * Move cursor to the last console line (where commands are input).
   */
  moveToLastLine(): this {
    if (isTTY) {
      rl.cursorTo(process.stdout, 0, process.stdout.rows);
    }

    return this;
  }

  /**
   * Log a message to `stdout` without a trailing newline or formatting.
   */
  out(message: string): this {
    process.stdout.write(message);

    return this;
  }

  renderError(error: Error): void {
    console.log(chalk.red(String(error.stack)));
  }

  /**
   * Show the console cursor.
   */
  showCursor(): this {
    if (isTTY) {
      this.out('\u001b[?25h');
    }

    return this;
  }
}
