/* eslint-disable no-cond-assign */

import chalk from 'chalk';
import fs from 'fs-extra';
import glob from 'fast-glob';
import path from 'path';
import JSON5 from 'json5';
import camelCase from 'lodash/camelCase';
import mergeWith from 'lodash/mergeWith';
import { Arguments } from 'yargs-parser';
import optimal, { array, bool, instance, number, shape, string, union, object } from 'optimal';
import formatModuleName from './helpers/formatModuleName';
import handleMerge from './helpers/handleMerge';
import isObject from './helpers/isObject';
import isEmptyObject from './helpers/isEmptyObject';
import requireModule from './helpers/requireModule';
import Tool from './Tool';
import { MODULE_NAME_PATTERN, PLUGIN_NAME_PATTERN } from './constants';
import { Debugger, PackageConfig, PluginSetting } from './types';

export interface ConfigObject {
  [key: string]: any;
}

export type ConfigPathOrObject = string | ConfigObject;

export interface ParseOptions {
  errorOnFunction?: boolean;
}

export default class ConfigLoader {
  debug: Debugger;

  package: PackageConfig = { name: '', version: '0.0.0' };

  parsedFiles: { [path: string]: boolean } = {};

  tool: Tool<any>;

  workspaceRoot: string = '';

  constructor(tool: Tool<any>) {
    this.debug = tool.createDebugger('config-loader');
    this.tool = tool;
  }

  /**
   * Find the config using the --config file path option.
   */
  findConfigFromArg(filePath?: string): ConfigPathOrObject | null {
    this.debug.invariant(
      !!filePath,
      'Looking in --config command line option',
      'Found',
      'Not found',
    );

    return filePath ? { extends: [filePath] } : null;
  }

  /**
   * Find the config in the package.json block under the application name.
   */
  findConfigInPackageJSON(pkg: PackageConfig): ConfigPathOrObject | null {
    const configName = this.getConfigName();
    const config = (pkg as any)[configName];

    this.debug.invariant(
      !!config,
      `Looking in package.json under ${chalk.yellow(configName)} property`,
      'Found',
      'Not found',
    );

    if (!config) {
      return null;
    }

    // Extend from a preset if a string
    if (typeof config === 'string') {
      return { extends: [config] };
    }

    return config;
  }

  /**
   * Find the config using local files commonly located in a configs/ folder.
   */
  findConfigInLocalFiles(root: string): ConfigPathOrObject | null {
    const configName = this.getConfigName();
    const relPath = `configs/${configName}.{js,json,json5}`;
    const configPaths = glob
      .sync(relPath, {
        absolute: true,
        cwd: root,
        onlyFiles: true,
      })
      .map(filePath => String(filePath));

    this.debug.invariant(
      configPaths.length === 1,
      `Looking for local config file: ${relPath}`,
      'Found',
      'Not found',
    );

    if (configPaths.length === 1) {
      this.debug('Found %s', chalk.cyan(path.basename(configPaths[0])));

      return configPaths[0];
    }

    if (configPaths.length > 1) {
      throw new Error(this.tool.msg('errors:multipleConfigFiles', { configName }));
    }

    return null;
  }

  /**
   * Find the config within the root when in a workspace.
   */
  // eslint-disable-next-line complexity
  findConfigInWorkspaceRoot(root: string): ConfigPathOrObject | null {
    let currentDir = path.dirname(root);

    if (currentDir.includes('node_modules')) {
      return null;
    }

    this.debug('Detecting if in a workspace');

    let workspaceRoot = '';
    let workspacePackage: any = {};
    let workspacePatterns: string[] = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (!currentDir || currentDir === '.' || currentDir === '/') {
        break;
      }

      const pkgPath = path.join(currentDir, 'package.json');

      if (fs.existsSync(pkgPath)) {
        workspacePackage = this.parseFile(pkgPath);
      }

      workspaceRoot = currentDir;
      workspacePatterns = this.tool.getWorkspacePaths({
        relative: true,
        root: currentDir,
      });

      if (workspacePackage && workspacePatterns.length > 0) {
        break;
      }

      currentDir = path.dirname(currentDir);
    }

    if (!workspaceRoot) {
      this.debug('No workspace found');

      return null;
    }

    const match = workspacePatterns.some(
      (pattern: string) => !!root.match(new RegExp(path.join(workspaceRoot, pattern), 'u')),
    );

    this.debug.invariant(
      match,
      `Matching patterns: ${workspacePatterns.map(p => chalk.cyan(p)).join(', ')}`,
      'Match found',
      'Invalid workspace package',
    );

    if (!match) {
      return null;
    }

