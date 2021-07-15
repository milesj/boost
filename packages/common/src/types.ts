import { Blueprint, Predicates } from 'optimal';
import type { Path } from './Path';

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

export type ModuleResolver = (path: ModuleName) => FilePath;

// CLASSES

export type AbstractConstructor<T> = Function & { prototype: T };

export type ConcreteConstructor<T> = new (...args: unknown[]) => T;

export type Constructor<T> = AbstractConstructor<T> | ConcreteConstructor<T>;

// INTERFACES

export type BlueprintFactory<T extends object> = (
	predicates: Predicates,
	onConstruction?: boolean,
) => Blueprint<T>;

export interface Optionable<T extends object = {}> {
	readonly options: Required<T>;

	blueprint: BlueprintFactory<object>;
}

export interface Toolable {
	name: string;
}

// PACKAGES

export type SettingMap<T extends string = string> = Record<T, string>;

export type ConfigSetting = Record<string, boolean | number | string | null>;

export interface BugSetting {
	url?: string;
	email?: string;
}

export type DependencyMap = SettingMap;

export interface DependencyMetaSetting {
	built?: boolean;
	optional?: boolean;
	unplugged?: boolean;
}

export interface TypeSetting {
	type: string;
	url: string;
}

export interface PeerDependencyMetaSetting {
	optional?: boolean;
}

export interface PeopleSetting {
	name: string;
	email?: string;
	url?: string;
}

export interface RepositorySetting extends TypeSetting {
	directory?: string;
}

export interface PackageStructure {
	author?: PeopleSetting | string;
	bin?: SettingMap | string;
	browser?: string;
	browserslist?: string[];
	bugs?: BugSetting | string;
	bundledDependencies?: string[];
	config?: ConfigSetting;
	contributors?: PeopleSetting[] | string[];
	cpu?: string[];
	dependencies?: DependencyMap;
	dependenciesMeta?: Record<string, DependencyMetaSetting>;
	description?: string;
	devDependencies?: DependencyMap;
	directories?: SettingMap<'bin' | 'doc' | 'example' | 'lib' | 'man' | 'test'>;
	engines?: SettingMap;
	exports?: Record<string, SettingMap | string[] | string> | string;
	files?: string[];
	funding?: (TypeSetting | string)[] | TypeSetting | string;
	homepage?: string;
	imports?: Record<string, SettingMap>;
	keywords?: string[];
	license?: TypeSetting | TypeSetting[] | string;
	main?: string;
	man?: string[] | string;
	name: string;
	optionalDependencies?: DependencyMap;
	os?: string[];
	peerDependencies?: DependencyMap;
	peerDependenciesMeta?: Record<string, PeerDependencyMetaSetting>;
	private?: boolean;
	publishConfig?: ConfigSetting;
	repository?: RepositorySetting | string;
	scripts?: SettingMap;
	type?: 'commonjs' | 'module';
	version: string;
	// TypeScript
	types?: string;
	typesVersions?: Record<string, Record<string, string[]>>;
	typings?: string;
	// Webpack
	module?: string;
	sideEffects?: string[] | boolean;
	// Yarn
	installConfig?: {
		hoistingLimits?: boolean;
	};
	languageName?: string;
	preferUnplugged?: boolean;
	resolutions?: DependencyMap;
	workspaces?:
		| string[]
		| {
				packages?: string[];
				nohoist?: string[];
		  };
}

export interface PackageGraphTreeNode<T extends PackageStructure> {
	nodes?: PackageGraphTreeNode<T>[];
	package: T;
}

export interface PackageGraphTree<T extends PackageStructure> {
	nodes: PackageGraphTreeNode<T>[];
	root: boolean;
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
