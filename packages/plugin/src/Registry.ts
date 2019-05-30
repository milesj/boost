import pluralize from 'pluralize';
import { instanceOf, AbstractConstructor } from '@boost/common';
import { color, createDebugger } from '@boost/debug';
import { PluginType, PluginSetting } from './types';

export default class Registry<Types extends object> {
  debug = createDebugger('plugin-registry');

  private plugins: { [K in keyof Types]?: Set<Types[K]> } = {};

  private types: { [K in keyof Types]?: PluginType<Types[K]> } = {};

  /**
   * Return a plugin by name and type.
   */
  getPlugin<K extends keyof Types>(typeName: K, name: string): Types[K] {
    const plugin = this.getPlugins(typeName).find(p => instanceOf(p, Plugin) && p.name === name);

    if (plugin) {
      return plugin;
    }

    // errors:pluginNotFound
    throw new Error(`Failed to find ${typeName} "${name}". Have you installed it?`);
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
      // errors:pluginContractNotFound
      throw new Error(`Plugin type "${typeName}" could not be found. Has it been registered?`);
    }

    return type;
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
   * - As an object with a property by plugin type: { plugin: "foo" }
   * - As an instance of the plugin class: new Plugin()
   */
  isPluginEnabled<K extends keyof Types>(
    typeName: K,
    name: string,
    setting: PluginSetting<Types[K]>,
  ): boolean {
    const type = this.getRegisteredType(typeName);

    if (!setting || !Array.isArray(setting)) {
      return false;
    }

    return setting.some(value => {
      if (typeof value === 'string' && value === name) {
        return true;
      }

      if (
        typeof value === 'object' &&
        value[type.singularName] &&
        value[type.singularName] === name
      ) {
        return true;
      }

      if (instanceOf(value, type.declaration) && (value as any).name === name) {
        return true;
      }

      return false;
    });
  }

  /**
   * Register a custom type of plugin, with a defined contract that all instances should extend.
   * The type name should be in singular form, as plural variants are generated automatically.
   */
  registerType<K extends keyof Types>(
    typeName: K,
    declaration: AbstractConstructor<Types[K]>,
    options: Partial<
      Pick<PluginType<Types[K]>, 'afterBootstrap' | 'beforeBootstrap' | 'moduleScopes'>
    > = {},
  ): this {
    if (this.types[typeName]) {
      // errors:pluginContractExists
      throw new Error(`Plugin type "${typeName}" already exists.`);
    }

    const name = String(typeName);
    const { afterBootstrap = null, beforeBootstrap = null, moduleScopes = [] } = options;

    this.debug('Registering new plugin type: %s', color.magenta(name));

    this.plugins[typeName] = new Set();

    this.types[typeName] = {
      afterBootstrap,
      beforeBootstrap,
      declaration,
      // loader: new ModuleLoader(this, name, declaration, scopes),
      moduleScopes,
      pluralName: pluralize(name),
      singularName: name,
    };

    return this;
  }
}
