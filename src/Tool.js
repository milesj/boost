/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import chalk from 'chalk';
import Emitter from './Emitter';
import Plugin from './Plugin';
import Renderer from './Renderer';

import type { CommandOptions, ToolConfig, PackageConfig } from './types';

export default class Tool extends Emitter {
  appName: string;
  chalk: typeof chalk;
  command: CommandOptions;
  config: ToolConfig;
  debugs: string[] = [];
  debugGroups: string[] = [];
  package: PackageConfig;
  plugins: Plugin[] = [];
  renderer: Renderer;

  constructor(appName: string) {
    super();

    this.appName = appName;
    this.chalk = chalk;
    this.renderer = new Renderer();
  }

  /**
   * Close the current Vorpal interface instance.
   */
  closeConsole(): this {
    // TODO
    return this;
  }

  /**
   * Log a message only when debug is enabled.
   */
  debug(message: string): this {
    if (this.config.debug) {
      this.debugs.push(
        `${chalk.blue('[debug]')} ${this.renderer.indent(this.debugGroups.length)}${message}`,
      );
    }

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
   * Trigger a render.
   */
  render(): this {
    // TODO
    return this;
  }

  /**
   * Start a debug capturing group, which will indent all incoming debug messages.
   */
  startDebugGroup(group: string): this {
    this.debug(chalk.gray(`[${group}]`));
    this.debugGroups.push(group);

    return this;
  }

  /**
   * End the current debug capturing group.
   */
  stopDebugGroup(): this {
    this.debugGroups.pop();

    return this;
  }
}
