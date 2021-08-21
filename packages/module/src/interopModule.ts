/* eslint-disable @typescript-eslint/consistent-type-assertions */

import { ModuleLike } from './types';

/**
 * Formats the shape of an imported module to align with the
 * ES module specification.
 *
 * For ES or ES-like modules, returns the shape as-is.
 *
 * For CommonJS modules, returns an object with the following:
 * - `module.exports` under the `default` property.
 * - `exports.<name>` under properties of the same name,
 *   and also under a `default` object.
 */
export function interopModule<D = unknown, N extends object = {}>(
	result: unknown,
): ModuleLike<D, N> {
	if (typeof result !== 'object' || result === null) {
		return { default: result } as ModuleLike<D, N>;
	}

	// Already a module, so return early
	if ('__esModule' in result || 'default' in result) {
		return result as ModuleLike<D, N>;
	}

	return { ...result, default: result } as unknown as ModuleLike<D, N>;
}
