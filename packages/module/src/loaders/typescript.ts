// https://nodejs.org/api/esm.html#esm_loaders

import fs from 'fs';
import { LoaderGetFormat, LoaderResolve, LoaderTransformSource } from '../types';
import {
	COMPILER_OPTIONS,
	getModuleFromNodeVersion,
	getTargetFromNodeVersion,
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

export const resolve: LoaderResolve = async (specifier, context, defaultResolve) => {
	if (isTypeScript(specifier)) {
		return {
			url: new URL(specifier, context.parentURL).href,
		};
	}

	// Relative import doesn't have an extension, so attempt to find a TS file
	if (specifier.startsWith('.') && !FILE_WITH_EXT_PATTERN.test(specifier)) {
		for (const ext of ['.ts', '.tsx']) {
			const url = new URL(specifier + ext, context.parentURL);

			// @ts-expect-error Node not typed for URLs
			if (fs.existsSync(url)) {
				return {
					url: url.href,
				};
			}
		}
	}

	return defaultResolve(specifier, context);
};

export const getFormat: LoaderGetFormat = async (url, context, defaultGetFormat) => {
	if (isTypeScript(url)) {
		return {
			format: 'module',
		};
	}

	return defaultGetFormat(url, context);
};

export const transformSource: LoaderTransformSource = async (
	source,
	context,
	defaultTransformSource,
) => {
	const { url } = context;

	if (isTypeScript(url)) {
		const ts = await loadTypeScript();

		if (!ts) {
			throw new Error(`\`typescript\` package required for transforming file "${url}".`);
		}

		return {
			source: ts.transpileModule(String(source), {
				compilerOptions: {
					...COMPILER_OPTIONS,
					module: getModuleFromNodeVersion(ts),
					resolveJsonModule: false,
					target: getTargetFromNodeVersion(ts),
				},
				fileName: url,
			}).outputText,
		};
	}

	return defaultTransformSource(source, context);
};
