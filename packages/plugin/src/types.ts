import { AbstractConstructor, Optionable } from '@boost/common';

export interface Pluggable<T extends object> extends Optionable<T> {
  // Name of the Node module/package it was loaded from
  moduleName?: string;

  // Name of the plugin
  name?: string;

  // Priority in which to sort and run the plugin
  priority?: number;
}

export interface PluginType<T> {
  afterBootstrap: ((plugin: T) => void) | null;
  beforeBootstrap: ((plugin: T) => void) | null;
  declaration: AbstractConstructor<T>;
  loader: ModuleLoader<T>;
  moduleScopes: string[];
  pluralName: string;
  singularName: string;
}

export type PluginSetting<P> = (string | { [key: string]: object } | P)[];
