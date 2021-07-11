import { isObject } from './isObject';

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
