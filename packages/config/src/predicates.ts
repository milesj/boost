import { predicates, Blueprint } from '@boost/common';
import { ExtendsSetting, PluginsSettingItem, OverridesSettingItem, FileGlob } from './types';

const { array, bool, object, shape, string, union } = predicates;

export function createExtendsPredicate() {
  return union<ExtendsSetting>([string().notEmpty(), array(string().notEmpty())], []).notNullable();
}

export function createPluginsPredicate() {
  return object(union<PluginsSettingItem>([bool(), object().notNullable()], {})).notNullable();
}

export function createOverridesPredicate<T extends object>(blueprint: Blueprint<T>) {
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
