/* eslint-disable no-param-reassign, no-console */

import fs from 'fs-extra';
import path from 'path';
import util from 'util';
import chalk from 'chalk';
import debug from 'debug';
import envCI from 'env-ci';
import glob from 'fast-glob';
import mergeWith from 'lodash/mergeWith';
import optimal, { bool, object, string, Blueprint } from 'optimal';
import parseArgs, { Arguments, Options as ArgOptions } from 'yargs-parser';
import { instanceOf, isEmpty } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { Event } from '@boost/event';
import { createLogger, Logger } from '@boost/log';
import { ExitError } from '@boost/internal';
import { createTranslator, Translator } from '@boost/translate';
import { Registry } from '@boost/plugin';
import ConfigLoader from './ConfigLoader';
import Console from './Console';
import Emitter from './Emitter';
import ModuleLoader from './ModuleLoader';
import Reporter from './Reporter';
import BoostReporter from './reporters/BoostReporter';
import ErrorReporter from './reporters/ErrorReporter';
import handleMerge from './helpers/handleMerge';
import CIReporter from './reporters/CIReporter';
import { APP_NAME_PATTERN, CONFIG_NAME_PATTERN } from './constants';
import {
  PackageConfig,
  WorkspaceMetadata,
  WorkspacePackageConfig,
  WorkspaceOptions,
  OutputLevel,
} from './types';

export interface ToolOptions {
  appName: string;
  appPath: string;
  argOptions?: ArgOptions;
  configBlueprint?: Blueprint<any>;
  configName?: string;
  footer?: string;
  header?: string;
  root?: string;
  scoped?: boolean;
  settingsBlueprint?: Blueprint<any>;
  workspaceRoot?: string;
}

export interface ToolConfig {
  debug: boolean;
  extends: string[];
  locale: string;
  output: OutputLevel;
  reporters: PluginSetting<Reporter>;
  settings: { [key: string]: any };
  silent: boolean;
  theme: string;
}

export interface ToolPluginRegistry {
  reporter: Reporter;
}

export default class Tool<
  PluginRegistry extends ToolPluginRegistry,
  Config extends ToolConfig = ToolConfig
