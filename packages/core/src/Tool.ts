/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable no-param-reassign */

import path from 'path';
import util from 'util';
import chalk from 'chalk';
import debug from 'debug';
import pluralize from 'pluralize';
import i18next from 'i18next';
import mergeWith from 'lodash/mergeWith';
import optimal, { bool, object, string, Blueprint } from 'optimal';
import parseArgs, { Arguments, Options as ArgOptions } from 'yargs-parser';
import ConfigLoader from './ConfigLoader';
import Console from './Console';
import Emitter from './Emitter';
import ModuleLoader from './ModuleLoader';
import Plugin from './Plugin';
import Reporter from './Reporter';
import DefaultReporter from './reporters/DefaultReporter';
import ErrorReporter from './reporters/ErrorReporter';
import enableDebug from './helpers/enableDebug';
import handleMerge from './helpers/handleMerge';
import isEmptyObject from './helpers/isEmptyObject';
import CIReporter from './reporters/CIReporter';
import LanguageDetector from './i18n/LanguageDetector';
import FileBackend from './i18n/FileBackend';
import themePalettes from './themes';
import { DEFAULT_TOOL_CONFIG } from './constants';
import { Debugger, Translator, ToolConfig, PackageConfig } from './types';

export interface ToolOptions {
  appName: string;
  appPath: string;
  argOptions: ArgOptions;
  configBlueprint: Blueprint;
  configFolder: string;
  footer: string;
  header: string;
  pluginAlias: string;
  root: string;
  scoped: boolean;
  workspaceRoot: string;
}

export default class Tool<Config extends ToolConfig = ToolConfig> extends Emitter {
  args: Arguments;

  argv: string[] = [];

  // @ts-ignore Allow default spread
  config: Config = { ...DEFAULT_TOOL_CONFIG };

  console: Console;

  debug: Debugger;

  options: ToolOptions;

  package: PackageConfig = { name: '' };

  plugins: Plugin<any>[] = [];

  reporters: Reporter<any>[] = [];

  translator: Translator;

  private configLoader: ConfigLoader;

  private initialized: boolean = false;

  private pluginLoader: ModuleLoader<Plugin<any>>;

  private reporterLoader: ModuleLoader<Reporter<any>>;

  constructor(options: Partial<ToolOptions>, argv: string[] = []) {
    super();

    this.argv = argv;

    this.options = optimal(
      options,
      {
        appName: string().required(),
        appPath: string().required(),
        argOptions: object(),
        configBlueprint: object(),
        configFolder: string('./configs'),
        footer: string().empty(),
        header: string().empty(),
        pluginAlias: string('plugin'),
        root: string(process.cwd()),
        scoped: bool(),
        workspaceRoot: string().empty(),
      },
      {
        name: 'Tool',
      },
    );

    this.args = parseArgs(
      this.argv,
      mergeWith(
        {
          array: ['extends', 'plugin', 'reporter'],
          boolean: ['debug', 'silent'],
          number: ['output'],
          string: ['extends', 'locale', 'theme'],
        },
        this.config.argOptions,
        handleMerge,
      ),
    );

    // Enable debugging as early as possible
    if (this.args.debug) {
      enableDebug(this.options.appName);
    }

    // Core debugger for the entire tool
    this.debug = this.createDebugger('core');

    // Setup i18n translation
    this.translator = this.createTranslator();

    // Initialize the console first so we can start logging
    this.console = new Console(this);

    // Add a reporter to catch errors during initialization
    this.addReporter(new ErrorReporter());

    // Make these available for testing purposes
    this.configLoader = new ConfigLoader(this);
    this.pluginLoader = new ModuleLoader(this, this.options.pluginAlias, Plugin);
    this.reporterLoader = new ModuleLoader(this, 'reporter', Reporter, true);

    // Cleanup when an exit occurs
    /* istanbul ignore next */
    if (process.env.NODE_ENV !== 'test') {
      process.on('exit', code => {
        this.emit('exit', [code]);
      });
    }

    // eslint-disable-next-line global-require
    this.debug('Using boost v%s', require('../package.json').version);
  }

