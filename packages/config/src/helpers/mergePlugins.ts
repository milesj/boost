import { isObject } from '@boost/common';
import { PluginsSetting, PluginsSettingList, PluginsSettingMap } from '../types';
import { mergeObject } from './mergeObject';

function convertListToMap(list: PluginsSettingList): PluginsSettingMap {
	return Object.fromEntries(
		list.map((entry) => {
			const [name, options = true] = Array.isArray(entry) ? entry : [entry];

			return [name, options];
		}),
	);
}

/**
 * Merges previous and next plugin configurations into an object.
 * Plugin configs can either be a list of sources, or list of sources
 * with flags/options (tuples), or a map of sources to flags/options.
 * This is useful if utilizing the `@boost/plugin` package.
 */
export function mergePlugins(prev: PluginsSetting, next: PluginsSetting): PluginsSettingMap {
	const plugins = Array.isArray(prev) ? convertListToMap(prev) : { ...prev };

	Object.entries(Array.isArray(next) ? convertListToMap(next) : next).forEach(([name, options]) => {
		if (isObject(options)) {
			plugins[name] = isObject(plugins[name])
				? mergeObject(plugins[name] as object, options)
				: options;
		} else if (options !== undefined) {
			plugins[name] = options;
		}
	});

	return plugins;
}
