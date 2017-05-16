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
import isEmptyObject from './helpers/isEmptyObject';

import type { ToolConfig, PackageConfig } from './types';

const PLUGIN_PREFIX: string = 'plugin:';

export default class ConfigLoader {
  config: ToolConfig = {};
  name: string;
  package: PackageConfig = {};

  constructor(name: string) {
    this.name = name;
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
    if (!extendPaths) {
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
        moduleName = `${this.name}-plugin-${moduleName.slice(PLUGIN_PREFIX.length)}`;
      }

      return path.resolve(
        'node_modules/',
        moduleName,
        `config/${this.name}.preset.js`,
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

    // Apply local configuration last
    this.config = merge(nextConfig, config);

    return this.config;
  }

  /**
   * Load a local configuration file relative to the current working directory,
   * or from within a package.json property of the same name.
   *
   * Support both JSON and JS file formats by globbing the config directory.
   */
  loadConfig(): ToolConfig {
    if (isEmptyObject(this.package)) {
      throw new Error('Cannot load configuration as "package.json" has not been loaded.');
    }

    const { name } = this;
    const camelName = camelCase(name);
    let config = {};

    // Config has been defined in package.json
    if (this.package[camelName]) {
      config = this.package[camelName];

    // Locate files within a local config folder
    } else {
      const filePaths = glob.sync(
        path.join(process.cwd(), `config/${name}.{json,json5,js}`),
        { absolute: true },
      );

      if (filePaths.length === 0) {
        throw new Error(
          'Local configuration file could not be found. ' +
          `One of "${name}.json" or "${name}.js" must exist ` +
          'in a "config" folder relative to the project root.',
        );

      } else if (filePaths.length !== 1) {
        throw new Error(
          `Multiple "${name}" configuration files found. Only 1 may exist.`,
        );
      }

      // Parse and extract the located file
      config = this.parseFile(filePaths[0]);
    }

    if (isEmptyObject(config)) {
      throw new Error('Invalid configuration. Must be a plain object.');
    }

    this.config = config;

    return this.extendPresets(config);
  }

  /**
   * Load the "package.json" from the current working directory,
   * as we require the build tool to be ran from the project root.
   */
  loadPackageJSON(): PackageConfig {
    if (!fs.existsSync('package.json')) {
      throw new Error(
        'Local "package.json" could not be found. ' +
        'Please run this command in your project\'s root.',
      );
    }

    this.package = JSON.parse(fs.readFileSync('package.json', 'utf8'));

    return this.package;
  }

  /**
   * Parse a configuration file at the defined file system path.
   * If the file ends in "json" or "json5", parse it with JSON5.
   * If the file ends in "js", import the file and use the default object.
   * Otherwise throw an error.
   */
  parseFile(filePath: string): Config {
    const ext = path.extname(filePath);

    switch (ext) {
      case '.json':
      case '.json5':
        return JSON5.parse(fs.readFileSync(filePath, 'utf8'));

      case '.js':
        // eslint-disable-next-line
        return require(filePath);

      default:
        throw new Error(`Unsupported configuration format ${this.name}${ext}.`);
    }
  }
}
