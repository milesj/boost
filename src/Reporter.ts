/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable unicorn/no-hex-escape, unicorn/escape-case */

import { Struct } from 'optimal';
import { ConsoleInterface } from './Console';
import Module, { ModuleInterface } from './Module';
import { TaskInterface } from './Task';

export const { isTTY } = process.stdout;

export interface ReporterInterface extends ModuleInterface {
  bootstrap(console: ConsoleInterface): void;
  clear(): this;
  clearLine(): this;
  hideCursor(): this;
  indent(length: number): string;
  moveToStartOfLine(): this;
  out(message: string): this;
  showCursor(): this;
}

export default class Reporter<To extends Struct = {}> extends Module<To> {
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
  clearLine(): this {
    if (isTTY) {
      // @ts-ignore
      process.stdout.clearLine();
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
   * Move cursor to start of console line.
   */
  moveToStartOfLine(line: number = 0): this {
    // if (isTTY) {
    //   readline.cursorTo(process.stdout, line, 0);
    // }

    return this;
  }

  /**
   * Log a message to `stdout` without a trailing newline or formatting.
   */
  out(message: string): this {
    process.stdout.write(message);

    return this;
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
