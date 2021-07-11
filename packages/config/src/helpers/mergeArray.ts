export function mergeArray<T extends unknown[]>(prev: T, next: T): T {
	return [...new Set([...prev, ...next])].filter((value) => value !== undefined) as T;
}
