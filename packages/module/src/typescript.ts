/* eslint-disable no-magic-numbers */

import { TS } from './types';

export const COMPILER_OPTIONS = {
	allowJs: true,
	allowSyntheticDefaultImports: true,
	esModuleInterop: true,
	noEmit: true,
};

export function isTypeScript(path: string) {
	return path.endsWith('.ts') || path.endsWith('.tsx');
}

export function getModuleFromNodeVersion(ts: TS) {
	const version = Number.parseFloat(process.version);

	if (version >= 15) {
		return ts.ModuleKind.ES2020;
	}

	if (version >= 12) {
		return ts.ModuleKind.ES2015;
	}

	return ts.ModuleKind.CommonJS;
}

export function getTargetFromNodeVersion(ts: TS) {
	const version = Number.parseFloat(process.version);

	if (version >= 16) {
		return ts.ScriptTarget.ES2020;
	}

	if (version >= 15) {
		return ts.ScriptTarget.ES2019;
	}

	if (version >= 14) {
		return ts.ScriptTarget.ES2018;
	}

	if (version >= 13) {
		return ts.ScriptTarget.ES2017;
	}

	if (version >= 12) {
		return ts.ScriptTarget.ES2016;
	}

	return ts.ScriptTarget.ES5;
}
