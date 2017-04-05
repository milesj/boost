/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import chalk from 'chalk';
import readline from 'readline';

import type { GlobalConfig } from './types';

export default class Console {
  global: GlobalConfig;
  groups: string[] = [];
  io: readline.Interface;

  constructor(globalConfig: GlobalConfig) {
    this.global = globalConfig;
    this.io = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * Request input from the client.
   */
  ask(question: string): Promise<string> {
    return new Promise((resolve: (string) => void) => {
      this.io.question(chalk.magenta(`${question}\n`), (answer: string) => {
        resolve(answer.trim());
      });
    });
  }

  /**
   * Close the readline streams.
   */
  close() {
    if (this.io) {
      this.io.close();
    }
  }

  /**
   * Output a message only when debug is enabled.
   */
  debug(message: string): this {
    if (this.global.config.debug) {
      this.log(`${chalk.blue('[debug]')} ${this.indent(this.groups.length)}${message}`);
    }

    return this;
  }

  /**
   * Start a capturing group, which will indent all incoming debug messages.
   */
  groupStart(group: string): this {
    this.debug(chalk.gray(`[${group}]`));
    this.groups.push(group);

    return this;
  }

  /**
   * End the current capturing group.
   */
  groupStop(): this {
    this.groups.pop();

    return this;
  }

  /**
   * Create an indentation based on the defined length.
   */
  indent(length: number): string {
    return '    '.repeat(length);
  }

  /**
   * Logs a debug message based on a conditional.
   */
  invariant(condition: boolean, message: string, pass: string, fail: string): this {
    this.debug(`${message}: ${condition ? chalk.green(pass) : chalk.red(fail)}`);

    return this;
  }

  /**
   * Output a message to the client.
   */
  log(message: string, newline: number = 1): this {
    this.io.write(`${message}${newline ? '\n'.repeat(newline) : ''}`);

    return this;
  }

  render() {
    // TODO
  }
}
