/* eslint-disable no-magic-numbers */

import type { ModuleFormat } from 'node:module';
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

export function getModuleFormat(url: string): ModuleFormat {
	if (url.endsWith('.json')) {
		return 'json';
	}

	return 'module';
}

export function getModuleFromNodeVersion(ts: TS, nodeNext: boolean) {
	if (nodeNext) {
		return ts.ModuleKind.NodeNext;
	}

	if (NODE_VERSION >= 20) {
		return ts.ModuleKind.ESNext;
	}

	if (NODE_VERSION >= 18) {
		return ts.ModuleKind.ES2022;
	}

	return ts.ModuleKind.ES2020;
}

export function getTargetFromNodeVersion(ts: TS) {
	if (NODE_VERSION >= 20) {
		return ts.ScriptTarget.ESNext;
	}

	if (NODE_VERSION >= 18) {
		return ts.ScriptTarget.ES2022;
	}

	if (NODE_VERSION >= 17) {
		return ts.ScriptTarget.ES2021;
	}

	return ts.ScriptTarget.ES2020;
}
