export function isProperty(
	target: Function | Object,
	property?: string | symbol,
	descriptor?: unknown,
): boolean {
	return Boolean(
		property &&
			((descriptor && typeof descriptor === 'object' && 'initializer' in descriptor) ||
				descriptor === undefined),
	);
}
