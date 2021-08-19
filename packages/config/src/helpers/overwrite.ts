/**
 * Overwrite the previous value with the next value.
 */
export function overwrite<T>(prev: T, next: T): T {
	return next;
}