    this.workspaceRoot = workspaceRoot;

    return (
      this.findConfigInPackageJSON(workspacePackage) ||
      this.findConfigInLocalFiles(workspaceRoot) ||
      null
    );
  }

  /**
   * Return the config name used for file names and the package.json property.
   */
  getConfigName(): string {
    const { configName, appName } = this.tool.options;

    return camelCase(configName || appName);
  }

  /**
   * Inherit configuration settings from defined CLI options.
   */
  inheritFromArgs<T>(config: T, args: Arguments): T {
    const nextConfig: any = { ...config };
    const pluginTypes = this.tool.getRegisteredPlugins();
    const keys = new Set([
      'debug',
      'locale',
      'output',
      'silent',
      'theme',
      ...Object.keys(this.tool.options.configBlueprint),
    ]);

    this.debug('Inheriting config from CLI options');

    Object.keys(args).forEach(key => {
      const value = args[key];

      if (key === 'config' || key === 'extends' || key === 'settings') {
        return;
      }

      // @ts-ignore Ignore symbol check
      const pluginType = pluginTypes[key as keyof typeof pluginTypes];

      // Plugins
      if (pluginType) {
        const { pluralName, singularName } = pluginType;

        this.debug('  --%s=[%s]', singularName, value.join(', '));
        nextConfig[pluralName] = (nextConfig[pluralName] || []).concat(value);

        // Other
      } else if (keys.has(key)) {
        this.debug('  --%s=%s', key, value);
        nextConfig[key] = value;
      }
    });

    return nextConfig;
  }

  /**
   * Load a local configuration file relative to the current working directory,
   * or from within a package.json property of the same appName.
   *
   * Support both JSON and JS file formats by globbing the config directory.
   */
  loadConfig<T>(args: Arguments): T {
    if (isEmptyObject(this.package) || !this.package.name) {
      throw new Error(this.tool.msg('errors:packageJsonNotLoaded'));
    }

    this.debug('Locating configuration');

    const { configBlueprint, settingsBlueprint, root } = this.tool.options;
    const pluginsBlueprint: any = {};
    const configPath =
      this.findConfigFromArg(args.config) ||
      this.findConfigInPackageJSON(this.package) ||
      this.findConfigInLocalFiles(root) ||
      this.findConfigInWorkspaceRoot(root);

    if (!configPath) {
      throw new Error(this.tool.msg('errors:configNotFound'));
    }

    Object.values(this.tool.getRegisteredPlugins()).forEach(type => {
      const { contract, singularName, pluralName } = type!;

      this.debug('Generating %s blueprint', chalk.magenta(singularName));

      // prettier-ignore
      pluginsBlueprint[pluralName] = array(union<PluginSetting<Function>>([
        string().notEmpty(),
        shape({ [singularName]: string().notEmpty() }),
        instance(contract, true),
      ], []));
    });

    const config = optimal(
      this.inheritFromArgs(this.parseAndExtend(configPath), args),
      {
        ...configBlueprint,
        ...pluginsBlueprint,
        debug: bool(),
        extends: array(string()),
        locale: string(),
        output: number(2).between(1, 3, true),
        // shape() requires a non-empty object
        settings: isEmptyObject(settingsBlueprint) ? object() : shape(settingsBlueprint),
        silent: bool(),
        theme: string('default').notEmpty(),
      },
      {
        file: typeof configPath === 'string' ? path.basename(configPath) : '',
        name: 'ConfigLoader',
        unknown: true,
      },
    );

    return config as T;
  }

  /**
   * Load the "package.json" from the current working directory,
   * as we require the dev tool to be ran from the project root.
   */
  loadPackageJSON(): PackageConfig {
    const { root } = this.tool.options;
    const filePath = path.join(root, 'package.json');

    this.debug('Locating package.json in %s', chalk.cyan(root));

    if (!fs.existsSync(filePath)) {
      throw new Error(this.tool.msg('errors:packageJsonNotFound'));
    }

    this.package = optimal(
      this.parseFile(filePath),
      {
        name: string().notEmpty(),
        version: string('0.0.0'),
      },
      {
        file: 'package.json',
        name: 'ConfigLoader',
        unknown: true,
      },
    );

    return this.package;
  }

  /**
   * If an `extends` option exists, recursively merge the current configuration
   * with the preset configurations defined within `extends`,
   * and return the new configuration object.
   */
  parseAndExtend(fileOrConfig: ConfigPathOrObject): ConfigObject {
    let config;
    let baseDir = '';

    // Parse out the object if a file path
    if (typeof fileOrConfig === 'string') {
      config = this.parseFile(fileOrConfig);
      baseDir = path.dirname(fileOrConfig);
    } else {
      config = fileOrConfig;
    }

    // Verify we're working with an object
    if (!isObject(config)) {
      throw new Error(this.tool.msg('errors:configInvalid'));
    }

    const { extends: extendPaths } = config;

    // Nothing to extend, so return the current config
    if (!extendPaths || extendPaths.length === 0) {
      return config;
    }

    // Resolve extend paths and inherit their config
    const nextConfig = {};
    const resolvedPaths = this.resolveExtendPaths(extendPaths, baseDir);

    resolvedPaths.forEach(extendPath => {
      if (this.parsedFiles[extendPath]) {
        return;
      }

      if (!fs.existsSync(extendPath)) {
        throw new Error(this.tool.msg('errors:presetConfigNotFound', { extendPath }));
      } else if (!fs.statSync(extendPath).isFile()) {
        throw new Error(this.tool.msg('errors:presetConfigInvalid', { extendPath }));
      }

      this.debug('Extending from file %s', chalk.cyan(extendPath));

      mergeWith(nextConfig, this.parseAndExtend(extendPath), handleMerge);
    });

    // Apply the current config after extending preset configs
    config.extends = resolvedPaths;

    mergeWith(nextConfig, config, handleMerge);

    return nextConfig;
  }

  /**
   * Parse a configuration file at the defined file system path.
   * If the file ends in "json" or "json5", parse it with JSON5.
   * If the file ends in "js", import the file and use the default object.
   * Otherwise throw an error.
   */
  parseFile(filePath: string, args: any[] = [], options: ParseOptions = {}): ConfigObject {
    const name = path.basename(filePath);
    const ext = path.extname(filePath);
    let value: any = null;

    this.debug('Parsing file %s', chalk.cyan(filePath));

    if (!path.isAbsolute(filePath)) {
      throw new Error(this.tool.msg('errors:absolutePathRequired'));
    }

    if (ext === '.json' || ext === '.json5') {
      value = JSON5.parse(fs.readFileSync(filePath, 'utf8'));
    } else if (ext === '.js') {
      value = requireModule(filePath);

      if (typeof value === 'function') {
        if (options.errorOnFunction) {
          throw new Error(this.tool.msg('errors:configNoFunction', { name }));
        } else {
          value = value(...args);
        }
      }
    } else {
      throw new Error(this.tool.msg('errors:configUnsupportedExt', { ext }));
    }

    if (!isObject(value)) {
      throw new Error(this.tool.msg('errors:configInvalidNamed', { name }));
    }

    this.parsedFiles[filePath] = true;

    return value;
  }

  /**
   * Resolve file system paths for the `extends` configuration value
   * using the following guidelines:
   *
   *  - Absolute paths should be normalized and used as is.
   *  - Relative paths should be resolved relative to the CWD.
   *  - Strings that match a node module name should resolve to a config file relative to the CWD.
   *  - Strings that start with "<plugin>:" should adhere to the previous rule.
   */
  resolveExtendPaths(extendPaths: string[], baseDir: string = ''): string[] {
    return extendPaths.map(extendPath => {
      if (typeof extendPath !== 'string') {
        throw new TypeError(this.tool.msg('errors:configExtendsInvalid'));
      }

      const { appName, scoped, root } = this.tool.options;
      const configName = this.getConfigName();
      let match = null;

      // Absolute path, use it directly
      if (path.isAbsolute(extendPath)) {
        return path.normalize(extendPath);

        // Relative path, resolve with parent folder or cwd
      } else if (extendPath[0] === '.') {
        return path.resolve(baseDir || root, extendPath);

        // Node module, resolve to a config file
      } else if (extendPath.match(MODULE_NAME_PATTERN)) {
        return this.resolveModuleConfigPath(configName, extendPath, true);

        // Plugin, resolve to a node module
      } else if ((match = extendPath.match(PLUGIN_NAME_PATTERN))) {
        return this.resolveModuleConfigPath(
          configName,
          formatModuleName(appName, match[1], extendPath, scoped),
          true,
        );
      }

      throw new Error(this.tool.msg('errors:configExtendsInvalidPath', { extendPath }));
    });
  }

  /**
   * Resolve a Node/NPM module path to an app config file.
   */
  resolveModuleConfigPath(
    configName: string,
    moduleName: string,
    preset: boolean = false,
    ext: string = 'js',
  ): string {
    const fileName = preset ? `${configName}.preset.${ext}` : `${configName}.${ext}`;

    return path.resolve(this.tool.options.root, 'node_modules', moduleName, 'configs', fileName);
  }
}
