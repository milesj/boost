/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import chalk from 'chalk';
import Renderer from './Renderer';

import type { Config } from './types';

export default class Console {
  global: Config;
  groups: string[] = [];
  renderer: Renderer;

  constructor(renderer: Renderer, globalConfig: Config) {
    this.global = globalConfig;
    this.renderer = renderer;
  }

  /**
   * Output a message only when debug is enabled.
   */
  debug(message: string): this {
    if (this.global.config.debug) {
      this.log(`${chalk.blue('[debug]')} ${this.renderer.indent(this.groups.length)}${message}`);
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

  /**
   * Trigger a render.
   */
  render() {
    this.renderer.update();
  }
}
