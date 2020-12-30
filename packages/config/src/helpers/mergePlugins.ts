import { isObject } from '@boost/common';
import { PluginsSetting, PluginsSettingList, PluginsSettingMap } from '../types';
import mergeObject from './mergeObject';

function convertListToMap(list: PluginsSettingList): PluginsSettingMap {
  return list.reduce(
    (map, name) => ({
      ...map,
      [name]: true,
    }),
    {},
  );
}

export default function mergePlugins(
  prev: PluginsSetting,
  next: PluginsSetting,
): PluginsSettingMap {
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
