// https://nodejs.org/api/esm.html#esm_loaders

import fs from 'fs';
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

export async function resolve(
	specifier: string,
	context: { conditions: string[]; parentURL?: string },
	defaultResolve: typeof resolve,
): Promise<{ url: string }> {
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

	return defaultResolve(specifier, context, defaultResolve);
}

export async function getFormat(
	url: string,
	context: object,
	defaultGetFormat: typeof getFormat,
): Promise<{ format: string }> {
	if (isTypeScript(url)) {
		return {
			format: 'module',
		};
	}

	return defaultGetFormat(url, context, defaultGetFormat);
}

export async function transformSource(
	source: SharedArrayBuffer | Uint8Array | string,
	context: { format: string; url: string },
	defaultTransformSource: typeof transformSource,
): Promise<{ source: string }> {
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

	return defaultTransformSource(source, context, defaultTransformSource);
}
