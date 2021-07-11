/* eslint-disable security/detect-non-literal-regexp */

import path from 'path';
import { isFilePath, isObject, MODULE_NAME_PART, PathResolver, requireModule } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { color } from '@boost/internal';
import debug from './debug';
import PluginError from './PluginError';
import Registry from './Registry';
import { Factory, Pluggable, Source } from './types';

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
	// eslint-disable-next-line complexity
	createResolver(name: Source): PathResolver {
		const resolver = new PathResolver();
		const { singularName: typeName, projectName } = this.registry;
		const moduleName = name.toLowerCase();
		const modulePattern = MODULE_NAME_PART.source;
		const isNotProjectOrType = !moduleName.includes(projectName) && !moduleName.includes(typeName);

		this.debug('Resolving possible %s module using lookup: %s', color.symbol(typeName), name);

		// Absolute or relative file path
		if (isFilePath(name) && (path.isAbsolute(name) || name.charAt(0) === '.')) {
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
				'Resolving module with internal %s scope or public %s prefix',
				color.projectName(`@${projectName}`),
				color.projectName(projectName),
			);

			// Detect internal scopes before public ones
			resolver.lookupNodeModule(this.registry.formatModuleName(moduleName, true));
			resolver.lookupNodeModule(this.registry.formatModuleName(moduleName));

			// Unknown plugin module pattern
		} else {
			throw new PluginError('MODULE_UNKNOWN_FORMAT', [moduleName]);
		}

		debug('Loading plugins from: %s', resolver.getLookupPaths().join(', '));

		return resolver;
	}

	/**
	 * Load a plugin by short name or fully qualified module name, or file path,
	 * and with an optional options object.
	 */
	async load(source: Source, options: object = {}): Promise<Plugin> {
		const { originalPath, resolvedPath } = this.createResolver(source).resolve();

		this.debug('Loading %s from %s', color.moduleName(source), color.filePath(resolvedPath));

		const factory: Factory<Plugin> = requireModule(resolvedPath);

		if (typeof factory !== 'function') {
			throw new PluginError('FACTORY_REQUIRED', [typeof factory]);
		}

		const plugin = await factory(options);

		if (isObject(plugin) && !plugin.name) {
			// @ts-expect-error Allow this
			plugin.name = originalPath.path();
		}

		return plugin;
	}
}
