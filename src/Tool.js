/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import chalk from 'chalk';
import pluralize from 'pluralize';
import Options, { string } from 'optimal';
import ConfigLoader from './ConfigLoader';
import Emitter from './Emitter';
import Plugin from './Plugin';
import PluginLoader from './PluginLoader';
import Renderer from './Renderer';
import isEmptyObject from './helpers/isEmptyObject';

import type { ToolConfig, ToolOptions, PackageConfig } from './types';

export default class Tool extends Emitter {
  chalk: typeof chalk;

  config: ToolConfig;

  debugs: string[] = [];

  debugGroups: string[] = [];

  initialized: boolean = false;

  options: ToolOptions;

  package: PackageConfig;

  plugins: Plugin[] = [];

  renderer: Renderer;

  constructor(options?: Object = {}) {
    super();

    this.options = new Options(options, {
      appName: string(),
      pluginName: string('plugin'),
    }, {
      name: 'Tool',
    });

    this.chalk = chalk;
    this.renderer = new Renderer();
  }

  /**
   * Bootstrap plugins by registering event listeners and passing the tool object.
   */
  bootstrapPlugins(): this {
    // TODO
    return this;
  }

  /**
   * Close the current CLI instance.
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
   * Initialize the tool by loading config and plugins.
   */
  initialize() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    this.loadConfig();
    this.loadPlugins();
    this.bootstrapPlugins();
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
  loadConfig(): this {
    const configLoader = new ConfigLoader(this.options);

    this.package = configLoader.loadPackageJSON();
    this.config = configLoader.loadConfig();

    return this;
  }

  /**
   * Register plugins from the loaded configuration.
   *
   * Must be called after config has been loaded.
   */
  loadPlugins(): this {
    const pluralPluginName = pluralize(this.options.pluginName);

    if (isEmptyObject(this.config)) {
      throw new Error(`Cannot load ${pluralPluginName} as configuration has not been loaded.`);
    }

    this.plugins = new PluginLoader(this.options).loadPlugins(this.config[pluralPluginName]);

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
   * Set the renderer that controls the CLI output.
   */
  setRenderer(renderer: Renderer): this {
    if (renderer instanceof Renderer) {
      this.renderer = renderer;
    } else {
      throw new TypeError('Invalid renderer, must be an instance of `Renderer`.');
    }

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
