import { isObject } from './isObject';

/**
 * Returns `true` if an object has no properties, an array has no items,
 * or the value is falsy, otherwise, it returns `false`.
 *
 * ```ts
 * import { isEmpty } from '@boost/common';
 *
 * isEmpty({}); // true
 * isEmpty({ name: 'Boost' }); // false
 *
 * isEmpty([]); // true
 * isEmpty(['Boost']); // false
 * ```
 */
export function isEmpty(value: unknown): boolean {
	return (
		!value ||
		(Array.isArray(value) && value.length === 0) ||
		(isObject<object>(value) && Object.keys(value).length === 0) ||
		false
	);
}
