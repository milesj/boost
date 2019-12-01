export interface Pluggable<T = unknown> {
  bootstrap(tool: T): void;
}

export interface PluginType<T extends Pluggable> {
  afterBootstrap?: (plugin: T) => void;
  beforeBootstrap?: (plugin: T) => void;
  pluralName: string;
  singularName: string;
  validate: (plugin: T) => void;
}

export type PluginSetting<T extends Pluggable> = string | { [key: string]: unknown } | T;
