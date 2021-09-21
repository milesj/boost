import type { Blueprint, Schemas } from 'optimal';
import type { Path } from './Path';

// PATHS

export interface Pathable {
	path: () => string;
	toString: () => string;
}

export type PortablePath = FilePath | ModuleID | Pathable;

// NODE MODULES

export type ModuleID = string;

export type ModuleResolver = (id: ModuleID, startDir?: FilePath) => FilePath | Promise<FilePath>;

// FILE SYSTEM

export type FilePath = string;

export type LookupType = 'file-system' | 'node-module';

export interface Lookup {
	path: Pathable;
	raw: Pathable;
	type: LookupType;
}

export interface ResolvedLookup {
	/** Original file path or module ID of the lookup. */
	originalSource: Pathable;
	/** Resolved absolute *file* path for the found lookup. */
	resolvedPath: Path;
	/** The type of lookup that was found. */
	type: LookupType;
}

// CLASSES

export type AbstractConstructor<T> = abstract new (...args: any[]) => T;

export type ConcreteConstructor<T> = new (...args: any[]) => T;

export type Constructor<T> = AbstractConstructor<T> | ConcreteConstructor<T>;

// INTERFACES

export type BlueprintFactory<T extends object> = (
	schemas: Schemas,
	onConstruction?: boolean,
) => Blueprint<T>;

export interface Optionable<T extends object = {}> {
	/** Validated and configured options. */
	readonly options: Readonly<Required<T>>;

	/**
	 * Define an `optimal` blueprint in which to validate and build the
	 * options object passed to the constructor, or when manual setting.
	 */
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

/**
 * Shape of `package.json`, with support for third-party properties
 * like Yarn, Webpack, and TypeScript.
 */
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
	jsonPath: Path;
	packagePath: Path;
	packageName: string;
	workspacePath: Path;
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
