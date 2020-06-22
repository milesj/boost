/* eslint-disable security/detect-non-literal-regexp */

import path from 'path';
import { PathResolver, requireModule, ModuleName, isObject, MODULE_NAME_PART } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { color } from '@boost/internal';
import { Pluggable, Factory } from './types';
import debug from './debug';
import PluginError from './PluginError';
import Registry from './Registry';

export default class Loader<Plugin extends Pluggable> {
  readonly debug: Debugger;

  private registry: Registry<Plugin>;

  constructor(registry: Registry<Plugin>) {
    this.registry = registry;
    this.debug = createDebugger([registry.singularName, 'loader']);
  }

  /**
   * Create a path resolver that will attempt to find a plugin at a defined Node module,
   * based on a list of acceptable plugin module name patterns.
   */
  createResolver(name: ModuleName): PathResolver {
    const resolver = new PathResolver();
    const { singularName: typeName, projectName } = this.registry;
    const moduleName = name.toLowerCase();
    const modulePattern = MODULE_NAME_PART.source;
    const isNotProjectOrType = !moduleName.includes(projectName) && !moduleName.includes(typeName);

    this.debug('Resolving possible %s modules', color.symbol(typeName));

    // Absolute or relative file path
    if (path.isAbsolute(name) || name.charAt(0) === '.') {
      this.debug('Found a file path: %s', color.filePath(name));

      resolver.lookupFilePath(name);

      // @scope/project-plugin-name
    } else if (
      moduleName.match(
        new RegExp(`^@${modulePattern}/${projectName}-${typeName}-${modulePattern}$`, 'u'),
      )
    ) {
      this.debug('Found an explicit module with custom scope: %s', color.moduleName(moduleName));

      resolver.lookupNodeModule(moduleName);

      // @project/plugin-name
    } else if (
      moduleName.match(new RegExp(`^@${projectName}/${typeName}-${modulePattern}$`, 'u'))
    ) {
      this.debug('Found an explicit internal module with scope: %s', color.moduleName(moduleName));

      resolver.lookupNodeModule(moduleName);

      // @scope/name
    } else if (
      moduleName.match(new RegExp(`^@${modulePattern}/${modulePattern}$`, 'u')) &&
      isNotProjectOrType
    ) {
      const [scope, customName] = moduleName.split('/');
      const customModuleName = `${scope}/${projectName}-${typeName}-${customName}`;

      this.debug('Found a shorthand module with custom scope: %s', color.moduleName(moduleName));

      resolver.lookupNodeModule(customModuleName);

      // project-plugin-name
    } else if (moduleName.match(new RegExp(`^${projectName}-${typeName}-${modulePattern}$`, 'u'))) {
      this.debug('Found an explicit public module: %s', color.moduleName(moduleName));

      resolver.lookupNodeModule(moduleName);

      // The previous 2 patterns if only name provided
    } else if (moduleName.match(new RegExp(`^${modulePattern}$`, 'u')) && isNotProjectOrType) {
      this.debug(
        'Resolving modules with internal "%s" scope and public "%s" prefix',
        color.projectName(`@${projectName}`),
        color.projectName(projectName),
      );

      // Detect internal scopes before public ones
      resolver.lookupNodeModule(this.registry.formatModuleName(moduleName, true));
      resolver.lookupNodeModule(this.registry.formatModuleName(moduleName));

      // Unknown plugin module pattern
    } else {
      throw new PluginError('UNKNOWN_MODULE_FORMAT', [moduleName]);
    }

    debug('Loading plugins from: %s', resolver.getLookupPaths().join(', '));

    return resolver;
  }

  /**
   * Load a plugin by short name or fully qualified module name, with an optional options object.
   */
  async load(name: ModuleName, options: object = {}): Promise<Plugin> {
    const { originalPath, resolvedPath } = this.createResolver(name).resolve();

    this.debug('Loading "%s" from %s', color.moduleName(name), color.filePath(resolvedPath));

    const factory: Factory<Plugin> = requireModule(resolvedPath);

    if (typeof factory !== 'function') {
      throw new PluginError('INVALID_FACTORY', [typeof factory]);
    }

    const plugin = await factory(options);

    if (isObject(plugin) && !plugin.name) {
      plugin.name = originalPath.path();
    }

    return plugin;
  }
}
