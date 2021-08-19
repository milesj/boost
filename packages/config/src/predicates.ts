import { Blueprint, Predicates, predicates } from '@boost/common';
import {
	ExtendsSetting,
	FileGlob,
	OverridesSettingItem,
	PluginOptions,
	PluginsSetting,
} from './types';

/**
 * Create an `optimal` predicate for validating the structure of an "extends" setting.
 */
export function createExtendsPredicate(preds: Predicates = predicates) {
	const { array, string, union } = preds;

	return union<ExtendsSetting>([string().notEmpty(), array(string().notEmpty())], []).notNullable();
}

/**
 * Create an `optimal` predicate for validating the structure of a "plugins" setting.
 */
export function createPluginsPredicate(preds: Predicates = predicates) {
	const { array, bool, object, string, tuple, union } = preds;
	const pluginOptions = union<PluginOptions>([bool(), object()], {});
	const pluginSource = string().notEmpty();
	const pluginEntry = tuple<[string, PluginOptions]>([pluginSource, pluginOptions]);

	return union<PluginsSetting>(
		[array(union([pluginSource, pluginEntry], '')), object(pluginOptions).notNullable()],
		{},
	);
}

/**
 * Create an `optimal` predicate for validating the structure of an "overrides" setting.
 */
export function createOverridesPredicate<T extends object>(
	blueprint: Blueprint<T>,
	preds: Predicates = predicates,
) {
	const { array, shape, string, union } = preds;

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
