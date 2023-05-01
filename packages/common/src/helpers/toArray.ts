/**
 * Converts a non-array to an array. If the provided value is falsy,
 * an empty array is returned. If the provided value is truthy and a
 * non-array, an array of 1 item is returned.
 *
 * ```ts
 * import { toArray } from '@boost/common';
 *
 * toArray(123); // [123]
 * toArray('abc'); // ['abc']
 * toArray(['a', 'b', 'c']); // ['a', 'b', 'c']
 * ```
 */
export function toArray<T = unknown>(value?: T | T[]): T[] {
	if (value === undefined) {
		return [];
	}

	return Array.isArray(value) ? value : [value];
}
