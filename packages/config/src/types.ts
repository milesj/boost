import { PackageStructure, Path } from '@boost/common';

export type ExtType = 'cjs' | 'js' | 'json' | 'json5' | 'mjs' | 'ts' | 'yaml' | 'yml';

export type LoaderType = Exclude<ExtType, 'yml'>;

export type Loader<T> = (path: Path, pkg: PackageStructure) => Promise<Partial<T>>;

export type Handler<T> = (prev: T, next: T) => Promise<T | undefined> | T | undefined;

export type FileSource = 'branch' | 'extended' | 'overridden' | 'root';

export interface File {
  path: Path;
  source: FileSource;
}

export interface ConfigFile<T> extends File {
  config: Partial<T>;
}

export interface IgnoreFile extends File {
  ignore: string[];
}

export interface ProcessedConfig<T> {
  config: Required<T>;
  files: ConfigFile<T>[];
}

export interface ConfigFinderOptions<T> {
  extendsSetting?: string;
  extensions?: ExtType[];
  includeEnv?: boolean;
  loaders?: { [K in LoaderType]: Loader<T> };
  name: string;
  overridesSetting?: string;
}

export interface IgnoreFinderOptions {
  name: string;
}

export interface ProcessorOptions {
  defaultWhenUndefined?: boolean;
  name: string;
  validate?: boolean;
}

export type FileGlob = string[] | string;

export type ExtendsSetting = string[] | string;

export interface OverridesSettingItem<T> {
  exclude?: FileGlob;
  include: FileGlob;
  settings: Partial<T>;
}

export type OverridesSetting<T> = OverridesSettingItem<T>[];

// PLUGINS

export type PluginOptions = boolean | object;

export type PluginEntry = string | [string, PluginOptions];

export type PluginsSettingMap = Record<string, PluginOptions>;

export type PluginsSettingList = PluginEntry[];

export type PluginsSetting = PluginsSettingList | PluginsSettingMap;
