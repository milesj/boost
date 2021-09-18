import { Blueprint, Schemas, schemas } from '@boost/common/optimal';
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

	return union<ExtendsSetting>([])
		.of([string().notEmpty(), array().of(string().notEmpty())])
		.notNullable();
}

/**
 * Create an `optimal` schema for validating the structure of a "plugins" setting.
 */
export function createPluginsSchema(schemes: Schemas = schemas) {
	const { array, bool, object, string, tuple, union } = schemes;
	const pluginOptions = union<PluginOptions>({}).of([bool(), object()]);
	const pluginSource = string().notEmpty();
	const pluginEntry = tuple<[string, PluginOptions]>([pluginSource, pluginOptions]);

	return union<PluginsSetting>({}).of([
		array().of(union('').of([pluginSource, pluginEntry])),
		object(pluginOptions).notNullable(),
	]);
}

/**
 * Create an `optimal` schema for validating the structure of an "overrides" setting.
 */
export function createOverridesSchema<T extends object>(
	blueprint: Blueprint<T>,
	schemes: Schemas = schemas,
) {
	const { array, shape, string, union } = schemes;

	return array<OverridesSettingItem<T>>()
		.of(
			shape({
				exclude: union<FileGlob>([]).of([string().notEmpty(), array().of(string().notEmpty())]),
				include: union<FileGlob>([]).of([string().notEmpty(), array().of(string().notEmpty())]),
				settings: shape(blueprint).notNullable(),
			})
				.exact()
				.notNullable(),
		)
		.notNullable();
}
