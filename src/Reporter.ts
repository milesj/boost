/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import tty from 'tty';
import ora from 'ora';
import chalk from 'chalk';
import { Struct } from 'optimal';
import { ConsoleInterface } from './Console';
import Module, { ModuleInterface } from './Module';

export const isaTTY = tty.isatty(1) && tty.isatty(2);

export interface ReporterInterface extends ModuleInterface {
  bootstrap(console: ConsoleInterface): void;
  deleteLine(): this;
  hideCursor(): this;
  indent(message: string, length?: number): string;
  moveToStartOfLine(): this;
  out(message: string): this;
  showCursor(): this;
}

export default class Reporter<To extends Struct> extends Module<To> {
  depth: number = 0;

  stack: string[] = [];

  start: number = 0;

  stop: number = 0;

  bootstrap(cli: ConsoleInterface) {
    const spinners = new Map();

    cli.on('start', () => {
      console.log('START', Date.now());
      this.start = Date.now();
    });

    cli.on('stop', (event, error) => {
      console.log('STOP', Date.now(), error);
      this.stop = Date.now();
    });

    cli.on('task', (event, task) => {
      const lastStack = this.stack[this.stack.length - 1];
      console.log(this.stack);

      if (lastStack === 'task') {
        // @ts-ignore
        process.stdout.clearLine(0);
        this.stack.pop();
      }

      const spinner = ora(this.indent(task.title, this.depth)).start();

      if (task.isSkipped()) {
        spinner.warn(this.indent(`${task.title} ${chalk.yellow('[skipped]')}`, this.depth));
      }

      spinners.set(task, spinner);
      this.stack.push('task');
    });

    cli.on('task.pass', (event, task) => {
      spinners.get(task).succeed();
    });

    cli.on('task.fail', (event, task) => {
      spinners.get(task).fail();
    });

    cli.on('routine', (event, routine) => {
      const spinner = ora(routine.title).start();

      spinners.set(routine, spinner);
      this.depth += 1;
      this.stack.push('routine');
    });

    cli.on('routine.pass', (event, routine) => {
      const spinner = spinners.get(routine);

      spinner.succeed();
      this.depth -= 1;
      this.stack.pop();
    });

    cli.on('routine.fail', (event, routine) => {
      const spinner = spinners.get(routine);

      spinner.fail();
      this.depth -= 1;
      this.stack.pop();
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
  indent(message: string, length: number = 0): string {
    return '  '.repeat(length) + message;
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
