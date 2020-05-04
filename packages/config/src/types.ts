import { Path } from '@boost/common';

export type ExtType = 'js' | 'json' | 'json5' | 'yml' | 'yaml';

export type Loader<T> = (path: Path) => Promise<Partial<T>>;

export interface FinderOptions<T> {
  env?: boolean;
  exts?: ExtType[];
  loaders?: { [K in ExtType]: Loader<T> };
  name: string;
}
