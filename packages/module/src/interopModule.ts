/* eslint-disable @typescript-eslint/consistent-type-assertions */

import { ModuleLike } from './types';

export function interopModule<T>(result: unknown): ModuleLike<T> {
	if (typeof result !== 'object' || result === null) {
		return { default: result } as ModuleLike<T>;
	}

	// Already a module, so return early
	if ('__esModule' in result || 'default' in result) {
		return result as ModuleLike<T>;
	}

	return { ...result, default: result } as unknown as ModuleLike<T>;
}
