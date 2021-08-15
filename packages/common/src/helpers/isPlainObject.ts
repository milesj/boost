import { isObject } from './isObject';

/**
 * Like `isObject` but only returns true if the value is a plain object
 * (no class instances, built-ins, etc). It achieves this by comparing
 * the value's prototype to the built-in `Object` types. If you need to
 * run these checks for cross-realm objects, pass true to the `loose` argument.
 *
 * ```ts
 * import { isPlainObject } from '@boost/common';
 *
 * isPlainObject({}); // true
 * isPlainObject(new Foo()); // false
 * isPlainObject([]); // false
 * ```
 */
export function isPlainObject<T = object>(value: unknown, loose: boolean = false): value is T {
	if (!isObject(value)) {
		return false;
	}

	const proto = Object.getPrototypeOf(value) as unknown;

	if (
		value.constructor === Object ||
		proto === Object.prototype ||
		proto === null ||
		// This is to support cross-realm checks
		(loose && value.constructor.name === 'Object')
	) {
		return true;
	}

	return false;
}
