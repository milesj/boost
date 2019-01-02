/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable typescript/no-empty-interface */

import debug from 'debug';
import i18next from 'i18next';

export interface Debugger extends debug.IDebugger {
  (message: any, ...args: any[]): void;
  invariant(condition: boolean, message: string, pass: string, fail: string): void;
}

export interface Translator extends i18next.i18n {}

export type PluginSetting<P> = (string | { [key: string]: any } | P)[];

export type Status = 'pending' | 'running' | 'skipped' | 'passed' | 'failed';

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

export type SettingMap = { [key: string]: string };

export type DependencyMap = { [module: string]: string };

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
  module?: string; // Webpack
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
  // Other custom fields
  [key: string]: any;
}

export interface WorkspacePackageConfig extends PackageConfig {
  workspace: WorkspaceMetadata;
}
