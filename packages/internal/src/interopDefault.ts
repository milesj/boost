/**
 * For compatibility with ES modules, this function is used to extract the
 * default export from an incompatible module.
 */
export function interopDefault<R>(result: unknown): R {
	if (result && typeof result === 'object' && 'default' in result) {
		return result.default as R;
	}

	return result as R;
}
