/* eslint-disable @typescript-eslint/no-empty-interface */

import debug from 'debug';
import i18next from 'i18next';
import { Blueprint, Predicates } from 'optimal';
import ModuleLoader from './ModuleLoader';

export { Blueprint, Predicates };

export type Constructor<T> = new (...args: any[]) => T;

export type AbstractConstructor<T> = Function & { prototype: T };

export interface Debugger extends debug.IDebugger {
  (message: any, ...args: any[]): void;
  invariant(condition: boolean, message: string, pass: string, fail: string): void;
}

export interface Translator extends i18next.i18n {}

// PLUGINS

export interface PluginType<T> {
  afterBootstrap: ((plugin: T) => void) | null;
  beforeBootstrap: ((plugin: T) => void) | null;
  contract: AbstractConstructor<T>;
  loader: ModuleLoader<T>;
  pluralName: string;
  scopes: string[];
  singularName: string;
}

export type PluginSetting<P> = (string | { [key: string]: any } | P)[];

// CONSOLE

export type Status = 'pending' | 'running' | 'skipped' | 'passed' | 'failed';

export type OutputLevel = 1 | 2 | 3;

// THEME

export type Color =
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'gray';

export type ColorType = 'default' | 'failure' | 'pending' | 'success' | 'warning';

export type ColorPalette = { [T in ColorType]: Color | string };

// PACKAGE

export interface BugSetting {
  url?: string;
  email?: string;
}

export interface TypeSetting {
  type: string;
  url: string;
}

export interface PeopleSetting {
  name: string;
  email?: string;
  url?: string;
}

export interface SettingMap {
  [key: string]: string;
}

export interface DependencyMap {
  [module: string]: string;
}

export interface WorkspaceMetadata {
  jsonPath: string;
  packagePath: string;
  packageName: string;
  workspacePath: string;
  workspaceName: string;
}

export interface PackageConfig {
  name: string;
  version: string;
  description?: string;
  keywords?: string[];
  homepage?: string;
  bugs?: string | BugSetting;
  license?: string | TypeSetting | TypeSetting[];
  author?: string | PeopleSetting;
  contributors?: string[] | PeopleSetting[];
  files?: string[];
  main?: string;
  browser?: string;
  bin?: any;
  man?: string | string[];
  repository?: string | TypeSetting;
  scripts?: SettingMap;
  config?: SettingMap;
  dependencies?: DependencyMap;
  devDependencies?: DependencyMap;
  peerDependencies?: DependencyMap;
  bundledDependencies?: string[];
  optionalDependencies?: DependencyMap;
  engines?: SettingMap;
  os?: string[];
  cpu?: string[];
  private?: boolean;
  publishConfig?: SettingMap;
  // Webpack
  module?: string;
  sideEffects?: boolean | string[];
}

export interface WorkspacePackageConfig extends PackageConfig {
  workspace: WorkspaceMetadata;
}

export interface WorkspaceOptions {
  relative?: boolean;
  root?: string;
}
