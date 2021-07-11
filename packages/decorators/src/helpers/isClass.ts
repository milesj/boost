export function isClass(
	target: Function | Object,
	property?: string | symbol,
	descriptor?: unknown,
): boolean {
	return typeof target === 'function' && !property && !descriptor;
}
