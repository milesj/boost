import { Path } from '@boost/common';

export type ExtType = 'js' | 'json' | 'yaml' | 'yml';

export type LoaderType = Exclude<ExtType, 'yml'>;

export type Loader<T> = (path: Path) => Promise<Partial<T>>;

export type Handler<T> = (prev: T, next: T) => T;

export interface LoadedConfig<T> {
  config: Partial<T>;
  path: Path;
}

export interface ProcessedConfig<T> {
  config: Required<T>;
  files: LoadedConfig<T>[];
}

export interface FinderOptions<T> {
  env?: boolean;
  exts?: ExtType[];
  loaders?: { [K in LoaderType]: Loader<T> };
  name: string;
}

export interface ProcessorOptions {
  extendsSetting?: string;
  overridesSetting?: string;
}

export type ExtendsSetting = string | string[];

export interface PluginsSetting {
  [name: string]: boolean | object;
}
