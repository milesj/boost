import { Blueprint, Predicates } from 'optimal';
import { AbstractConstructor, PortablePath } from '@boost/common';
import ModuleLoader from './ModuleLoader';

export { Blueprint, Predicates };

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
  author?: string | PeopleSetting;
  bin?: any;
  browser?: string;
  browserslist?: string[];
  bugs?: string | BugSetting;
  bundledDependencies?: string[];
  config?: SettingMap;
  contributors?: string[] | PeopleSetting[];
  cpu?: string[];
  dependencies?: DependencyMap;
  description?: string;
  devDependencies?: DependencyMap;
  engines?: SettingMap;
  exports?: { [path: string]: string | string[] | SettingMap };
  files?: string[];
  homepage?: string;
  keywords?: string[];
  license?: string | TypeSetting | TypeSetting[];
  main?: string;
  man?: string | string[];
  name: string;
  optionalDependencies?: DependencyMap;
  os?: string[];
  peerDependencies?: DependencyMap;
  private?: boolean;
  publishConfig?: {
    access?: 'public' | 'restricted';
    registry?: string;
    tag?: string;
  };
  repository?: string | TypeSetting;
  scripts?: SettingMap;
  type?: 'commonjs' | 'module';
  version: string;
  // TypeScript
  types?: string;
  typesVersions?: {
    [version: string]: {
      [glob: string]: string[];
    };
  };
  typings?: string;
  // Webpack
  module?: string;
  sideEffects?: boolean | string[];
  // Yarn
  workspaces?:
    | string[]
    | {
        packages?: string[];
        nohoist?: string[];
      };
}

export interface WorkspacePackageConfig extends PackageConfig {
  workspace: WorkspaceMetadata;
}

export interface WorkspaceOptions {
  relative?: boolean;
  root?: PortablePath;
}
