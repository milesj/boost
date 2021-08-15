import { isObject } from './isObject';

export type MergableArray = unknown[];
export type MergableObject = Record<string, unknown>;
export type Mergeable = MergableArray | MergableObject;
export type InferMergeable<T> = T extends unknown[]
	? MergableArray
	: T extends object
	? MergableObject
	: never;

function merge<T extends Mergeable>(prev: T, next: unknown): T {
	const base = prev as MergableObject;

	Object.entries(next as Mergeable).forEach(([key, value]) => {
		const prevValue = base[key];

		if (isObject(prevValue) && isObject(value)) {
			base[key] = merge({ ...prevValue }, value);
		} else if (Array.isArray(prevValue) && Array.isArray(value)) {
			base[key] = merge([...(prevValue as MergableArray)], value);
		} else {
			base[key] = value;
		}
	});

	return base as T;
}

/**
 * Can be used to recursively merge objects and arrays, where values on the
 * right-hand side will overwrite values on the left-hand based on the key
 * or index respectively. Furthermore, if the 2nd argument is not provided,
 * it will simply clone the base value.
 *
 * ```ts
 * import { deepMerge } from '@boost/common';
 *
 * const obj = deepMerge({ foo: 123, bar: 'abc' }, { foo: 456, baz: true });
 *
 * // -> { foo: 456, bar: 'abc', baz: true }
 * ```
 */
export function deepMerge<T extends Mergeable, V extends InferMergeable<T>>(base: T, other?: V): T {
	const next = Array.isArray(base)
		? merge<MergableArray>([], base)
		: merge<MergableObject>({}, base);

	if (other) {
		merge(next, other);
	}

	return next as T;
}
