import fs from 'fs';
import { CommonError } from '../CommonError';
import { Path } from '../Path';
import { parse as parseJSON } from '../serializers/json';
import { parse as parseYAML } from '../serializers/yaml';
import { PortablePath } from '../types';

/**
 * Can be used to *sync*hronously parse and return an object for the following
 * file types & extensions: `js`, `ts`, `tsx`, `json`, `json5`, `yaml`, `yml`.
 * The function requires an absolute file path, and any unsupported file type will throw an error.
 *
 * ```ts
 * import { parseFile } from '@boost/common';
 *
 * const data: ReturnShape = parseFile('/absolute/file/path');
 * ```
 *
 * > TypeScript files require the `typescript` package to be installed.
 */
export function parseFile<T>(filePath: PortablePath): T {
	const path = Path.create(filePath);

	if (!path.isAbsolute()) {
		throw new CommonError('PATH_REQUIRE_ABSOLUTE');
	}

	switch (path.ext()) {
		case '.js':
		case '.jsx':
		case '.ts':
		case '.tsx':
			return require(path.path());

		case '.json':
		case '.json5':
			return parseJSON(fs.readFileSync(path.path(), 'utf8'));

		case '.yml':
		case '.yaml':
			return parseYAML(fs.readFileSync(path.path(), 'utf8'));

		default:
			throw new CommonError('PARSE_INVALID_EXT', [path.name()]);
	}
}
