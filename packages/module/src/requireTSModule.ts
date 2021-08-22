/* eslint-disable no-underscore-dangle, node/no-deprecated-api */

import fs from 'fs';
import type Module from 'module';
import { interopModule } from './interopModule';
import { ModuleLike, PathLike, TS } from './types';
import { COMPILER_OPTIONS, getTargetFromNodeVersion, isTypeScript } from './typescript';

let tsInstance: TS | null = null;

function loadTypeScript() {
	if (!tsInstance) {
		try {
			tsInstance = require('typescript') as TS;
		} catch {
			// Ignore and check at runtime
		}
	}

	return tsInstance;
}

const transformCache = new Map<string, string>();

function transform(contents: string, filePath: string): string {
	const ts = loadTypeScript();

	if (!ts) {
		throw new Error(`\`typescript\` package required for transforming file "${filePath}".`);
	}

	return ts.transpileModule(contents, {
		compilerOptions: {
			...COMPILER_OPTIONS,
			module: ts.ModuleKind.CommonJS,
			resolveJsonModule: true,
			target: getTargetFromNodeVersion(ts),
		},
		fileName: filePath,
	}).outputText;
}

function transformHandler(mod: Module, filePath: string) {
	let code = transformCache.get(filePath);

	if (!code) {
		code = transform(fs.readFileSync(filePath, 'utf8'), filePath);
		transformCache.set(filePath, code);
	}

	mod._compile(code, filePath);
}

/**
 * Register `.ts` and `.tsx` file extensions into Node.js's resolution algorithm.
 */
export function registerExtensions() {
	require.extensions['.ts'] = transformHandler;
	require.extensions['.tsx'] = transformHandler;
}

/**
 * Unregister `.ts` and `.tsx` file extensions.
 */
export function unregisterExtensions() {
	delete require.extensions['.ts'];
	delete require.extensions['.tsx'];
}

/**
 * Like `requireModule` but for loading TypeScript files ending in `ts` or `tsx`.
 * When imported, will transform the file using the `typescript` package,
 * evaluate the code in the current module context, and apply the same process
 * to all child imports.
 *
 * ```ts
 * import { requireTSModule } from '@boost/module';
 *
 * const result = requireTSModule('../../some/module.ts');
 * ```
 *
 * > This helper rarely needs to be used directly as `requireModule` will
 * > call it under the hood based on the file extension.
 */
export function requireTSModule<D = unknown, N extends object = {}>(
	path: PathLike,
	requirer: NodeRequire = require,
): ModuleLike<D, N> {
	const filePath = String(path);

	if (!isTypeScript(filePath)) {
		throw new Error(
			`Unable to import non-TypeScript file "${filePath}", use \`requireModule\` instead.`,
		);
	}

	registerExtensions();

	const result = interopModule<D, N>(requirer(filePath));

	unregisterExtensions();

	return result;
}
