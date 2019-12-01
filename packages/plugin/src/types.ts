export interface Pluggable<T = unknown> {
  bootstrap?: (tool: T) => void;
}

export interface ExplicitPlugin {
  name: string;
  priority?: number;
}

export interface PluginType<T extends Pluggable> {
  afterBootstrap?: (plugin: T) => void;
  beforeBootstrap?: (plugin: T) => void;
  pluralName: string;
  singularName: string;
  validate: (plugin: T) => void;
}

export type PluginSetting<T extends Pluggable> =
  | string
  | [string, object, number?]
  | (T & ExplicitPlugin);

export type Factory<T extends Pluggable, O extends object> = (options: Partial<O>) => T;

export interface LoadResult<T extends Pluggable> {
  name: string;
  plugin: T;
  priority: number;
}
