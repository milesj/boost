import { Path } from '@boost/common';

export type ExtType = 'js' | 'json' | 'yaml' | 'yml';

export type LoaderType = Exclude<ExtType, 'yml'>;

export type Loader<T> = (path: Path) => Promise<Partial<T>>;

export interface LoadedConfig<T> {
  config: Partial<T>;
  path: Path;
}

export interface FinderOptions<T> {
  env?: boolean;
  exts?: ExtType[];
  loaders?: { [K in LoaderType]: Loader<T> };
  name: string;
}
