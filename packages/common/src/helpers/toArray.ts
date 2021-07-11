export default function toArray<T = unknown>(value?: T | T[]): T[] {
	if (typeof value === 'undefined') {
		return [];
	}

	return Array.isArray(value) ? value : [value];
}
