import { Path, PackageStructure } from '@boost/common';

export type ExtType = 'js' | 'cjs' | 'mjs' | 'json' | 'yaml' | 'yml';

export type LoaderType = Exclude<ExtType, 'yml'>;

export type Loader<T> = (path: Path, pkg: PackageStructure) => Promise<Partial<T>>;

export type Handler<T> = (prev: T, next: T) => T | undefined | Promise<T | undefined>;

export interface ConfigFile<T> {
  config: Partial<T>;
  path: Path;
}

export interface IgnoreFile {
  ignore: string[];
  path: Path;
}

export interface ProcessedConfig<T> {
  config: Required<T>;
  files: ConfigFile<T>[];
}

export interface FinderOptions<T> {
  extendsSetting?: string;
  extensions?: ExtType[];
  includeEnv?: boolean;
  loaders?: { [K in LoaderType]: Loader<T> };
  name: string;
  overridesSetting?: string;
}

export type FileGlob = string | string[];

export type ExtendsSetting = string | string[];

export interface OverridesSetting<T> {
  exclude?: FileGlob;
  include: FileGlob;
  settings: Partial<T>;
}

export interface PluginsSetting {
  [name: string]: boolean | object;
}
