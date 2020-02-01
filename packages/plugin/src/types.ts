import { ModuleName, FilePath } from '@boost/common';

export type Callback<T = unknown> = (value: T) => void | Promise<void>;

export interface PluginOptions {
  priority?: number;
}

export interface Pluggable<T = unknown> {
  name: ModuleName;
  priority?: number;
  shutdown?: Callback<T>;
  startup?: Callback<T>;
}

export type Setting<T extends Pluggable> =
  | ModuleName
  | FilePath
  | [ModuleName | FilePath, object, PluginOptions?]
  | T;

export type Factory<T extends Pluggable, O extends object = object> = (
  options: Partial<O>,
) => T | Promise<T>;

export interface Registration<T extends Pluggable> extends PluginOptions {
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
