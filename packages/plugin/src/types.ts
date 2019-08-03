import { AbstractConstructor, Optionable, Path } from '@boost/common';

export interface Pluggable<T extends object> extends Optionable<T> {
  // Name of the plugin
  name?: string;

  // Priority in which to sort and run the plugin
  priority?: number;

  // Name of the module/package it was required from,
  // or the absolute file path it was loaded from.
  source?: string;
}

export interface PluginType<T> {
  afterBootstrap: ((plugin: T) => void) | null;
  beforeBootstrap: ((plugin: T) => void) | null;
  declaration: AbstractConstructor<T> | null;
  pluralName: string;
  singularName: string;
}

export type PluginSetting<T> = string | { [key: string]: unknown } | T;

export enum LookupType {
  FILE_PATH,
  NODE_MODULE,
}

export type Lookup =
  | { type: LookupType.FILE_PATH; path: Path }
  | { type: LookupType.NODE_MODULE; name: string };
