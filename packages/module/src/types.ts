export type TS = typeof import('typescript');

export interface ModuleLike<T = unknown> {
	[named: string]: unknown;
	default: T;
	__esModule?: boolean;
}

export type PathLike = string | { toString: () => string };

declare global {
	namespace NodeJS {
		interface Module {
			_compile: (code: string, file: string) => unknown;
		}
	}
}