  /**
   * Add a plugin and bootstrap with the tool.
   */
  addPlugin(plugin: Plugin<any>): this {
    plugin.tool = this;
    plugin.bootstrap();

    this.plugins.push(plugin);

    return this;
  }

  /**
   * Add a reporter and bootstrap with the tool and console.
   */
  addReporter(reporter: Reporter<any>): this {
    reporter.console = this.console;
    reporter.tool = this;
    reporter.bootstrap();

    this.reporters.push(reporter);

    return this;
  }

  /**
   * Create a debugger instance with a namespace.
   */
  createDebugger(...namespaces: string[]): Debugger {
    const handler = debug(`${this.options.appName}:${namespaces.join(':')}`) as Debugger;

    handler.invariant = (condition: boolean, message: string, pass: string, fail) => {
      handler('%s: %s', message, condition ? chalk.green(pass) : chalk.red(fail));
    };

    return handler;
  }

  /**
   * Create an i18n translator instance.
   */
  createTranslator(): Translator {
    return i18next
      .createInstance()
      .use(new LanguageDetector())
      .use(new FileBackend())
      .init(
        {
          backend: {
            resourcePaths: [
              path.join(__dirname, 'resources'),
              path.join(this.options.appPath, 'resources'),
            ],
          },
          defaultNS: 'app',
          fallbackLng: ['en'],
          fallbackNS: 'common',
          initImmediate: false,
          lowerCaseLng: true,
          ns: ['app', 'common', 'errors', 'prompts'],
        },
        error => {
          if (error) {
            throw error;
          }
        },
      );
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

    throw new Error(
      this.msg('errors:pluginNotFound', {
        alias: this.options.pluginAlias,
        name,
      }),
    );
  }

  /**
   * Get a reporter by name.
   */
  getReporter(name: string): Reporter<any> {
    const reporter = this.reporters.find(r => r.name === name);

    if (reporter) {
      return reporter;
    }

    throw new Error(this.msg('errors:reporterNotFound', { name }));
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

    this.package = this.configLoader.loadPackageJSON();
    this.config = this.configLoader.loadConfig();

    // Inherit workspace metadata
    this.options.workspaceRoot = this.configLoader.workspaceRoot;

    // Enable debugger
    if (this.config.debug) {
      enableDebug(this.options.appName);
    }

    // Update locale
    if (this.config.locale) {
      this.translator.changeLanguage(this.config.locale);
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

    const pluralPluginAlias = pluralize(this.options.pluginAlias);

    if (isEmptyObject(this.config)) {
      throw new Error(this.msg('errors:configNotLoaded', { name: pluralPluginAlias }));
    }

    const plugins = this.pluginLoader.loadModules(this.config[pluralPluginAlias]);

    // Sort plugins by priority
    this.pluginLoader.debug('Sorting plugins by priority');

    plugins.sort((a, b) => a.priority - b.priority);

    // Bootstrap each plugin with the tool
    this.pluginLoader.debug('Bootstrapping plugins with tool environment');

    plugins.forEach(plugin => {
      this.addPlugin(plugin);
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
      throw new Error(this.msg('errors:configNotLoaded', { name: 'reporters' }));
    }

    const reporters: Reporter<any>[] = [];

    if (process.env.CI && !process.env.BOOST_ENV) {
      this.reporterLoader.debug(
        'CI environment detected, using %s CI reporter',
        chalk.yellow('boost'),
      );

      reporters.push(new CIReporter());
    } else {
      reporters.push(...this.reporterLoader.loadModules(this.config.reporters));
    }

    // Use default reporter
    if (reporters.length === 0) {
      this.reporterLoader.debug('Using default %s reporter', chalk.yellow('boost'));

      reporters.push(new DefaultReporter());
    }

    // Bootstrap each plugin with the tool
    this.reporterLoader.debug('Bootstrapping reporters with tool and console environment');

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

  /**
   * Retrieve a translated message from a resource bundle.
   */
  msg(key: string | string, params?: any, options?: i18next.TranslationOptions): string {
    return this.translator.t(key, {
      interpolation: { escapeValue: false },
      replace: params,
      ...options,
    });
  }
}
