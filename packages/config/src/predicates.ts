import { predicates, Blueprint, Predicates } from '@boost/common';
import {
  ExtendsSetting,
  PluginsSetting,
  PluginsSettingMapItem,
  OverridesSettingItem,
  FileGlob,
} from './types';

export function createExtendsPredicate(preds: Predicates = predicates) {
  const { array, string, union } = preds;

  return union<ExtendsSetting>([string().notEmpty(), array(string().notEmpty())], []).notNullable();
}

export function createPluginsPredicate(preds: Predicates = predicates) {
  const { array, bool, object, string, union } = preds;

  return union<PluginsSetting>(
    [
      array(string().notEmpty()),
      object(union<PluginsSettingMapItem>([bool(), object().notNullable()], {})).notNullable(),
    ],
    {},
  );
}

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
