/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import chalk from 'chalk';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import JSON5 from 'json5';
import camelCase from 'lodash/camelCase';
import mergeWith from 'lodash/mergeWith';
import pluralize from 'pluralize';
import optimal, { array, bool, instance, object, shape, string, union } from 'optimal';
import formatModuleName from './helpers/formatModuleName';
import isObject from './helpers/isObject';
import isEmptyObject from './helpers/isEmptyObject';
import requireModule from './helpers/requireModule';
import Tool from './Tool';
import Plugin from './Plugin';
import Reporter from './Reporter';
import { MODULE_NAME_PATTERN, PLUGIN_NAME_PATTERN } from './constants';
import { Debugger, ToolConfig, PackageConfig } from './types';

export type ConfigObject = { [key: string]: any };

export type ConfigPathOrObject = string | ConfigObject;

export default class ConfigLoader {
  debug: Debugger;

  package: PackageConfig = { name: '' };

  parsedFiles: { [path: string]: boolean } = {};

  tool: Tool;

  workspaceRoot: string = '';

  constructor(tool: Tool) {
    this.debug = tool.createDebugger('config-loader');
    this.tool = tool;
  }

  /**
   * Find the config in the package.json block under the application name.
   */
  findConfigInPackageJSON(pkg: PackageConfig): ConfigPathOrObject | null {
    const camelName = camelCase(this.tool.options.appName);
    const config = pkg[camelName];

    this.debug.invariant(
      !!config,
      `Looking in package.json under ${chalk.yellow(camelName)} property`,
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
    const { appName, configFolder } = this.tool.options;
    const relPath = path.join(configFolder, `${appName}.{js,json,json5}`);
    const configPaths = glob.sync(path.join(root, relPath), {
      absolute: true,
    });

    this.debug.invariant(
      configPaths.length === 1,
      `Looking for local config file in order: ${relPath}`,
      'Found',
      'Not found',
    );

    if (configPaths.length === 1) {
      this.debug('Found %s', path.basename(configPaths[0]));

      return configPaths[0];
    }

    if (configPaths.length > 1) {
      throw new Error(this.tool.i18n.t('errors:multipleConfigFiles', { name: appName }));
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
      const lernaPath = path.join(currentDir, 'lerna.json');

      // Yarn
      if (fs.existsSync(pkgPath)) {
        workspacePackage = this.parseFile(pkgPath);

        if (workspacePackage.workspaces) {
          if (Array.isArray(workspacePackage.workspaces)) {
            workspaceRoot = currentDir;
            workspacePatterns = workspacePackage.workspaces;
          } else if (Array.isArray(workspacePackage.workspaces.packages)) {
            workspaceRoot = currentDir;
            workspacePatterns = workspacePackage.workspaces.packages;
          }

          break;
        }
      }

      // Lerna
      if (workspacePackage && fs.existsSync(lernaPath)) {
        const lerna = this.parseFile(lernaPath);

        if (Array.isArray(lerna.packages)) {
          workspaceRoot = currentDir;
          workspacePatterns = lerna.packages;

          break;
        }
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
   * Handle special cases when merging 2 configuration values.
   * If the target and source are both arrays, concatenate them.
   */
  handleMerge(target: any, source: any): any {
    if (Array.isArray(target) && Array.isArray(source)) {
      return Array.from(new Set([...target, ...source]));
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
    if (isEmptyObject(this.package) || !this.package.name) {
      throw new Error(this.tool.i18n.t('errors:packageJsonNotLoaded'));
    }

    this.debug('Locating configuration');

    const { configBlueprint, pluginAlias, root } = this.tool.options;
    const config =
      this.findConfigInPackageJSON(this.package) ||
      this.findConfigInLocalFiles(root) ||
      this.findConfigInWorkspaceRoot(root);

    if (!config) {
      throw new Error(this.tool.i18n.t('errors:configNotFound'));
    }

    // Parse and extend configuration
    return optimal(
      this.parseAndExtend(config),
      {
        ...configBlueprint,
        debug: bool(),
        extends: array(string()),
        // prettier-ignore
        reporters: array(union([
          string(),
          shape({ reporter: string() }),
          instance(Reporter),
        ])),
        settings: object(),
        // prettier-ignore
        [pluralize(pluginAlias)]: array(union([
          string(),
          shape({ [pluginAlias]: string() }),
          instance(Plugin),
        ]))
      },
      {
        name: 'ConfigLoader',
        unknown: true,
      },
    );
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
      throw new Error(this.tool.i18n.t('errors:packageJsonNotFound'));
    }

    this.package = optimal(
      this.parseFile(filePath),
      {
        name: string(),
      },
      {
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
      throw new Error(this.tool.i18n.t('errors:configInvalid'));
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
        throw new Error(`Preset configuration ${extendPath} does not exist.`);
      } else if (!fs.statSync(extendPath).isFile()) {
        throw new Error(`Preset configuration ${extendPath} must be a valid file.`);
      }

      this.debug('Extending from file %s', chalk.cyan(extendPath));

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
  parseFile(filePath: string, args: any[] = []): ConfigObject {
    const name = path.basename(filePath);
    const ext = path.extname(filePath);
    let value: any = null;

    this.debug('Parsing file %s', chalk.cyan(filePath));

    if (!path.isAbsolute(filePath)) {
      throw new Error('An absolute file path is required.');
    }

    if (ext === '.json' || ext === '.json5') {
      value = JSON5.parse(fs.readFileSync(filePath, 'utf8'));
    } else if (ext === '.js') {
      value = requireModule(filePath);

      if (typeof value === 'function') {
        value = value(...args);
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
  resolveExtendPaths(extendPaths: string[], baseDir: string = ''): string[] {
    return extendPaths.map(extendPath => {
      if (typeof extendPath !== 'string') {
        throw new TypeError('Invalid `extends` configuration value. Must be an array of strings.');
      }

      const { appName, scoped, pluginAlias, root } = this.tool.options;

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
    preset: boolean = false,
    ext: string = 'js',
  ): string {
    const fileName = preset ? `${appName}.preset.${ext}` : `${appName}.${ext}`;
    const { configFolder } = this.tool.options;

    return path.resolve(this.tool.options.root, 'node_modules', moduleName, configFolder, fileName);
  }
}
