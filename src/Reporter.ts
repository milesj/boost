/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import tty from 'tty';
import { Struct } from 'optimal';
import Console from './Console';
import Module, { ModuleInterface } from './Module';

export const isaTTY = tty.isatty(1) && tty.isatty(2);

export interface ReporterInterface extends ModuleInterface {
  bootstrap(console: Console): void;
  deleteLine(): this;
  hideCursor(): this;
  indent(length: number): string;
  moveToStartOfLine(): this;
  out(message: string): this;
  showCursor(): this;
}

export default class Reporter<To extends Struct> extends Module<To> {
  start: number = 0;

  stop: number = 0;

  bootstrap(console: Console) {
    console.on('start', () => {
      this.start = Date.now();
    });

    console.on('stop', () => {
      this.stop = Date.now();
    });
  }

  /**
   * Delete the last console line.
   */
  deleteLine(): this {
    if (isaTTY) {
      this.out('\u001B[2K');
    }

    return this;
  }

  /**
   * Hide the console cursor.
   */
  hideCursor(): this {
    if (isaTTY) {
      this.out('\u001B[?25l');
    }

    return this;
  }

  /**
   * Create an indentation based on the defined length.
   */
  indent(length: number): string {
    return '  '.repeat(length);
  }

  /**
   * Move cursor to start of console line.
   */
  moveToStartOfLine(): this {
    if (isaTTY) {
      this.out('\u001B[0G');
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

  /**
   * Show the console cursor.
   */
  showCursor(): this {
    if (isaTTY) {
      this.out('\u001B[?25h');
    }

    return this;
  }
}
