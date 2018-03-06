/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import chalk from 'chalk';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import JSON5 from 'json5';
import camelCase from 'lodash/camelCase';
import mergeWith from 'lodash/mergeWith';
import pluralize from 'pluralize';
import Config, { array, bool, shape, string, union } from 'optimal';
import formatModuleName from './helpers/formatModuleName';
import isObject from './helpers/isObject';
import isEmptyObject from './helpers/isEmptyObject';
import requireModule from './helpers/requireModule';
import { MODULE_NAME_PATTERN, PLUGIN_NAME_PATTERN } from './constants';

import type { ToolConfig, PackageConfig, ConfigStruct, OptionsStruct } from './types';
import type Tool from './Tool';

export default class ConfigLoader {
  package: PackageConfig;

  parsedFiles: { [path: string]: boolean } = {};

  tool: Tool<*, *>;

  constructor(tool: Tool<*, *>) {
    this.tool = tool;
  }

  /**
   * Handle special cases when merging 2 configuration values.
   * If the target and source are both arrays, concatenate them.
   */
  handleMerge(target: *, source: *): * {
    if (Array.isArray(target) && Array.isArray(source)) {
      return [
        ...new Set([
          ...target,
          ...source,
        ]),
      ];
    }

    // Defer to lodash
    return undefined;
  }

  /**
   * Load a local configuration file relative to the current working directory,
   * or from within a package.json property of the same appName.
   *
   * Support both JSON and JS file formats by globbing the config directory.
   */
  loadConfig(): ToolConfig {
    if (isEmptyObject(this.package)) {
      throw new Error('Cannot load configuration as "package.json" has not been loaded.');
    }

    const {
      appName,
      configBlueprint,
      configFolder,
      pluginAlias,
      root,
    } = this.tool.options;
    const camelName = camelCase(appName);
    let config = {};

    this.tool.debug('Locating configuration');

    // Config has been defined in package.json
    if (this.package[camelName]) {
      config = this.package[camelName];

      this.tool.debug(`Found in package.json under "${camelName}" property`);

      // Extend from a preset if a string
      if (typeof config === 'string') {
        config = { extends: [config] };
      }

    // Locate files within a local config folder
    } else {
      const filePaths = glob.sync(
        path.join(root, configFolder, `${appName}.{js,json,json5}`),
        { absolute: true },
      );

      const fileNames = [
        path.join(configFolder, `${appName}.js`),
        path.join(configFolder, `${appName}.json`),
        path.join(configFolder, `${appName}.json5`),
      ];

      this.tool.debug(`Resolving in order: ${fileNames.join(', ')}`);

      if (filePaths.length === 0) {
        throw new Error(
          'Local configuration file could not be found. ' +
          `One of ${fileNames.join(', ')} must exist relative to the project root.`,
        );

      } else if (filePaths.length !== 1) {
        throw new Error(
          `Multiple "${appName}" configuration files found. Only 1 may exist.`,
        );
      }

      [config] = filePaths;

      this.tool.debug(`Found ${path.basename(config)}`);
    }

    // Parse and extend configuration
    return new Config(this.parseAndExtend(config), {
      ...configBlueprint,
      debug: bool(),
      extends: array(string()),
      reporter: string().empty(),
      silent: bool(),
      [pluralize(pluginAlias)]: array(union([
        string(),
        shape({ [pluginAlias]: string() }),
      ])),
    }, {
      name: 'ConfigLoader',
      unknown: true,
    });
  }

  /**
   * Load the "package.json" from the current working directory,
   * as we require the build tool to be ran from the project root.
   */
  loadPackageJSON(): PackageConfig {
    const { root } = this.tool.options;
    const filePath = path.join(root, 'package.json');

    this.tool.debug(`Locating package.json in ${chalk.cyan(root)}`);

    if (!fs.existsSync(filePath)) {
      throw new Error(
        'Local "package.json" could not be found. ' +
        'Please run the command in your project\'s root.',
      );
    }

    this.package = new Config(this.parseFile(filePath), {
      name: string(),
    }, {
      name: 'ConfigLoader',
      unknown: true,
    });

    return this.package;
  }

