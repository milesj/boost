/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import util from 'util';
import chalk from 'chalk';
import debug from 'debug';
import pluralize from 'pluralize';
import optimal, { bool, object, string, Blueprint, Struct } from 'optimal';
import ConfigLoader from './ConfigLoader';
import Console, { ConsoleInterface } from './Console';
import Emitter, { EmitterInterface } from './Emitter';
import ModuleLoader from './ModuleLoader';
import Plugin, { PluginInterface } from './Plugin';
import Reporter, { ReporterInterface, ReporterOptions } from './Reporter';
import DefaultReporter from './DefaultReporter';
import enableDebug from './helpers/enableDebug';
import isEmptyObject from './helpers/isEmptyObject';
import isObject from './helpers/isObject';
import { DEFAULT_TOOL_CONFIG } from './constants';
import { Debugger, ToolConfig, PackageConfig } from './types';

export interface ToolOptions extends Struct {
  appName: string;
  configBlueprint: Blueprint;
  configFolder: string;
  console: Partial<ReporterOptions>;
  pluginAlias: string;
  root: string;
  scoped: boolean;
  workspaceRoot: string;
}

export interface ToolInterface extends EmitterInterface {
  argv: string[];
  config: ToolConfig;
  console: ConsoleInterface;
  debug: Debugger;
  options: ToolOptions;
  package: PackageConfig;
  plugins: PluginInterface[];
  createDebugger(...namespaces: string[]): Debugger;
  initialize(): this;
  getPlugin(name: string): PluginInterface;
  log(message: string, ...args: any[]): this;
  logError(message: string, ...args: any[]): this;
}

export default class Tool<Tp extends PluginInterface> extends Emitter implements ToolInterface {
  argv: string[] = [];

  config: ToolConfig = { ...DEFAULT_TOOL_CONFIG };

  console: ConsoleInterface;

  debug: Debugger;

  initialized: boolean = false;

  options: ToolOptions;

  package: PackageConfig = { name: '' };

  plugins: Tp[] = [];

  reporter: ReporterInterface | null = null;

  constructor(options: Partial<ToolOptions>, argv: string[] = []) {
    super();

    this.argv = argv;
    this.options = optimal(
      options,
      {
        appName: string().required(),
        configBlueprint: object(),
        configFolder: string('./configs'),
        console: object(),
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
    this.debug = this.createDebugger('core');

    // Initialize the console first so we can start logging
    this.console = new Console();

    // Cleanup when an exit occurs
    /* istanbul ignore next */
    if (process.env.NODE_ENV !== 'test') {
      process.on('exit', code => {
        this.emit('exit', [code]);
      });
    }
  }

  /**
   * Create a debugger with a namespace.
   */
  createDebugger(...namespaces: string[]): Debugger {
    const handler = debug(`${this.options.appName}:${namespaces.join(':')}`) as Debugger;

    handler.invariant = (condition: boolean, message: string, pass: string, fail) => {
      handler('%s: %s', message, condition ? chalk.green(pass) : chalk.red(fail));
    };

    return handler;
  }

  /**
   * Force exit the application.
   */
  exit(message: string | Error | null, code: number = 1): this {
    this.console.exit(message, code);

    return this;
  }

  /**
   * Get a plugin by name.
   */
  getPlugin(name: string): Tp {
    const plugin = this.plugins.find(p => p.name === name);

    if (plugin) {
      return plugin;
    }

    throw new Error(`Failed to find ${this.options.pluginAlias} "${name}". Have you installed it?`);
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
    this.argv.forEach(arg => {
      if (arg === '--debug') {
        const name = arg.slice(2);

        this.config[name] = true;
      }
    });

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

    const pluginLoader = new ModuleLoader(this, pluginAlias, Plugin);

    // @ts-ignore
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
    const loader = new ModuleLoader(this, 'reporter', Reporter);
    const options = this.options.console;
    let reporter = null;

    // Load based on name
    if (reporterName) {
      if (isObject(reporterName)) {
        reporter = loader.importModuleFromOptions({
          // @ts-ignore
          ...reporterName,
          ...options,
        });
      } else {
        reporter = loader.importModule(String(reporterName), options);
      }
    }

    // Use default reporter
    if (!reporter) {
      loader.debug('Using default %s reporter', chalk.yellow('boost'));

      reporter = new DefaultReporter(options);
    }

    // Bootstrap console events
    loader.debug('Bootstrapping reporter with console environment');

    reporter.bootstrap(this.console);

    this.reporter = reporter;

    return this;
  }

  /**
   * Log a message to the console to display on success.
   */
  log(message: string, ...args: any[]): this {
    this.console.emit('log', [util.format(message, ...args), message, args]);

    return this;
  }

  /**
   * Log an error to the console to display on failure.
   */
  logError(message: string, ...args: any[]): this {
    this.console.emit('log.error', [util.format(message, ...args), message, args]);

    return this;
  }
}
