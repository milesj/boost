import { predicates, Blueprint } from '@boost/common';
import { ExtendsSetting, PluginsSettingItem } from './types';

const { array, bool, object, string, union } = predicates;

export function createExtendsPredicate() {
  return union<ExtendsSetting>([string().notEmpty(), array(string().notEmpty())], []);
}

export function createPluginsPredicate() {
  return object(union<PluginsSettingItem>([bool(), object().notNullable()], {}));
}

export function createOverridesPredicate<T extends object>(blueprint: () => Blueprint<T>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return array<any>();

  // TODO Currently not working!
  // return array<OverridesSettingItem<T>>(
  //   shape({
  //     exclude: union<FileGlob>([string().notEmpty(), array(string().notEmpty())], []),
  //     include: union<FileGlob>([string().notEmpty(), array(string().notEmpty())], []),
  //     settings: shape(blueprint()).notNullable(),
  //   })
  //     .exact()
  //     .notNullable(),
  // ).notNullable();
}
