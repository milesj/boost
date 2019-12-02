import { PathResolver, isObject, requireModule } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { color } from '@boost/internal';
import { PluginType, Pluggable, Setting, Factory, LoadResult, ExplicitPlugin } from './types';
import { MODULE_NAME_PATTERN, DEFAULT_PRIORITY } from './constants';
import formatModuleName from './formatModuleName';

export default class Loader<Plugin extends Pluggable> {
  readonly debug: Debugger;

  readonly type: PluginType<Plugin>;

  private toolName: string;

  constructor(type: PluginType<Plugin>, toolName: string) {
    this.type = type;
    this.toolName = toolName;
    this.debug = createDebugger(`${type.singularName}-loader`);
  }

  /**
   * Check and verify that the plugin and its structure is accurate.
   */
  checkPlugin(plugin: Plugin): Plugin {
    if (!isObject(plugin)) {
      throw new TypeError(
        `Expected an object or class instance from the plugin factory function, found ${typeof plugin}.`,
      );
    }

    this.type.validate(plugin);

    return plugin;
  }

  /**
   * Create a path resolver that will attempt to find a plugin at a defined Node module,
   * based on a list of acceptable plugin module name patterns.
   */
  createResolver(name: string): PathResolver {
    const resolver = new PathResolver();
    const { toolName } = this;
    const typeName = this.type.singularName;
    const moduleName = name.toLowerCase();
    const modulePattern = MODULE_NAME_PATTERN.source;
    const isNotToolOrType = !moduleName.includes(toolName) && !moduleName.includes(typeName);

    this.debug('Resolving possible %s modules', color.pluginName(typeName));

    // @scope/tool-plugin-name
    if (
      moduleName.match(
        new RegExp(`^@${modulePattern}/${toolName}-${typeName}-${modulePattern}$`, 'u'),
      )
    ) {
      this.debug(
        'Found an explicit %s module with custom scope: %s',
        color.pluginName(typeName),
        color.moduleName(moduleName),
      );

      resolver.lookupNodeModule(moduleName);

      // @tool/plugin-name
    } else if (moduleName.match(new RegExp(`^@${toolName}/${typeName}-${modulePattern}$`, 'u'))) {
      this.debug(
        'Found an explicit internal %s module with scope: %s',
        color.pluginName(typeName),
        color.moduleName(moduleName),
      );

      resolver.lookupNodeModule(moduleName);

      // @scope/name
    } else if (
      moduleName.match(new RegExp(`^@${modulePattern}/${modulePattern}$`, 'u')) &&
      isNotToolOrType
    ) {
      const [scope, customName] = moduleName.split('/');
      const customModuleName = `${scope}/${toolName}-${typeName}-${customName}`;

      this.debug(
        'Found an explicit shorthand %s module with custom scope: %s',
        color.pluginName(typeName),
        color.moduleName(moduleName),
      );

      resolver.lookupNodeModule(customModuleName);

      // tool-plugin-name
    } else if (moduleName.match(new RegExp(`^${toolName}-${typeName}-${modulePattern}$`, 'u'))) {
      this.debug(
        'Found an explicit public %s module: %s',
        color.pluginName(typeName),
        color.moduleName(moduleName),
      );

      resolver.lookupNodeModule(moduleName);

      // The previous 2 patterns if only name provided
    } else if (moduleName.match(new RegExp(`^${modulePattern}$`, 'u')) && isNotToolOrType) {
      this.debug(
        'Resolving %s modules against internal "%s" scope and public "%s" prefix',
        color.pluginName(typeName),
        color.toolName(`@${toolName}`),
        color.toolName(toolName),
      );

      resolver.lookupNodeModule(formatModuleName(toolName, typeName, moduleName, true));
      resolver.lookupNodeModule(formatModuleName(toolName, typeName, moduleName));

      // Unknown plugin module pattern
    } else {
      throw new Error(`Unknown plugin module format "${moduleName}".`);
    }

    return resolver;
  }

  /**
   * Load a plugin by short name or fully qualified module name, with an optional options object
   * and sort priority.
   */
  load(
    name: string,
    options: object = {},
    priority: number = DEFAULT_PRIORITY,
  ): LoadResult<Plugin> {
    const { originalPath, resolvedPath } = this.createResolver(name).resolve();

    this.debug(
      'Loading %s "%s" from %s',
      color.pluginName(this.type.singularName),
      name,
      color.filePath(resolvedPath),
    );

    const factory: Factory<Plugin, object> = requireModule(resolvedPath);

    if (typeof factory !== 'function') {
      throw new TypeError(
        `Plugin modules must export a default function, found ${typeof factory}.`,
      );
    }

    const plugin = this.checkPlugin(factory(options));

    return {
      name: originalPath.path(),
      plugin,
      priority,
    };
  }

  /**
   * Load multiple plugins based on a list of settings. The possible setting variants are:
   *
   * - If a string, will load based on Node module name.
   * - If an array of 2 items, the 1st item will be considered the Node module name,
   *    and the 2nd item an options object that will be passed to the factory function.
   * - If an object or class instance, will assume to be the plugin itself.
   */
  loadFromSettings(settings: Setting<Plugin>[]): LoadResult<Plugin>[] {
    return settings.map(setting => {
      if (typeof setting === 'string') {
        return this.load(setting);
      }

      if (Array.isArray(setting)) {
        const [name, options, priority] = setting;

        return this.load(name, options, priority);
      }

      if (isObject<ExplicitPlugin>(setting)) {
        if (setting.name) {
          return {
            name: setting.name,
            plugin: this.checkPlugin(setting),
            priority: setting.priority || DEFAULT_PRIORITY,
          };
        }

        throw new Error('Plugin object or class instance found without a `name` property.');
      }

      throw new Error(`Unknown plugin setting: ${setting}`);
    });
  }
}
