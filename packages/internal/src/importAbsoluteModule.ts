import { pathToFileURL } from 'node:url';
import { interopDefault } from './interopDefault';

// import() expects URLs, not file paths.
// https://github.com/nodejs/node/issues/31710
export async function importAbsoluteModule<T>(path: string): Promise<T> {
	const file = pathToFileURL(path).toString();
	const mod = (await import(file)) as unknown;

	return interopDefault<T>(mod);
}
