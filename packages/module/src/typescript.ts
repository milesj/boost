/* eslint-disable no-magic-numbers */

import { TS } from './types';

export const COMPILER_OPTIONS = {
	allowJs: true,
	allowSyntheticDefaultImports: true,
	esModuleInterop: true,
	noEmit: true,
};

export const NODE_VERSION = Number.parseFloat(process.version.slice(1));

export function isNodeNext(path: string) {
	return path.endsWith('.cts') || path.endsWith('.mts');
}

export function isTypeScript(path: string) {
	return path.endsWith('.ts') || path.endsWith('.tsx') || isNodeNext(path);
}

export function getModuleFormat(url: string) {
	if (url.endsWith('.json')) {
		return 'json';
	}

	return NODE_VERSION >= 12 ? 'module' : 'commonjs';
}

export function getModuleFromNodeVersion(ts: TS, nodeNext: boolean) {
	if (nodeNext) {
		return ts.ModuleKind.NodeNext;
	}

	if (NODE_VERSION >= 18) {
		return ts.ModuleKind.ES2022;
	}

	if (NODE_VERSION >= 16) {
		return ts.ModuleKind.ES2020;
	}

	if (NODE_VERSION >= 12) {
		return ts.ModuleKind.ES2015;
	}

	return ts.ModuleKind.CommonJS;
}

export function getTargetFromNodeVersion(ts: TS) {
	if (NODE_VERSION >= 18) {
		return ts.ScriptTarget.ES2022;
	}

	if (NODE_VERSION >= 17) {
		return ts.ScriptTarget.ES2021;
	}

	if (NODE_VERSION >= 16) {
		return ts.ScriptTarget.ES2020;
	}

	if (NODE_VERSION >= 15) {
		return ts.ScriptTarget.ES2019;
	}

	if (NODE_VERSION >= 14) {
		return ts.ScriptTarget.ES2018;
	}

	if (NODE_VERSION >= 13) {
		return ts.ScriptTarget.ES2017;
	}

	if (NODE_VERSION >= 12) {
		return ts.ScriptTarget.ES2016;
	}

	return ts.ScriptTarget.ES5;
}
