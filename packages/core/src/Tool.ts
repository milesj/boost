/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable no-param-reassign */

import util from 'util';
import chalk from 'chalk';
import debug from 'debug';
import pluralize from 'pluralize';
import optimal, { bool, object, string, Blueprint } from 'optimal';
import ConfigLoader from './ConfigLoader';
import Console, { ConsoleOptions } from './Console';
import Emitter from './Emitter';
import ModuleLoader from './ModuleLoader';
import Plugin from './Plugin';
import Reporter from './Reporter';
import DefaultReporter from './reporters/DefaultReporter';
import ErrorReporter from './reporters/ErrorReporter';
import enableDebug from './helpers/enableDebug';
import isEmptyObject from './helpers/isEmptyObject';
import themePalettes from './themes';
import { DEFAULT_TOOL_CONFIG } from './constants';
import { Debugger, ToolConfig, PackageConfig } from './types';
import CIReporter from './reporters/CIReporter';

export interface ToolOptions {
  appName: string;
  configBlueprint: Blueprint;
  configFolder: string;
  console: Partial<ConsoleOptions>;
  pluginAlias: string;
  root: string;
  scoped: boolean;
  workspaceRoot: string;
}

export default class Tool extends Emitter {
  argv: string[] = [];

  config: ToolConfig = { ...DEFAULT_TOOL_CONFIG };

  console: Console;

  debug: Debugger;

  initialized: boolean = false;

  options: ToolOptions;

  package: PackageConfig = { name: '' };

  plugins: Plugin<any>[] = [];

  reporters: Reporter<any>[] = [];

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

    // Add a reporter to catch errors during initialization
    this.addReporter(new ErrorReporter(this.options.console));

    // Cleanup when an exit occurs
    /* istanbul ignore next */
    if (process.env.NODE_ENV !== 'test') {
      process.on('exit', code => {
        this.emit('exit', [code]);
      });
    }
  }

  /**
   * Add a reporter and bootstrap with the console instance.
   */
  addReporter(reporter: Reporter<any>): this {
    reporter.console = this.console;
    reporter.bootstrap();

    this.reporters.push(reporter);

    return this;
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
  getPlugin(name: string): Plugin<any> {
    const plugin = this.plugins.find(p => p.name === name);

    if (plugin) {
      return plugin;
    }

    throw new Error(`Failed to find ${this.options.pluginAlias} "${name}". Have you installed it?`);
  }

  /**
   * Get a reporter by name.
   */
  getReporter(name: string): Reporter<any> {
    const reporter = this.reporters.find(p => p.name === name);

    if (reporter) {
      return reporter;
    }

    throw new Error(`Failed to find reporter "${name}". Have you installed it?`);
  }

  /**
   * Return a list of all theme names.
   */
  getThemeList(): string[] {
    return Object.keys(themePalettes);
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
    // eslint-disable-next-line global-require
    this.debug('Using boost v%s', require('../package.json').version);

    this.loadConfig();
    this.loadPlugins();
    this.loadReporters();

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

    // Inherit workspace metadata if found
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

    const loader = new ModuleLoader(this, pluginAlias, Plugin);

    this.plugins = loader.loadModules(this.config[pluralPluginAlias]);

    // Sort plugins by priority
    this.plugins.sort((a, b) => a.priority - b.priority);

    // Bootstrap each plugin with the tool
    this.plugins.forEach(plugin => {
      plugin.tool = this;
      plugin.bootstrap();
    });

    return this;
  }

  /**
   * Register reporters from the loaded configuration.
   *
   * Must be called after config has been loaded.
   */
  loadReporters(): this {
    if (this.initialized) {
      return this;
    }

    if (isEmptyObject(this.config)) {
      throw new Error('Cannot load reporters as configuration has not been loaded.');
    }

    const loader = new ModuleLoader(this, 'reporter', Reporter);
    const reporters: Reporter<any>[] = [];

    if (process.env.CI && !process.env.BOOST_ENV) {
      loader.debug('CI environment detected, using %s CI reporter', chalk.yellow('boost'));

      reporters.push(new CIReporter());
    } else {
      reporters.push(...loader.loadModules(this.config.reporters));
    }

    // Use default reporter
    if (reporters.length === 0) {
      loader.debug('Using default %s reporter', chalk.yellow('boost'));

      reporters.push(new DefaultReporter());
    }

    // Bootstrap each plugin with the tool
    loader.debug('Bootstrapping reporters with console environment');

    reporters.forEach(reporter => {
      this.addReporter(reporter);
    });

    return this;
  }

  /**
   * Log a message to the console to display on success.
   */
  log(message: string, ...args: any[]): this {
    this.console.log(util.format(message, ...args));

    return this;
  }

  /**
   * Log an error to the console to display on failure.
   */
  logError(message: string, ...args: any[]): this {
    this.console.logError(util.format(message, ...args));

    return this;
  }
}
