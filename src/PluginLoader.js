/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import upperFirst from 'lodash/upperFirst';
import Plugin from './Plugin';
import formatPluginModuleName from './helpers/formatPluginModuleName';
import isObject from './helpers/isObject';

import type { Config } from './types';

type PluginOrModuleName = string | Plugin;

export default class PluginLoader {
  appName: string;

  pluginName: string;

  plugins: Plugin[] = [];

  constructor(appName: string, pluginName: string) {
    this.appName = appName;
    this.pluginName = pluginName;
  }

  /**
   * Import a plugin class definition from a Node module and instantiate the class
   * with the provided configuration object.
   */
  importPlugin(name: string, config: Config = {}): Plugin {
    const { appName, pluginName } = this;
    const moduleName = formatPluginModuleName(appName, pluginName, name);
    let importedPlugin;

    // Use `require` instead of `vm` so that we can rely on Node's index resolution algorithm`
    try {
      // eslint-disable-next-line
      importedPlugin = require(moduleName);
    } catch (error) {
      throw new Error(`Missing ${pluginName} module "${moduleName}".`);
    }

    // An instance was returned instead of the class definition
    if (importedPlugin instanceof Plugin) {
      throw new TypeError(
        `A ${pluginName} class instance was exported from "${moduleName}". ` +
        `${appName} requires a ${pluginName} class definition to be exported.`,
      );

    } else if (typeof importedPlugin !== 'function') {
      throw new TypeError(
        `Invalid ${pluginName} class definition exported from "${moduleName}".`,
      );
    }

    const PluginClass = importedPlugin;
    const plugin = new PluginClass(config);

    if (!(plugin instanceof Plugin)) {
      throw new TypeError(`${upperFirst(pluginName)} exported from "${moduleName}" is invalid.`);
    }

    return plugin;
  }

  /**
   * If loading from an object, extract the plugin name and use the remaining object
   * as configuration for the `Plugin` instance.
   */
  importPluginFromConfig(baseConfig: Config = {}): Plugin {
    const { pluginName } = this;
    const config = { ...baseConfig };
    const plugin = config[pluginName];

    delete config[pluginName];

    if (!plugin || typeof plugin !== 'string') {
      throw new Error(
        `A "${pluginName}" property must exist when loading through a configuration object.`,
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
    const { pluginName } = this;

    this.plugins = plugins.map((plugin) => {
      if (plugin instanceof Plugin) {
        return plugin;

      } else if (typeof plugin === 'string') {
        return this.importPlugin(plugin);

      } else if (isObject(plugin)) {
        return this.importPluginFromConfig(plugin);
      }

      throw new Error(
        `Invalid ${pluginName}. Must be a class instance or a module that exports a class definition.`,
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
