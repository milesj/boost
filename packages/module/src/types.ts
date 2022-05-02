/** @internal */
export type TS = typeof import('typescript');

/**
 * Return shape of a module. The default export can be typed with
 * the `D` generic slot, and the named exports can be typed with
 * an object in the `N` generic slot.
 *
 * If there is no default export (classic Node.js `exports` pattern),
 * then `void` can be passed to the `D` generic, which will populate
 * the `default` property with the named exports.
 */
export type ModuleLike<D = unknown, N extends object = {}> = N & {
	default: D extends void ? N : D;
	__esModule?: boolean;
};

export type PathLike = string | { toString: () => string };

declare global {
	namespace NodeJS {
		interface Module {
			_compile: (code: string, file: string) => unknown;
		}
	}
}

// LOADERS

export interface ResolveContext {
	conditions: string[];
	parentURL?: string;
}

export interface ResolveResult {
	url: string;
}

export type LoaderDefaultResolve = (
	specifier: string,
	context: ResolveContext,
) => Promise<ResolveResult>;

export type LoaderResolve = (
	specifier: string,
	context: ResolveContext,
	defaultResolve: LoaderDefaultResolve,
) => Promise<ResolveResult>;

export interface LoadContext {
	format: string | null | undefined;
	importAssertions?: object;
}

export interface LoadResult {
	format: string;
	source?: ArrayBuffer | string;
}

export type LoaderDefaultLoad = (url: string, context: LoadContext) => Promise<LoadResult>;

export type LoaderLoad = (
	url: string,
	context: LoadContext,
	defaultLoad: LoaderDefaultLoad,
) => Promise<LoadResult>;
