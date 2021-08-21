export type TS = typeof import('typescript');

export type InferDefaultOrNamed<D, N extends object> = D extends void ? N : D;

export type ModuleLike<D = unknown, N extends object = {}> = N & {
	default: InferDefaultOrNamed<D, N>;
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
