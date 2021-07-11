import { pathToFileURL } from 'url';
import { Path } from '@boost/common';
import { supportsImport } from './supports/import';

export async function loadMjs<T>(path: Path): Promise<T> {
	if (!supportsImport) {
		throw new Error(
			`Unable to use \`mjs\` loader. Native ECMAScript modules aren't supported by this platform. Found Node.js v${process.version}, requires v13.3.`,
		);
	}

	// import() expects URLs, not file paths.
	// https://github.com/nodejs/node/issues/31710
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const mod = await import(pathToFileURL(path.path()).toString());

	return (mod as { default: unknown }).default as T;
}
