import { predicates } from '@boost/common';
import { ExtendsSetting, PluginsSettingOption } from './types';

const { array, bool, object, string, union } = predicates;

export const extendsSetting = union<ExtendsSetting>(
  [string().notEmpty(), array(string().notEmpty())],
  [],
);

export const pluginsSetting = object(union<PluginsSettingOption>([bool(), object()], {}));
