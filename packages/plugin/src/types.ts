import { FilePath, ModuleName } from '@boost/common';

export type Source = FilePath | ModuleName;

export type SourceOptions = boolean | object;

export type SourceWithOptions = [Source, SourceOptions];

export type Callback<T = unknown> = (value: T) => Promise<void> | void;

// Easier for consumers to type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Pluggable<T = any> {
  readonly name: ModuleName;
  priority?: number;
  shutdown?: Callback<T>;
  startup?: Callback<T>;
}

export type Setting = Record<string, SourceOptions>;

export type Factory<T extends Pluggable, O extends object = object> = (
  options: Partial<O>,
) => Promise<T> | T;

export interface RegisterOptions<T = unknown> {
  priority?: number;
  tool?: T;
}

export interface Registration<T extends Pluggable> extends RegisterOptions {
  name: ModuleName;
  plugin: T;
}

export interface RegistryOptions<T extends Pluggable> {
  afterShutdown?: Callback<T> | null;
  afterStartup?: Callback<T> | null;
  beforeShutdown?: Callback<T> | null;
  beforeStartup?: Callback<T> | null;
  validate: Callback<T>;
}
