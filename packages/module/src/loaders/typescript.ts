// https://nodejs.org/api/esm.html#esm_loaders

import fs from 'fs';
import { LoaderGetFormat, LoaderLoad, LoaderResolve, LoaderTransformSource } from '../types';
import {
	COMPILER_OPTIONS,
	getModuleFormat,
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

async function transform(url: string, source: string): Promise<string> {
	const ts = await loadTypeScript();

	if (!ts) {
		throw new Error(`\`typescript\` package required for transforming file "${url}".`);
	}

	return ts.transpileModule(String(source), {
		compilerOptions: {
			...COMPILER_OPTIONS,
			module: getModuleFromNodeVersion(ts),
			resolveJsonModule: false,
			target: getTargetFromNodeVersion(ts),
		},
		fileName: url,
	}).outputText;
}

// NEW API

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

			if (fs.existsSync(url)) {
				return {
					url: url.href,
				};
			}
		}
	}

	return defaultResolve(specifier, context);
};

export const load: LoaderLoad = async (url, context, defaultLoad) => {
	if (isTypeScript(url)) {
		const format = getModuleFormat(url);

		if (format === 'commonjs') {
			return { format };
		}

		const { source: rawSource } = await defaultLoad(url, { format });

		return {
			format,
			source: await transform(url, String(rawSource)),
		};
	}

	return defaultLoad(url, context);
};

// OLD API

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
		return {
			source: await transform(url, String(source)),
		};
	}

	return defaultTransformSource(source, context);
};
