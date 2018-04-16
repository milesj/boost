/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import chalk from 'chalk';
import debug from 'debug';
import pluralize from 'pluralize';
import optimal, { bool, object, string } from 'optimal';
import ConfigLoader from './ConfigLoader';
import Console, { ConsoleInterface } from './Console';
import Emitter, { EmitterInterface } from './Emitter';
import ModuleLoader from './ModuleLoader';
import Plugin, { PluginInterface } from './Plugin';
import Reporter, { ReporterInterface } from './Reporter';
import DefaultReporter from './DefaultReporter';
import enableDebug from './helpers/enableDebug';
import isEmptyObject from './helpers/isEmptyObject';
import { DEFAULT_TOOL_CONFIG } from './constants';
import { ToolConfig, ToolOptions, PackageConfig } from './types';

export interface ToolInterface extends EmitterInterface {
  argv: string[];
  config: ToolConfig;
  console: ConsoleInterface;
  options: ToolOptions;
  package: PackageConfig;
  plugins: PluginInterface[];
  createDebugger(...namespaces: string[]): debug.IDebugger;
  debug(message: string, ...args: any[]): this;
  initialize(): this;
  invariant(condition: boolean, message: string, pass: string, fail: string): this;
  getPlugin(name: string): PluginInterface;
}

export default class Tool<Tp extends PluginInterface, Tr extends ReporterInterface> extends Emitter
  implements ToolInterface {
  argv: string[] = [];

  config: ToolConfig = { ...DEFAULT_TOOL_CONFIG };

  console: ConsoleInterface;

  debugger: debug.IDebugger;

  initialized: boolean = false;

  options: ToolOptions;

  package: PackageConfig = { name: '' };

  plugins: Tp[] = [];

  constructor({ footer, header, ...options }: Partial<ToolOptions>, argv: string[] = []) {
    super();

    this.argv = argv;
    this.options = optimal(
      options,
      {
        appName: string().required(),
        configBlueprint: object(),
        configFolder: string('./configs'),
        extendArgv: bool(true),
        pluginAlias: string('plugin'),
        root: string(process.cwd()),
        scoped: bool(),
        workspaceRoot: string().empty(),
      },
      {
        name: 'Tool',
      },
    );

    // Enable debugging as early as possible
    if (argv.includes('--debug')) {
      enableDebug(this.options.appName);
    }

    // Core debugger for the entire tool
    this.debugger = this.createDebugger('core');

    // Initialize the console first so we can start logging
    this.console = new Console({
      footer,
      header,
    });

    // Avoid binding listeners while testing
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    // Cleanup when an exit occurs
    /* istanbul ignore next */
    process.on('exit', code => {
      this.emit('exit', [code]);
    });
  }

  /**
   * Create a debugger with a namespace.
   */
  createDebugger(...namespaces: string[]): debug.IDebugger {
    return debug(`${this.options.appName}:${namespaces.join(':')}`);
  }

  /**
   * Log a debug message.
   */
  debug(message: string, ...args: any[]): this {
    this.debugger(message, ...args);

    return this;
  }

  /**
   * Force exit the application.
   */
  exit(message: string | Error | null, code: number = 1): this {
    // this.console.exit(message, code);

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

    this.debug('Initializing %s', chalk.green(appName));

    this.loadConfig();
    this.loadPlugins();
    this.loadReporter();

    this.initialized = true;

    return this;
  }

  /**
   * Logs a debug message based on a conditional.
   */
  invariant(condition: boolean, message: string, pass: string, fail: string): this {
    this.debug('%s: %s', message, condition ? chalk.green(pass) : chalk.red(fail));

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

    const configLoader = new ConfigLoader(this);

    this.package = configLoader.loadPackageJSON();
    this.config = configLoader.loadConfig();

    // Inherit workspace root if found
    this.options.workspaceRoot = configLoader.workspaceRoot;

    // Inherit from argv
    if (this.options.extendArgv) {
      this.argv.forEach(arg => {
        if (arg === '--debug' || arg === '--silent') {
          const name = arg.slice(2);

          this.config[name] = true;
          this.console.options[name] = true;
        }
      });
    }

    // Enable debugging if defined in the config
    // This happens a little too late, but oh well
    if (this.config.debug) {
      enableDebug(this.options.appName);
    }

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

    // @ts-ignore Not sure why this is failing
    const pluginLoader: ModuleLoader<Tp> = new ModuleLoader(this, pluginAlias, Plugin);

    this.plugins = pluginLoader.loadModules(this.config[pluralPluginAlias]);

    // Sort plugins by priority
    this.plugins.sort((a, b) => a.priority - b.priority);

    // Bootstrap each plugin with the tool
    this.plugins.forEach(plugin => {
      plugin.tool = this; // eslint-disable-line no-param-reassign
      plugin.bootstrap();
    });

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

    const { reporter: reporterName } = this.config;
    let reporter = null;

    // Load based on name
    if (reporterName) {
      reporter = new ModuleLoader<ReporterInterface>(this, 'reporter', Reporter).loadModule(
        reporterName,
      );

      // Use native Boost reporter
    } else {
      reporter = new DefaultReporter();

      this.debug(`Using native ${chalk.green('boost')} reporter`);
    }

    if (reporter) {
      this.console.reporter = reporter;

      reporter.bootstrap(this.console);
    }

    return this;
  }
}
