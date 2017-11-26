/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import chalk from 'chalk';
import pluralize from 'pluralize';
import Options, { bool, instance, string } from 'optimal';
import ConfigLoader from './ConfigLoader';
import Console from './Console';
import Emitter from './Emitter';
import Plugin from './Plugin';
import PluginLoader from './PluginLoader';
import Renderer from './Renderer';
import isEmptyObject from './helpers/isEmptyObject';
import { DEFAULT_TOOL_CONFIG } from './constants';

import type { ToolConfig, ToolOptions, PackageConfig } from './types';

export default class Tool<Tp: Plugin<*>, Tr: Renderer<*>> extends Emitter {
  config: ToolConfig = { ...DEFAULT_TOOL_CONFIG };

  configLoader: ConfigLoader;

  console: Console<Tr>;

  initialized: boolean = false;

  options: ToolOptions;

  package: PackageConfig;

  pluginLoader: PluginLoader<Tp>;

  plugins: Tp[] = [];

  constructor(options: Object) {
    super();

    this.options = new Options(options, {
      appName: string(),
      pluginName: string('plugin'),
      renderer: instance(Renderer).nullable(),
      root: string(process.cwd()),
      scoped: bool(),
      title: string().empty(),
    }, {
      name: 'Tool',
    });

    // $FlowIgnore
    this.console = new Console(this.options.renderer || new Renderer());
  }

  /**
   * Log a message only when debug is enabled.
   */
  debug(message: string): this {
    if (this.config.debug) {
      this.console.debug(message);
    }

    return this;
  }

  /**
   * Get a plugin by name.
   */
  getPlugin(name: string): Tp {
    const plugin = this.plugins.find(p => p.name === name);

    if (!plugin) {
      throw new Error(
        `Failed to find ${this.options.pluginName} "${name}". Have you installed it?`,
      );
    }

    return plugin;
  }

  /**
   * Initialize the tool by loading config and plugins.
   */
  initialize(): this {
    if (this.initialized) {
      return this;
    }

    this.loadConfig();
    this.loadPlugins();
    this.initialized = true;

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
  loadConfig(): this {
    if (this.initialized) {
      return this;
    }

    this.configLoader = new ConfigLoader(this.options);
    this.package = this.configLoader.loadPackageJSON();
    this.config = this.configLoader.loadConfig();

    return this;
  }

  /**
   * Add a message to the output log.
   */
  log(message: string): this {
    this.console.log(message);

    return this;
  }

  /**
   * Add a message to the logError log.
   */
  logError(message: string): this {
    this.console.error(message);

    return this;
  }

  /**
   * Register plugins from the loaded configuration.
   *
   * Must be called after config has been loaded.
   */
  loadPlugins(): this {
    if (this.initialized) {
      return this;
    }

    const pluralPluginName = pluralize(this.options.pluginName);

    if (isEmptyObject(this.config)) {
      throw new Error(`Cannot load ${pluralPluginName} as configuration has not been loaded.`);
    }

    this.pluginLoader = new PluginLoader(this.options);
    this.plugins = this.pluginLoader.loadPlugins(this.config[pluralPluginName]);

    // Bootstrap each plugin with the tool
    this.plugins.forEach((plugin) => {
      // eslint-disable-next-line no-param-reassign
      plugin.tool = this;
      plugin.bootstrap();
    });

    return this;
  }
}
