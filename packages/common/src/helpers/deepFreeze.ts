import { isPlainObject } from './isPlainObject';

/**
 * Can be used to recursively freeze plain objects with `Object.freeze`.
 *
 * ```ts
 * import { deepFreeze } from '@boost/common';
 *
 * const obj = deepFreeze({ foo: 123 });
 *
 * // Errors!
 * obj.foo = 456;
 * ```
 */
export function deepFreeze<T extends object = object>(obj: T): T {
	if (Object.isFrozen(obj)) {
		return obj;
	}

	const nextObj: Record<string, unknown> = {};

	Object.entries(obj).forEach(([key, value]) => {
		// Only freeze plain objects
		nextObj[key] = isPlainObject(value, true) ? deepFreeze(value) : value;
	});

	return Object.freeze(nextObj) as T;
}
