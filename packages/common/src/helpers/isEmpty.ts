import { isObject } from './isObject';

export function isEmpty(value: unknown): boolean {
	return (
		!value ||
		(Array.isArray(value) && value.length === 0) ||
		(isObject<object>(value) && Object.keys(value).length === 0) ||
		false
	);
}
