import { FilePath, ModuleName, ModuleResolver } from '@boost/common';

export type Source = FilePath | ModuleName;

export type SourceOptions = boolean | object;

export type SourceWithOptions = [Source, SourceOptions];

export type Callback<T = unknown> = (value: T) => Promise<void> | void;

// Easier for consumers to type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Pluggable<T = any> {
	/** Unique name of the plugin. Typically the npm package name. */
	readonly name: ModuleName;
	/** Priority in which to order the plugin. */
	priority?: number;
	/** Life cycle called when the plugin is unregistered. */
	shutdown?: Callback<T>;
	/** Life cycle called when the plugin is registered. */
	startup?: Callback<T>;
}

export type Setting = Record<string, SourceOptions>;

export type Factory<T extends Pluggable, O extends object = object> = (
	options: Partial<O>,
) => Promise<T> | T;

export interface RegisterOptions<T = unknown> {
	/** Override the priority of the plugin. */
	priority?: number;
	/** Custom tool instance to pass to life cycles. */
	tool?: T;
}

export interface Registration<T extends Pluggable> extends RegisterOptions {
	/** Unique name of the plugin. */
	name: ModuleName;
	/** Plugin instance or object. */
	plugin: T;
}

export interface RegistryOptions<T extends Pluggable> {
	/** Callback fired after a plugin's `shutdown` life cycle is executed. */
	afterShutdown?: Callback<T> | null;
	/** Callback fired after a plugin's `startup` life cycle is executed. */
	afterStartup?: Callback<T> | null;
	/** Callback fired before a plugin's `shutdown` life cycle is executed. */
	beforeShutdown?: Callback<T> | null;
	/** Callback fired before a plugin's `startup` life cycle is executed. */
	beforeStartup?: Callback<T> | null;
	/** Custom module resolver instead of `require.resolve`. */
	resolver?: ModuleResolver;
	/** Validate the shape of the plugin being registered. */
	validate: Callback<T>;
}
