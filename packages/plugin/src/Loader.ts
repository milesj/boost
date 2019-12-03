import { PathResolver, requireModule, ModuleName, isObject } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { color } from '@boost/internal';
import { Pluggable, Factory } from './types';
import { MODULE_PART_PATTERN } from './constants';
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
  createResolver(name: ModuleName): PathResolver {
    const resolver = new PathResolver();
    const { singularName: typeName, projectName } = this.manager;
    const moduleName = name.toLowerCase();
    const modulePattern = MODULE_PART_PATTERN.source;
    const isNotToolOrType = !moduleName.includes(projectName) && !moduleName.includes(typeName);

    this.debug('Resolving possible %s modules', color.pluginName(typeName));

    // @scope/tool-plugin-name
    if (
      moduleName.match(
        new RegExp(`^@${modulePattern}/${projectName}-${typeName}-${modulePattern}$`, 'u'),
      )
    ) {
      this.debug('Found an explicit module with custom scope: %s', color.moduleName(moduleName));

      resolver.lookupNodeModule(moduleName);

      // @tool/plugin-name
    } else if (
      moduleName.match(new RegExp(`^@${projectName}/${typeName}-${modulePattern}$`, 'u'))
    ) {
      this.debug('Found an explicit internal module with scope: %s', color.moduleName(moduleName));

      resolver.lookupNodeModule(moduleName);

      // @scope/name
    } else if (
      moduleName.match(new RegExp(`^@${modulePattern}/${modulePattern}$`, 'u')) &&
      isNotToolOrType
    ) {
      const [scope, customName] = moduleName.split('/');
      const customModuleName = `${scope}/${projectName}-${typeName}-${customName}`;

      this.debug('Found a shorthand module with custom scope: %s', color.moduleName(moduleName));

      resolver.lookupNodeModule(customModuleName);

      // tool-plugin-name
    } else if (moduleName.match(new RegExp(`^${projectName}-${typeName}-${modulePattern}$`, 'u'))) {
      this.debug('Found an explicit public module: %s', color.moduleName(moduleName));

      resolver.lookupNodeModule(moduleName);

      // The previous 2 patterns if only name provided
    } else if (moduleName.match(new RegExp(`^${modulePattern}$`, 'u')) && isNotToolOrType) {
      this.debug(
        'Resolving modules with internal "%s" scope and public "%s" prefix',
        color.toolName(`@${projectName}`),
        color.toolName(projectName),
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
  load(name: ModuleName, options: object = {}): Plugin {
    const { originalPath, resolvedPath } = this.createResolver(name).resolve();

    this.debug('Loading "%s" from %s', name, color.filePath(resolvedPath));

    const factory: Factory<Plugin> = requireModule(resolvedPath);

    if (typeof factory !== 'function') {
      throw new TypeError(
        `Plugin modules must export a default function, found ${typeof factory}.`,
      );
    }

    const plugin = factory(options);

    if (isObject(plugin) && !plugin.name) {
      plugin.name = originalPath.path();
    }

    return plugin;
  }
}