> extends Emitter {
  args?: Arguments;

  argv: string[] = [];

  // @ts-ignore Set after instantiation
  config: Config = {};

  console: Console;

  debug: Debugger;

  log: Logger;

  msg: Translator;

  onExit = new Event<[number]>('exit');

  onInit = new Event<[]>('init');

  onLoadPlugin = new Event<
    [PluginRegistry[keyof PluginRegistry]],
    Extract<keyof PluginRegistry, string>
  >('load-plugin');

  options: Required<ToolOptions>;

  package: PackageConfig = { name: '', version: '0.0.0' };

  private configLoader: ConfigLoader;

  private initialized: boolean = false;

  private pluginRegistry = new Registry<ToolPluginRegistry>();

  constructor(options: ToolOptions, argv: string[] = []) {
    super();

    this.argv = argv;
    this.options = optimal(
      options,
      {
        appName: string()
          .required()
          .notEmpty()
          .match(APP_NAME_PATTERN),
        appPath: string()
          .required()
          .notEmpty(),
        argOptions: object(),
        configBlueprint: object(),
        configName: string().custom(value => {
          if (value && !value.match(CONFIG_NAME_PATTERN)) {
            throw new Error('Config file name must be camel case without extension.');
          }
        }),
        footer: string(),
        header: string(),
        root: string(process.cwd()),
        scoped: bool(),
        settingsBlueprint: object(),
        workspaceRoot: string(),
      },
      {
        name: this.constructor.name,
      },
    );

    // Set environment variables
    process.env.BOOST_DEBUG_GLOBAL_NAMESPACE = this.options.appName;

    // Core debugger, logger, and translator for the entire tool
    this.debug = createDebugger('core');

    this.log = createLogger();

    this.msg = createTranslator(
      ['app', 'errors'],
      [
        path.join(__dirname, '../res'),
        path.join(this.options.appPath, 'res'),
        // TODO Remove in 2.0
        path.join(this.options.appPath, 'resources'),
      ],
      {
        // TODO Change to yaml in 2.0
        resourceFormat: 'json',
      },
    );

    // TODO Backwards compat, remove in 2.0
    // @ts-ignore
    this.createDebugger = createDebugger;
    this.getPlugin = this.pluginRegistry.getPlugin;
    this.getPlugins = this.pluginRegistry.getPlugins;
    this.getRegisteredPlugin = this.pluginRegistry.getRegisteredType;
    this.getRegisteredPlugins = this.pluginRegistry.getRegisteredTypes;
    this.isPluginEnabled = (typeName, name) => {
      const type = this.pluginRegistry.getRegisteredType(typeName);
-     const setting = (this.config as any)[type.pluralName];

      return this.pluginRegistry.isPluginEnabled(typeName, name, setting);
    };
    this.registerPlugin = this.pluginRegistry.registerPlugin;

    // eslint-disable-next-line global-require
    this.debug('Using boost v%s', require('../package.json').version);

    // Initialize the console first so we can start logging
    this.console = new Console(this);

    // Make this available for testing purposes
    this.configLoader = new ConfigLoader(this);

    // Define a special type of plugin
    this.registerPlugin('reporter', Reporter, {
      beforeBootstrap: reporter => {
        reporter.console = this.console;
      },
      moduleScopes: ['boost'],
    });

    // istanbul ignore next
    if (process.env.NODE_ENV !== 'test') {
      // Add a reporter to catch errors during initialization
      this.addPlugin('reporter', new ErrorReporter());

      // Cleanup when an exit occurs
      process.on('exit', code => {
        this.emit('exit', [code]);
        this.onExit.emit([code]);
      });
    }

    // TODO Backwards compat, remove in 2.0
    // @ts-ignore
    this.createDebugger = createDebugger;
    // @ts-ignore
    this.createTranslator = createTranslator;
  }

  /**
   * Add a plugin for a specific contract type and bootstrap with the tool.
   */
  addPlugin<K extends keyof PluginRegistry>(typeName: K, plugin: PluginRegistry[K]): this {
    const type = this.getRegisteredPlugin(typeName);

    if (!instanceOf(plugin, Plugin)) {
      throw new TypeError(this.msg('errors:pluginNotExtended', { parent: 'Plugin', typeName }));
    } else if (!instanceOf(plugin, type.contract)) {
      throw new TypeError(
        this.msg('errors:pluginNotExtended', { parent: type.contract.name, typeName }),
      );
    }

    plugin.tool = this;

    if (type.beforeBootstrap) {
      type.beforeBootstrap(plugin);
    }

    plugin.bootstrap();

    if (type.afterBootstrap) {
      type.afterBootstrap(plugin);
    }

    this.plugins[typeName]!.add(plugin);

    this.onLoadPlugin.emit([plugin], typeName as Extract<K, string>);

    return this;
  }

  /**
   * Create a workspace metadata object composed of absolute file paths.
   */
  createWorkspaceMetadata(jsonPath: string): WorkspaceMetadata {
    const metadata: any = {};

    metadata.jsonPath = jsonPath;
    metadata.packagePath = path.dirname(jsonPath);
    metadata.packageName = path.basename(metadata.packagePath);
    metadata.workspacePath = path.dirname(metadata.packagePath);
    metadata.workspaceName = path.basename(metadata.workspacePath);

    return metadata;
  }

  /**
   * Force exit the application.
   */
  exit(message: string | Error | null = null, code: number = 1): this {
    const error = new ExitError(this.msg('errors:processTerminated'), code);

    if (message) {
      if (instanceOf(message, Error)) {
        error.message = message.message;
        error.stack = message.stack;
      } else {
        error.message = message;
      }
    }

    throw error;
  }

  /**
   * Return all `package.json`s across all workspaces and their packages.
   * Once loaded, append workspace path metadata.
   */
  getWorkspacePackages<CustomConfig extends object = {}>(
    options: WorkspaceOptions = {},
  ): (WorkspacePackageConfig & CustomConfig)[] {
    const root = options.root || this.options.root;

    return glob
      .sync(
        this.getWorkspacePaths({
          ...options,
          relative: true,
          root,
        }).map(ws => `${ws}/package.json`),
        {
          absolute: true,
          cwd: root,
        },
      )
      .map(filePath => ({
        ...fs.readJsonSync(filePath),
        workspace: this.createWorkspaceMetadata(filePath),
      }));
  }

  /**
   * Return a list of absolute package folder paths, across all workspaces,
   * for the defined root.
   */
  getWorkspacePackagePaths(options: WorkspaceOptions = {}): string[] {
    const root = options.root || this.options.root;

    return glob.sync(this.getWorkspacePaths({ ...options, relative: true, root }), {
      absolute: !options.relative,
      cwd: root,
      onlyDirectories: true,
      onlyFiles: false,
    });
  }

  /**
   * Return a list of workspace folder paths, with wildstar glob in tact,
   * for the defined root.
   */
  getWorkspacePaths(options: WorkspaceOptions = {}): string[] {
    const root = options.root || this.options.root;
    const pkgPath = path.join(root, 'package.json');
    const lernaPath = path.join(root, 'lerna.json');
    const workspacePaths = [];

    // Yarn
    if (fs.existsSync(pkgPath)) {
      const pkg = fs.readJsonSync(pkgPath);

      if (pkg.workspaces) {
        if (Array.isArray(pkg.workspaces)) {
          workspacePaths.push(...pkg.workspaces);
        } else if (Array.isArray(pkg.workspaces.packages)) {
          workspacePaths.push(...pkg.workspaces.packages);
        }
      }
    }

    // Lerna
    if (workspacePaths.length === 0 && fs.existsSync(lernaPath)) {
      const lerna = fs.readJsonSync(lernaPath);

      if (Array.isArray(lerna.packages)) {
        workspacePaths.push(...lerna.packages);
      }
    }

    if (options.relative) {
      return workspacePaths;
    }

    return workspacePaths.map(workspace => path.join(root, workspace));
  }

  /**
   * Initialize the tool by loading config and plugins.
   */
  initialize(): this {
    if (this.initialized) {
      return this;
    }

    const { appName } = this.options;
    const pluginNames = Object.keys(this.pluginTypes);

    this.debug('Initializing %s application', chalk.yellow(appName));

    this.args = parseArgs(
      this.argv,
      mergeWith(
        {
          array: [...pluginNames],
          boolean: ['debug', 'silent'],
          number: ['output'],
          string: ['config', 'locale', 'theme', ...pluginNames],
        },
        this.options.argOptions,
        handleMerge,
      ),
    );

    this.loadConfig();
    this.loadPlugins();
    this.loadReporters();

    this.initialized = true;
    this.onInit.emit([]);

    return this;
  }

  /**
   * Return true if running in a CI environment.
   */
  isCI(): boolean {
    return envCI().isCi;
  }

  /**
   * Load all `package.json`s across all workspaces and their packages.
   * Once loaded, append workspace path metadata.
   *
   * @deprecated
   */
  loadWorkspacePackages<CustomConfig extends object = {}>(
    options: WorkspaceOptions = {},
  ): (WorkspacePackageConfig & CustomConfig)[] {
    console.warn(
      '`tool.loadWorkspacePackages` is deprecated. Use `tool.getWorkspacePackages` instead.',
    );

    return this.getWorkspacePackages<CustomConfig>(options);
  }

  /**
   * Log a live message to the console to display while a process is running.
   *
   * @deprecated
   */
  logLive(message: string, ...args: any[]): this {
    console.warn('`tool.logLive` is deprecated. Use `console.log` instead.');

    this.console.logLive(util.format(message, ...args));

    return this;
  }

  /**
   * Log an error to the console to display on failure.
   *
   * @deprecated
   */
  logError(message: string, ...args: any[]): this {
    console.warn(
      '`tool.logError` is deprecated. Use `tool.log.error` or `tool.console.logError` instead.',
    );

    this.console.logError(util.format(message, ...args));

    return this;
  }

  /**
   * Load the package.json and local configuration files.
   *
   * Must be called first in the lifecycle.
   */
  protected loadConfig(): this {
    if (this.initialized) {
      return this;
    }

    this.package = this.configLoader.loadPackageJSON();
    this.config = this.configLoader.loadConfig(this.args!);

    // Inherit workspace metadata
    this.options.workspaceRoot = this.configLoader.workspaceRoot;

    // Enable debugger (a bit late but oh well)
    if (this.config.debug) {
      debug.enable(`${this.options.appName}:*`);
    }

    return this;
  }

  /**
   * Register plugins from the loaded configuration.
   *
   * Must be called after config has been loaded.
   */
  protected loadPlugins(): this {
    if (this.initialized) {
      return this;
    }

    if (isEmpty(this.config)) {
      throw new Error(this.msg('errors:configNotLoaded', { name: 'plugins' }));
    }

    Object.keys(this.pluginTypes).forEach(type => {
      const typeName = type as keyof PluginRegistry;
      const { loader, pluralName } = this.pluginTypes[typeName]!;
      const plugins = loader.loadModules((this.config as any)[pluralName]);

      // Sort plugins by priority
      loader.debug('Sorting by priority');

      plugins.sort((a, b) =>
        instanceOf(a, Plugin) && instanceOf(b, Plugin) ? a.priority - b.priority : 0,
      );

      // Bootstrap each plugin with the tool
      loader.debug('Bootstrapping with tool environment');

      plugins.forEach(plugin => {
        this.addPlugin(typeName, plugin);
      });
    });

    return this;
  }

  /**
   * Register reporters from the loaded configuration.
   *
   * Must be called after config has been loaded.
   */
  protected loadReporters(): this {
    if (this.initialized) {
      return this;
    }

    if (isEmpty(this.config)) {
      throw new Error(this.msg('errors:configNotLoaded', { name: 'reporters' }));
    }

    const reporters = this.plugins.reporter!;
    const { loader } = this.pluginTypes.reporter!;

    // Use a special reporter when in a CI
    // istanbul ignore next
    if (this.isCI() && !process.env.BOOST_ENV) {
      loader.debug('CI environment detected, using %s CI reporter', chalk.yellow('boost'));

      this.addPlugin('reporter', new CIReporter());

      // Use default reporter
    } else if (
      reporters.size === 0 ||
      (reporters.size === 1 && instanceOf(Array.from(reporters)[0], ErrorReporter))
    ) {
      loader.debug('Using default %s reporter', chalk.yellow('boost'));

      this.addPlugin('reporter', new BoostReporter());
    }

    return this;
  }
}