  /**
   * If an `extends` option exists, recursively merge the current configuration
   * with the preset configurations defined within `extends`,
   * and return the new configuration object.
   */
  parseAndExtend(fileOrConfig: string | ConfigStruct): ConfigStruct {
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
      throw new Error('Invalid configuration. Must be a plain object.');
    }

    const { extends: extendPaths } = config;

    // Nothing to extend, so return the current config
    if (!extendPaths || extendPaths.length === 0) {
      return config;
    }

    // Resolve extend paths and inherit their config
    const nextConfig = {};
    const resolvedPaths = this.resolveExtendPaths(extendPaths, baseDir);

    resolvedPaths.forEach((extendPath) => {
      if (this.parsedFiles[extendPath]) {
        return;
      }

      if (!fs.existsSync(extendPath)) {
        throw new Error(`Preset configuration ${extendPath} does not exist.`);

      } else if (!fs.statSync(extendPath).isFile()) {
        throw new Error(`Preset configuration ${extendPath} must be a valid file.`);
      }

      this.tool.debug(`Extending from file ${chalk.cyan(extendPath)}`);

      mergeWith(nextConfig, this.parseAndExtend(extendPath), this.handleMerge);
    });

    // Apply the current config after extending preset configs
    config.extends = resolvedPaths;

    mergeWith(nextConfig, config, this.handleMerge);

    return nextConfig;
  }

  /**
   * Parse a configuration file at the defined file system path.
   * If the file ends in "json" or "json5", parse it with JSON5.
   * If the file ends in "js", import the file and use the default object.
   * Otherwise throw an error.
   */
  parseFile(filePath: string, options?: OptionsStruct = {}): ConfigStruct {
    const name = path.basename(filePath);
    const ext = path.extname(filePath);
    let value;

    this.tool.debug(`Parsing file ${chalk.cyan(filePath)}`);

    if (!path.isAbsolute(filePath)) {
      throw new Error('An absolute file path is required.');
    }

    if (ext === '.json' || ext === '.json5') {
      value = JSON5.parse(fs.readFileSync(filePath, 'utf8'));

    } else if (ext === '.js') {
      value = requireModule(filePath);

      if (typeof value === 'function') {
        value = value(options);
      }

    } else {
      throw new Error(`Unsupported configuration file format "${name}".`);
    }

    if (!isObject(value)) {
      throw new Error(`Invalid configuration file "${name}". Must return an object.`);
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
  resolveExtendPaths(extendPaths: string[], baseDir?: string = ''): string[] {
    return extendPaths.map((extendPath) => {
      if (typeof extendPath !== 'string') {
        throw new TypeError('Invalid `extends` configuration value. Must be an array of strings.');
      }

      const {
        appName,
        scoped,
        pluginAlias,
        root,
      } = this.tool.options;

      // Absolute path, use it directly
      if (path.isAbsolute(extendPath)) {
        return path.normalize(extendPath);

      // Relative path, resolve with parent folder or cwd
      } else if (extendPath[0] === '.') {
        return path.resolve(baseDir || root, extendPath);

      // Node module, resolve to a config file
      } else if (extendPath.match(MODULE_NAME_PATTERN)) {
        return this.resolveModuleConfigPath(appName, extendPath, true);

      // Plugin, resolve to a node module
      } else if (extendPath.match(PLUGIN_NAME_PATTERN)) {
        return this.resolveModuleConfigPath(
          appName,
          formatModuleName(appName, pluginAlias, extendPath, scoped),
          true,
        );
      }

      throw new Error(`Invalid \`extends\` configuration value "${extendPath}".`);
    });
  }

  /**
   * Resolve a Node/NPM module path to an app config file.
   */
  resolveModuleConfigPath(
    appName: string,
    moduleName: string,
    preset?: boolean = false,
    ext?: string = 'js',
  ): string {
    const fileName = preset ? `${appName}.preset.${ext}` : `${appName}.${ext}`;
    const { configFolder } = this.tool.options;

    return path.resolve(
      this.tool.options.root,
      'node_modules',
      moduleName,
      configFolder,
      fileName,
    );
  }
}
