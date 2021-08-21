/** Shape of the `typescript` module. */
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

export type LoaderResolve = (
	specifier: string,
	context: ResolveContext,
	defaultResolve: LoaderResolve,
) => Promise<ResolveResult>;

export type GetFormatContext = Record<string, unknown>;

export interface GetFormatResult {
	format: string;
}

export type LoaderGetFormat = (
	url: string,
	context: GetFormatContext,
	defaultGetFormat: LoaderGetFormat,
) => Promise<GetFormatResult>;

export interface TransformSourceContext {
	format: string;
	url: string;
}

export interface TransformSourceResult {
	source: string;
}

export type LoaderTransformSource = (
	source: SharedArrayBuffer | Uint8Array | string,
	context: TransformSourceContext,
	defaultTransformSource: LoaderTransformSource,
) => Promise<TransformSourceResult>;
