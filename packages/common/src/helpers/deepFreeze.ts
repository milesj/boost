import isPlainObject from './isPlainObject';

export default function deepFreeze<T extends object = object>(obj: T): T {
	if (Object.isFrozen(obj)) {
		return obj;
	}

	const nextObj: Record<string, unknown> = {};

	Object.entries(obj).forEach(([key, value]) => {
		// Only freeze plain objects
		if (isPlainObject(value, true)) {
			nextObj[key] = deepFreeze(value);
		} else {
			nextObj[key] = value;
		}
	});

	return Object.freeze(nextObj) as T;
}
