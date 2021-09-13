import { Blueprint, Schemas, schemas } from '@boost/common';
import {
	ExtendsSetting,
	FileGlob,
	OverridesSettingItem,
	PluginOptions,
	PluginsSetting,
} from './types';

/**
 * Create an `optimal` schema for validating the structure of an "extends" setting.
 */
export function createExtendsSchema(schemes: Schemas = schemas) {
	const { array, string, union } = schemes;

	return union<ExtendsSetting>([string().notEmpty(), array(string().notEmpty())], []).notNullable();
}

/**
 * Create an `optimal` schema for validating the structure of a "plugins" setting.
 */
export function createPluginsSchema(schemes: Schemas = schemas) {
	const { array, bool, object, string, tuple, union } = schemes;
	const pluginOptions = union<PluginOptions>([bool(), object()], {});
	const pluginSource = string().notEmpty();
	const pluginEntry = tuple<[string, PluginOptions]>([pluginSource, pluginOptions]);

	return union<PluginsSetting>(
		[array(union([pluginSource, pluginEntry], '')), object(pluginOptions).notNullable()],
		{},
	);
}

/**
 * Create an `optimal` schema for validating the structure of an "overrides" setting.
 */
export function createOverridesSchema<T extends object>(
	blueprint: Blueprint<T>,
	schemes: Schemas = schemas,
) {
	const { array, shape, string, union } = schemes;

	return array<OverridesSettingItem<T>>(
		shape({
			exclude: union<FileGlob>([string().notEmpty(), array(string().notEmpty())], []),
			include: union<FileGlob>([string().notEmpty(), array(string().notEmpty())], []),
			settings: shape(blueprint).notNullable(),
		})
			.exact()
			.notNullable(),
	).notNullable();
}
