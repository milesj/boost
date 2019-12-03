export type ModuleName = string;

export interface Pluggable<T = unknown> {
  name: string;
  priority?: number;
  shutdown?: (tool: T) => void;
  startup?: (tool: T) => void;
}

export type Callback<T> = (plugin: T) => void;

export interface ManagerOptions<T extends Pluggable> {
  afterShutdown?: Callback<T> | null;
  afterStartup?: Callback<T> | null;
  beforeShutdown?: Callback<T> | null;
  beforeStartup?: Callback<T> | null;
  validate: Callback<T>;
}

export type Setting<T extends Pluggable> = string | [string, object, number?] | T;

export type Factory<T extends Pluggable, O extends object = object> = (options: Partial<O>) => T;

export interface Certificate<T extends Pluggable> {
  name: string;
  plugin: T;
  priority: number;
}
