import { Constructor } from '../types';

/**
 * Native `instanceof` checks are problematic, as cross realm checks fail.
 * They will also fail when comparing against source and built files.
 * So emulate an `instanceof` check by comparing constructor names.
 */

/**
 * Performs a loose instance check by comparing class names up the prototype
 * chain if `instanceof` initially fails. To disable this loose check,
 * pass `false` as the 3rd argument.
 *
 * ```ts
 * import { instanceOf } from '@boost/common';
 *
 * if (instanceOf(error, Error)) {
 * 	console.log(error.stack);
 * }
 * ```
 *
 * Generics can be used to type the object being checked. This will default
 * to the declaration passed to the 2nd argument.
 *
 * ```ts
 * instanceOf<ParseError>(error, Error);
 * ```
 *
 * > Loose checks can be useful if multiple copies of the same class declaration
 * > exists in the module tree. For example, multiple versions of the same package are imported.
 */
export function instanceOf<T = unknown>(
	object: unknown,
	declaration: Constructor<T>,
	loose: boolean = true,
): object is T {
	if (!object || typeof object !== 'object') {
		return false;
	}

	if (object instanceof declaration) {
		return true;
	}

	if (!loose) {
		return false;
	}

	let current = object;

	while (current) {
		if (current.constructor.name === 'Object') {
			break;
		}

		if (
			current.constructor.name === declaration.name ||
			// istanbul ignore next
			(current instanceof Error && current.name === declaration.name)
		) {
			return true;
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		current = Object.getPrototypeOf(current);
	}

	return false;
}
