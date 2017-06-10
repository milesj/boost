/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import path from 'path';
import Plugin from './Plugin';
import formatPluginModuleName from './helpers/formatPluginModuleName';
import isObject from './helpers/isObject';

import type { Config } from './types';

type PluginOrModuleName = string | Plugin;

export default class PluginLoader {
  appName: string;
  plugins: Plugin[] = [];

  constructor(appName: string) {
    this.appName = appName;
  }

  /**
   * Import a plugin class definition from a Node module and instantiate the class
   * with the provided configuration object.
   */
  importPlugin(name: string, config: Config = {}): Plugin {
    const moduleName = formatPluginModuleName(this.appName, name);
    let importedPlugin;

    // Use `require` instead of `vm` so that we can rely on Node's index resolution algorithm`
    try {
      // eslint-disable-next-line
      importedPlugin = require(path.resolve('node_modules', moduleName));
    } catch (error) {
      throw new Error(`Missing plugin module "${moduleName}".`);
    }

    // An instance was returned instead of the class definition
    if (importedPlugin instanceof Plugin) {
      throw new Error(
        `A plugin class instance was exported from "${moduleName}". ` +
        `${this.appName} requires a plugin class definition to be exported.`,
      );

    } else if (typeof importedPlugin !== 'function') {
      throw new Error(`Invalid plugin class definition exported from "${moduleName}".`);
    }

    const PluginClass = importedPlugin;

    return new PluginClass(config);
  }

  /**
   * If loading from an object, extract the plugin name and use the remaining object
   * as configuration for the `Plugin` instance.
   */
  importPluginFromConfig(baseConfig: Config = {}): Plugin {
    const { plugin, ...config } = baseConfig;

    if (!plugin || typeof plugin !== 'string') {
      throw new Error(
        'A `plugin` name property must exist when loading plugins through a configuration object.',
      );
    }

    return this.importPlugin(plugin, config);
  }

  /**
   * Load and or instantiate `Plugin`s from the `plugins` configuration option.
   * If a plugin instance, use directly. If a string, attempt to load and
   * instantiate from a module. If an object, extract the name and run the previous.
   */
  loadPlugins(plugins: PluginOrModuleName[]): Plugin[] {
    this.plugins = plugins.map((plugin) => {
      if (plugin instanceof Plugin) {
        return plugin;

      } else if (typeof plugin === 'string') {
        return this.importPlugin(plugin);

      } else if (isObject(plugin)) {
        return this.importPluginFromConfig(plugin);
      }

      throw new Error(
        'Invalid plugin. Must be an instance of `Plugin` ' +
        'or the name of a module that exports a `Plugin` class.',
      );
    });

    this.sortPlugins();

    return this.plugins;
  }

  /**
   * Sort the plugins from highest to lowest priority.
   */
  sortPlugins(): this {
    this.plugins.sort((a, b) => b.priority - a.priority);

    return this;
  }
}
