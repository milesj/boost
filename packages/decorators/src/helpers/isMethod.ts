export function isMethod(
	target: Function | Object,
	property?: string | symbol,
	descriptor?: unknown,
): boolean {
	return Boolean(
		property &&
			descriptor &&
			typeof descriptor === 'object' &&
			!('initializer' in descriptor) &&
			('value' in descriptor || 'get' in descriptor),
	);
}
