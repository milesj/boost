import { Blueprint, Predicates } from 'optimal';
import Path from './Path';

// NODE

export type ModuleName = string;

// FILE SYSTEM

export type FilePath = string;

export type PortablePath = FilePath | Path;

export enum LookupType {
  FILE_SYSTEM = 'FILE_SYSTEM',
  NODE_MODULE = 'NODE_MODULE',
}

export interface Lookup {
  path: Path;
  raw: Path;
  type: LookupType;
}

// CLASSES

export type AbstractConstructor<T> = Function & { prototype: T };

export type ConcreteConstructor<T> = new (...args: unknown[]) => T;

export type Constructor<T> = AbstractConstructor<T> | ConcreteConstructor<T>;

// INTERFACES

export type BlueprintFactory<T extends object> = (predicates: Predicates) => Blueprint<T>;

export interface Optionable<T extends object = {}> {
  readonly options: Required<T>;

  blueprint: BlueprintFactory<object>;
}

export interface Toolable {
  name: string;
}

// PACKAGES

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

export interface PackageStructure {
  author?: string | PeopleSetting;
  bin?: string | SettingMap;
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
  directories?: SettingMap;
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

// WORKSPACES

export interface WorkspaceMetadata {
  jsonPath: string;
  packagePath: string;
  packageName: string;
  workspacePath: string;
  workspaceName: string;
}

export interface WorkspacePackage<T extends PackageStructure = PackageStructure> {
  metadata: WorkspaceMetadata;
  package: T;
}

// MISC

declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TypedPropertyDescriptor<T> {
    initializer?: Function;
  }
}
