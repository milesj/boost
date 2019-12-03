import { ModuleName } from '@boost/common';

export interface Pluggable<T = unknown> {
  name: ModuleName;
  priority?: number;
  shutdown?: (tool: T) => void;
  startup?: (tool: T) => void;
}

export type Setting<T extends Pluggable> = ModuleName | [ModuleName, object, number?] | T;

export type Factory<T extends Pluggable, O extends object = object> = (options: Partial<O>) => T;

export interface PluginOptions {
  priority?: number;
}

export interface Container<T extends Pluggable> extends PluginOptions {
  name: ModuleName;
  plugin: T;
}

export type Callback<T> = (plugin: T) => void;

export interface ManagerOptions<T extends Pluggable> {
  afterShutdown?: Callback<T> | null;
  afterStartup?: Callback<T> | null;
  beforeShutdown?: Callback<T> | null;
  beforeStartup?: Callback<T> | null;
  validate: Callback<T>;
}
