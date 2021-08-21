/* eslint-disable @typescript-eslint/consistent-type-assertions */

import { ModuleLike } from './types';

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
