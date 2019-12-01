import kebabCase from 'lodash/kebabCase';
import pluralize from 'pluralize';
import { instanceOf } from '@boost/common';
import { createDebugger } from '@boost/debug';
import { RuntimeError, color } from '@boost/internal';
import Loader from './Loader';
import { PluginType, PluginSetting, Pluggable } from './types';

export default class Registry<Types extends { [type: string]: Pluggable }> {
  readonly debug = createDebugger('plugin-registry');

  private plugins: { [K in keyof Types]?: Set<Types[K]> } = {};

  private toolName: string;

  private types: { [K in keyof Types]?: PluginType<Types[K]> } = {};

  constructor(toolName: string) {
    this.toolName = kebabCase(toolName);
  }

  /**
   * Return a plugin loader for the defined type.
   */
  createLoader<K extends keyof Types>(typeName: K): Loader<Types[K]> {
    return new Loader(this.getRegisteredType(typeName), this.toolName);
  }

  /**
   * Return a plugin by name and type.
   */
  getPlugin<K extends keyof Types>(typeName: K, name: string): Types[K] {
    const plugin = this.getPlugins(typeName).find(p => instanceOf(p, Plugin) && p.name === name);

    if (plugin) {
      return plugin;
    }

    throw new RuntimeError('plugin', 'PG_MISSING_PLUGIN', [typeName, name]);
  }

  /**
   * Return all plugins by type.
   */
  getPlugins<K extends keyof Types>(typeName: K): Types[K][] {
    // Trigger type check
    this.getRegisteredType(typeName);

    return Array.from(this.plugins[typeName]!);
  }

  /**
   * Return a registered plugin type by name.
   */
  getRegisteredType<K extends keyof Types>(typeName: K): PluginType<Types[K]> {
    const type = this.types[typeName];

    if (!type) {
      throw new RuntimeError('plugin', 'PG_MISSING_TYPE', [typeName]);
    }

    return type!;
  }

  /**
   * Return the registered plugin types.
   */
  getRegisteredTypes() /* infer */ {
    return this.types;
  }

  /**
   * Return true if a plugin by type has been enabled, by comparing it to a setting.
   * The setting is commonly loaded from a config file, and is a list of all plugin options.
   * The following setting variants are supported:
   *
   * - As a string using the plugins name: "foo"
   * - As an object with a property of plugin type: { plugin: "foo" }
   * - As an instance of the plugin class: new FooPlugin()
   */
  isPluginEnabled<K extends keyof Types>(
    typeName: K,
    name: string,
    setting: PluginSetting<Types[K]>[],
  ): boolean {
    if (!setting || !Array.isArray(setting)) {
      return false;
    }

    // TODO search in loaded plugins list

    return setting.some(value => {
      if (typeof value === 'string' && value === name) {
        return true;
      }

      if (Array.isArray(value) && value[0] === name) {
        return true;
      }

      return value === name;
    });
  }

  /**
   * Register a custom type of plugin, with an optional declaration that instances should extend.
   * The type name should be in singular form, as plural variants are generated automatically.
   */
  registerType<K extends keyof Types>(
    typeName: K,
    options: Pick<PluginType<Types[K]>, 'afterBootstrap' | 'beforeBootstrap' | 'validate'>,
  ): this {
    if (this.types[typeName]) {
      throw new RuntimeError('plugin', 'PG_EXISTS_TYPE', [typeName]);
    }

    const name = String(typeName);
    const { afterBootstrap, beforeBootstrap, validate } = options;

    this.debug('Registering new plugin type: %s', color.pluginName(name));

    this.plugins[typeName] = new Set();

    this.types[typeName] = {
      afterBootstrap,
      beforeBootstrap,
      pluralName: pluralize(name),
      singularName: name,
      validate,
    };

    return this;
  }
}
