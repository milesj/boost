/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import chalk from 'chalk';
import pluralize from 'pluralize';
import Options, { bool, string } from 'optimal';
import ConfigLoader from './ConfigLoader';
import Console from './Console';
import Emitter from './Emitter';
import ModuleLoader from './ModuleLoader';
import Plugin from './Plugin';
import Reporter from './Reporter';
import isEmptyObject from './helpers/isEmptyObject';
import { DEFAULT_TOOL_CONFIG } from './constants';

import type { ToolConfig, ToolOptions, PackageConfig } from './types';

export default class Tool<Tp: Plugin<*>, Tr: Reporter<*>> extends Emitter {
  argv: string[];

  config: ToolConfig = { ...DEFAULT_TOOL_CONFIG };

  configLoader: ConfigLoader;

  console: Console<Tr>;

  initialized: boolean = false;

  options: ToolOptions;

  package: PackageConfig;

  pluginLoader: ModuleLoader<Tp>;

  plugins: Tp[] = [];

  constructor({ footer, header, ...options }: $Shape<ToolOptions>, argv?: string[] = []) {
    super();

    this.argv = argv;
    this.options = new Options(options, {
      appName: string().required(),
      configFolder: string('./configs'),
      extendArgv: bool(true),
      pluginAlias: string('plugin'),
      root: string(process.cwd()),
      scoped: bool(),
    }, {
      name: 'Tool',
    });

    // Initialize the console first we can start debugging
    // $FlowFixMe Why's it failing?
    this.console = new Console(new Reporter(), {
      footer,
      header,
    });

    // Avoid binding listeners while testing
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    // Cleanup when an exit occurs
    /* istanbul ignore next */
    process.on('exit', (code) => {
      this.emit('exit', [code]);
    });
  }

  /**
   * Log a message only when debug is enabled.
   */
  debug(message: string): this {
    this.console.debug(message);

    return this;
  }

  /**
   * Force exit the application.
   */
  exit(message: string | Error | null, code?: number = 1): this {
    this.console.exit(message, code);

    return this;
  }

  /**
   * Get a plugin by name.
   */
  getPlugin(name: string): Tp {
    const plugin = this.plugins.find(p => p.name === name);

    if (!plugin) {
      throw new Error(
        `Failed to find ${this.options.pluginAlias} "${name}". Have you installed it?`,
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

    const { appName } = this.options;

    this.debug(`Initializing ${chalk.green(appName)}`);

    this.console.startDebugGroup(appName);
    this.loadConfig();
    this.loadPlugins();
    this.loadReporter();
    this.console.stopDebugGroup();

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

    this.console.startDebugGroup('config');

    this.configLoader = new ConfigLoader(this);
    this.package = this.configLoader.loadPackageJSON();
    this.config = this.configLoader.loadConfig();

    // Inherit from argv
    if (this.options.extendArgv) {
      this.argv.forEach((arg) => {
        if (arg === '--debug' || arg === '--silent') {
          const name = arg.slice(2);

          this.config[name] = true;
          this.console.options[name] = true;
        }
      });
    }

    this.console.stopDebugGroup();

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

    const { pluginAlias } = this.options;
    const pluralPluginAlias = pluralize(pluginAlias);

    if (isEmptyObject(this.config)) {
      throw new Error(`Cannot load ${pluralPluginAlias} as configuration has not been loaded.`);
    }

    this.console.startDebugGroup('plugin');

    // $FlowFixMe
    this.pluginLoader = new ModuleLoader(this, pluginAlias, Plugin);
    this.plugins = this.pluginLoader.loadModules(this.config[pluralPluginAlias]);

    // Sort plugins by priority
    this.plugins.sort((a, b) => a.priority - b.priority);

    // Bootstrap each plugin with the tool
    this.plugins.forEach((plugin) => {
      plugin.tool = this; // eslint-disable-line no-param-reassign
      plugin.bootstrap();
    });

    this.console.stopDebugGroup();

    return this;
  }

  /**
   * Register a reporter from the loaded configuration.
   *
   * Must be called after config has been loaded.
   */
  loadReporter(): this {
    if (this.initialized) {
      return this;
    }

    if (isEmptyObject(this.config)) {
      throw new Error('Cannot load reporter as configuration has not been loaded.');
    }

    this.console.startDebugGroup('reporter');

    const { reporter } = this.config;

    // Load based on name
    if (reporter) {
      // $FlowFixMe
      this.console.reporter = new ModuleLoader(this, 'reporter', Reporter).loadModule(reporter);

    // Use native Boost reporter
    } else {
      this.debug(`Using native ${chalk.green('boost')} reporter`);
    }

    this.console.stopDebugGroup();

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
}
