export interface Pluggable<T = unknown> {
  shutdown?: () => void;
  startup?: (tool: T) => void;
}

export interface ExplicitPlugin {
  name: string;
  priority?: number;
}

export type Callback<T> = (plugin: T) => void;

export interface ManagerOptions<T extends Pluggable> {
  afterShutdown?: Callback<T>;
  afterStartup?: Callback<T>;
  beforeShutdown?: Callback<T>;
  beforeStartup?: Callback<T>;
  validate: Callback<T>;
}

export type Setting<T extends Pluggable> =
  | string
  | [string, object, number?]
  | (T & ExplicitPlugin);

export type Factory<T extends Pluggable, O extends object = object> = (options: Partial<O>) => T;

export interface LoadResult<T extends Pluggable> {
  name: string;
  plugin: T;
  priority: number;
}
