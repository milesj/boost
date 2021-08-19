export type TS = typeof import('typescript');

export interface ModuleLike {
	[named: string]: unknown;
	default?: unknown;
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
