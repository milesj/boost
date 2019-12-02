import kebabCase from 'lodash/kebabCase';
import pluralize from 'pluralize';
import { createDebugger } from '@boost/debug';
import { RuntimeError, color } from '@boost/internal';
import Loader from './Loader';
import { PluginType, Pluggable, LoadResult } from './types';
import formatModuleName from './formatModuleName';

export default class Registry<Types extends { [type: string]: Pluggable }> {
  readonly debug = createDebugger('plugin-registry');

  private plugins: { [K in keyof Types]?: LoadResult<Types[K]>[] } = {};

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
    const type = this.getRegisteredType(typeName);
    const publicModule = formatModuleName(this.toolName, type.singularName, name);
    const internalModule = formatModuleName(this.toolName, type.singularName, name, true);
    const plugin = this.getPluginsByType(typeName).find(
      result =>
        result.name === name || result.name === publicModule || result.name === internalModule,
    );

    if (plugin) {
      return plugin.plugin;
    }

    throw new RuntimeError('plugin', 'PG_MISSING_PLUGIN', [typeName, name]);
  }

  /**
   * Return all plugins by type.
   */
  getPlugins<K extends keyof Types>(typeName: K): Types[K][] {
    return this.getPluginsByType(typeName).map(result => result.plugin);
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
   * Return true if a plugin by type has been loaded and enabled.
   */
  isPluginLoaded<K extends keyof Types>(typeName: K, name: string): boolean {
    return !!this.getPlugin(typeName, name);
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

    this.plugins[typeName] = [];

    this.types[typeName] = {
      afterBootstrap,
      beforeBootstrap,
      pluralName: pluralize(name),
      singularName: name,
      validate,
    };

    return this;
  }

  /**
   * Return a list of plugin results by type.
   */
  protected getPluginsByType<K extends keyof Types>(typeName: K) /* infer */ {
    // Trigger type check
    this.getRegisteredType(typeName);

    return Array.from(this.plugins[typeName]!);
  }
}
