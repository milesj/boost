/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import chalk from 'chalk';
import readline from 'readline';

import type { RoutineConfig } from './types';

export default class Console {
  config: RoutineConfig = {};
  groups: string[] = [];
  io: readline.Interface;

  constructor(config: RoutineConfig) {
    this.config = config;
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
      this.io.question(chalk.magenta(question), (answer: string) => {
        this.io.close();
        resolve(answer);
      });
    });
  }

  /**
   * Output a message only when debug is enabled.
   */
  debug(message: string): this {
    if (this.config.debug) {
      this.io.write(`${this.indent(this.groups.length)}${message}`);
    }

    return this;
  }

  /**
   * Start a capturing group, which will indent all incoming debug messages.
   */
  groupStart(group: string): this {
    this.debug(`[${group}]`);
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
   * Output a message to the client.
   */
  log(message: string): this {
    this.io.write(message);

    return this;
  }
}
