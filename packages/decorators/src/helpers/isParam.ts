export function isParam(
	target: Function | Object,
	property?: string | symbol,
	index?: unknown,
): boolean {
	return Boolean(property && typeof index === 'number');
}
