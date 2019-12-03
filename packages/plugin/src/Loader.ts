import { PathResolver, isObject, requireModule } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { color } from '@boost/internal';
import { Pluggable, Setting, Factory, Certificate } from './types';
import { MODULE_NAME_PATTERN, DEFAULT_PRIORITY } from './constants';
import Manager from './Manager';

export default class Loader<Plugin extends Pluggable> {
  readonly debug: Debugger;

  private manager: Manager<Plugin>;

  constructor(manager: Manager<Plugin>) {
    this.manager = manager;
    this.debug = createDebugger([manager.singularName, 'loader']);
  }

  /**
   * Create a path resolver that will attempt to find a plugin at a defined Node module,
   * based on a list of acceptable plugin module name patterns.
   */
  createResolver(name: string): PathResolver {
    const resolver = new PathResolver();
    const { singularName: typeName, toolName } = this.manager;
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
        'Found a shorthand %s module with custom scope: %s',
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

      // Detect internal scopes before public ones
      resolver.lookupNodeModule(this.manager.formatModuleName(moduleName, true));
      resolver.lookupNodeModule(this.manager.formatModuleName(moduleName));

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
  ): Certificate<Plugin> {
    const { originalPath, resolvedPath } = this.createResolver(name).resolve();

    this.debug(
      'Loading %s "%s" from %s',
      color.pluginName(this.manager.singularName),
      name,
      color.filePath(resolvedPath),
    );

    const factory: Factory<Plugin> = requireModule(resolvedPath);

    if (typeof factory !== 'function') {
      throw new TypeError(
        `Plugin modules must export a default function, found ${typeof factory}.`,
      );
    }

    return {
      name: originalPath.path(),
      plugin: factory(options),
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
  loadFromSettings(settings: Setting<Plugin>[]): Certificate<Plugin>[] {
    return settings.map(setting => {
      if (typeof setting === 'string') {
        return this.load(setting);
      }

      if (Array.isArray(setting)) {
        const [name, options, priority] = setting;

        return this.load(name, options, priority);
      }

      if (isObject<Pluggable>(setting)) {
        if (setting.name) {
          return {
            name: setting.name,
            plugin: setting,
            priority: setting.priority || DEFAULT_PRIORITY,
          };
        }

        throw new Error('Plugin object or class instance found without a `name` property.');
      }

      throw new Error(`Unknown plugin setting: ${setting}`);
    });
  }
}
