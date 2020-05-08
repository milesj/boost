import { isObject } from '@boost/common';
import mergeObject from './mergeObject';
import { PluginsSetting } from '../types';

export default function mergePlugins(prev: PluginsSetting, next: PluginsSetting): PluginsSetting {
  const plugins = { ...prev };

  Object.entries(next).forEach(([name, options]) => {
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
