// https://nodejs.org/api/esm.html#esm_loaders

import fs from 'node:fs';
import type { InitializeHook, LoadHook, ResolveHook } from 'node:module';
import { fileURLToPath } from 'node:url';
import {
	COMPILER_OPTIONS,
	getModuleFromNodeVersion,
	getTargetFromNodeVersion,
	isNodeNext,
	isTypeScript,
} from '../typescript';

const FILE_WITH_EXT_PATTERN = /\.[a-z]+$/;

async function loadTypeScript() {
	try {
		return (await import('typescript')).default;
	} catch {
		return null;
	}
}

async function transform(url: string, source: string): Promise<string> {
	const ts = await loadTypeScript();

	if (!ts) {
		throw new Error(`\`typescript\` package required for transforming file "${url}".`);
	}

	const nodeNext = isNodeNext(url);

	return ts.transpileModule(String(source), {
		compilerOptions: {
			...COMPILER_OPTIONS,
			module: getModuleFromNodeVersion(ts, nodeNext),
			moduleResolution: nodeNext
				? ts.ModuleResolutionKind.NodeNext
				: ts.ModuleResolutionKind.Node16,
			resolveJsonModule: false,
			target: getTargetFromNodeVersion(ts),
		},
		fileName: url,
	}).outputText;
}

export const initialize: InitializeHook = () => {};

export const resolve: ResolveHook = (specifier, context, nextResolve) => {
	if (isTypeScript(specifier)) {
		return {
			shortCircuit: true,
			url: new URL(specifier, context.parentURL).href,
		};
	}

	// Relative import doesn't have an extension, so attempt to find a TS file
	if (specifier.startsWith('.') && !FILE_WITH_EXT_PATTERN.test(specifier)) {
		for (const ext of ['.ts', '.tsx', '.cts', '.mts']) {
			const url = new URL(specifier + ext, context.parentURL);

			if (fs.existsSync(url)) {
				return {
					format: 'module',
					shortCircuit: true,
					url: url.href,
				};
			}
		}
	}

	return nextResolve(specifier, context);
};

export const load: LoadHook = async (url, context, nextLoad) => {
	if (isTypeScript(url)) {
		const source = await transform(url, await fs.promises.readFile(fileURLToPath(url), 'utf8'));

		return {
			format: 'module',
			shortCircuit: true,
			source,
		};
	}

	return nextLoad(url, context);
};
