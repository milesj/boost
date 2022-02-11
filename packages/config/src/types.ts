import { ModuleResolver, PackageStructure, Path } from '@boost/common';
import { DeepPartial } from '@boost/common/optimal';

export type ExtType = 'cjs' | 'js' | 'json' | 'json5' | 'mjs' | 'ts' | 'yaml' | 'yml';

export type LoaderType = Exclude<ExtType, 'yml'>;

export type Loader<T> = (path: Path, pkg: PackageStructure) => Promise<DeepPartial<T>>;

export type Handler<T> = (prev: T, next: T) => Promise<T | undefined> | T | undefined;

export type FileType = 'branch' | 'preset' | 'root-file' | 'root-folder';

export type FileSource = 'branch' | 'extended' | 'overridden' | 'root';

export interface File {
	/** Absolute path of the file. */
	path: Path;
	/** The source where the file originated. */
	source: FileSource;
}

export interface ConfigFile<T> extends File {
	/** Config content of the file. */
	config: DeepPartial<T>;
}

export interface IgnoreFile extends File {
	/** Ignored content of the file, split on new lines. */
	ignore: string[];
}

export interface ProcessedConfig<T> {
	/** All found and loaded config file contents merged and processed into a
  single config object. */
	config: Required<T>;
	/** List of config files found and loaded. */
	files: ConfigFile<T>[];
}

export interface BaseFinderOptions {
	/** Name of files, without extension. */
	name: string;
	/** Throw an error if the root config cannot be located. */
	errorIfNoRootFound?: boolean;
}

export interface ConfigFinderOptions<T> extends BaseFinderOptions {
	/** Name of the setting in which "config extending" is enabled. */
	extendsSetting?: string;
	/** List of extensions, in order, to find config files within each folder. Defaults to built-in file format list. */
	extensions?: ExtType[];
	/** Find and load environment based config files (using `NODE_ENV`). Defaults to `true`. */
	includeEnv?: boolean;
	/** Mapping of loader functions by type. Defaults to built-in file type loaders. */
	loaders?: { [K in LoaderType]: Loader<T> };
	/** Name of the setting in which "config overriding" is enabled. */
	overridesSetting?: string;
	/** Custom module resolver. */
	resolver?: ModuleResolver;
}

export interface IgnoreFinderOptions extends BaseFinderOptions {}

export interface ProcessorOptions {
	/**
	 * When a setting has a value of `undefined`, fallback to the
	 * default/initial value for that setting. Defaults to `true`.
	 */
	defaultWhenUndefined?: boolean;
	/** Name of config files, without extension. */
	name: string;
	/** Validate all settings within a config file before processing. Defaults to
  `true`. */
	validate?: boolean;
}

export type FileGlob = string[] | string;

export type ExtendsSetting = string[] | string;

export interface OverridesSettingItem<T> {
	/** File path patterns/globs to ignore. */
	exclude?: FileGlob;
	/** File path patterns/globs to match against. */
	include: FileGlob;
	/** Settings configured for this specific override. */
	settings: DeepPartial<T>;
}

export type OverridesSetting<T> = OverridesSettingItem<T>[];

// PLUGINS

export type PluginOptions = boolean | object;

export type PluginEntry = string | [string, PluginOptions];

export type PluginsSettingMap = Record<string, PluginOptions>;

export type PluginsSettingList = PluginEntry[];

export type PluginsSetting = PluginsSettingList | PluginsSettingMap;
