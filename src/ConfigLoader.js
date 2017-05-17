/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import camelCase from 'lodash/camelCase';
import fs from 'fs';
import glob from 'glob';
import JSON5 from 'json5';
import merge from 'lodash/merge';
import path from 'path';
import vm from 'vm';
import isObject from './helpers/isObject';
import isEmptyObject from './helpers/isEmptyObject';
import { DEFAULT_TOOL_CONFIG, DEFAULT_PACKAGE_CONFIG } from './constants';

import type { ToolConfig, PackageConfig } from './types';

const PLUGIN_PREFIX: string = 'plugin:';

export default class ConfigLoader {
  appName: string;
  config: ToolConfig;
  package: PackageConfig;

  constructor(appName: string) {
    this.appName = appName;
  }

  /**
   * If an `extends` option exists, merge the current configuration
   * with the preset configurations defined within `extends`.
   */
  extendPresets(config: ToolConfig): ToolConfig {
    if (isEmptyObject(config)) {
      throw new Error('Cannot extend presets as configuration has not been loaded.');
    }

    let { extends: extendPaths } = config;

    // Nothing to extend
    if (!extendPaths || !extendPaths.length) {
      return config;
    }

    extendPaths = Array.isArray(extendPaths) ? extendPaths : [extendPaths];

    // Determine file paths to preset configs
    extendPaths = extendPaths.map((extendPath) => {
      if (typeof extendPath !== 'string') {
        throw new Error(
          'Invalid `extends` configuration value. ' +
          'Must be a string or an array of strings.',
        );
      }

      // Absolute path, use it directly
      if (path.isAbsolute(extendPath)) {
        return path.normalize(extendPath);

      // Relative path, resolve with cwd
      } else if (extendPath[0] === '.') {
        return path.resolve(extendPath);
      }

      // Node module, generate a path
      let moduleName = extendPath;

      if (moduleName.startsWith(PLUGIN_PREFIX)) {
        moduleName = `${this.appName}-plugin-${moduleName.slice(PLUGIN_PREFIX.length)}`;
      }

      return path.resolve(
        'node_modules/',
        moduleName,
        `config/${this.appName}.preset.js`,
      );
    });

    // Recursively merge preset configurations
    const nextConfig = {};

    extendPaths.forEach((filePath) => {
      if (!fs.existsSync(filePath)) {
        throw new Error(`Preset configuration ${filePath} does not exist.`);

      } else if (!fs.statSync(filePath).isFile()) {
        throw new Error(`Preset configuration ${filePath} must be a valid file.`);
      }

      merge(nextConfig, this.parseFile(filePath));
    });

    // Apply preset configuration before local
    merge(this.config, nextConfig, config, {
      extends: extendPaths,
    });

    return this.config;
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

    const { appName } = this;
    const camelName = camelCase(appName);
    let config = {};

    // Config has been defined in package.json
    if (this.package[camelName]) {
      config = this.package[camelName];

      // Extend from a preset if a string
      if (typeof config === 'string') {
        config = { extends: config };
      }

    // Locate files within a local config folder
    } else {
      const filePaths = glob.sync(
        path.join(process.cwd(), `config/${appName}.{json,json5,js}`),
        { absolute: true },
      );

      if (filePaths.length === 0) {
        throw new Error(
          'Local configuration file could not be found. ' +
          `One of "config/${appName}.json" or "config/${appName}.js" must exist ` +
          'relative to the project root.',
        );

      } else if (filePaths.length !== 1) {
        throw new Error(
          `Multiple "${appName}" configuration files found. Only 1 may exist.`,
        );
      }

      // Parse and extract the located file
      config = this.parseFile(filePaths[0]);
    }

    // Set the current config incase presets do not exist
    if (isObject(config)) {
      this.config = {
        ...DEFAULT_TOOL_CONFIG,
        ...config,
      };
    } else {
      throw new Error('Invalid configuration. Must be a plain object.');
    }

    // Extend from preset configurations if available
    if (config.extends) {
      // TODO
    }

    return this.config;
  }

  /**
   * Load the "package.json" from the current working directory,
   * as we require the build tool to be ran from the project root.
   */
  loadPackageJSON(): PackageConfig {
    if (!fs.existsSync('package.json')) {
      throw new Error(
        'Local "package.json" could not be found. ' +
        'Please run the command in your project\'s root.',
      );
    }

    this.package = {
      ...DEFAULT_PACKAGE_CONFIG,
      ...this.parseFile('package.json'),
    };

    return this.package;
  }

  /**
   * Parse a configuration file at the defined file system path.
   * If the file ends in "json" or "json5", parse it with JSON5.
   * If the file ends in "js", import the file and use the default object.
   * Otherwise throw an error.
   */
  parseFile(filePath: string): Object {
    const name = path.basename(filePath);
    const ext = path.extname(filePath);
    let value;

    if (ext === '.json' || ext === '.json5') {
      value = JSON5.parse(fs.readFileSync(filePath, 'utf8'));

    } else if (ext === '.js') {
      const context = { module: {} };

      vm.runInNewContext(fs.readFileSync(filePath, 'utf8'), context);

      value = context.module.exports;

    } else {
      throw new Error(`Unsupported configuration file format "${name}".`);
    }

    if (!isObject(value)) {
      throw new Error(`Invalid configuration file "${name}". Must return an object.`);
    }

    // $FlowIgnore We type check object above
    return value;
  }
}
