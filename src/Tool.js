/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import chalk from 'chalk';
import ConfigLoader from './ConfigLoader';
import isEmptyObject from './helpers/isEmptyObject';

import type { ToolConfig, PackageConfig } from './types';

export default class Tool {
  config: ToolConfig;
  debugs: string[] = [];
  debugGroups: string[] = [];
  name: string;
  package: PackageConfig;

  constructor(name: string) {
    this.name = name;
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
   * Load the package.json and local configuration files.
   *
   * Must be called first in the lifecycle.
   */
  loadConfig(): ToolConfig {
    const configLoader = new ConfigLoader(this.name);

    this.package = configLoader.loadPackageJSON();
    this.config = configLoader.loadConfig();

    return this.config;
  }

  /**
   * Register plugins from the loaded configuration.
   *
   * Must be called after config has been loaded.
   */
  loadPlugins() {
    if (isEmptyObject(this.config)) {
      throw new Error('Cannot load plugins as configuration has not been loaded.');
    }

    // TODO
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
