import { instance, shape, string, union } from 'optimal';
import { Path } from './Path';
import { PortablePath } from './types';

export * from 'optimal';

/**
 * A schema for validating a value is a `PortablePath`.
 * Checks for a string, `Path`, or `Pathable`.
 */
export const portablePathSchema = union<PortablePath>('').of([
	string(),
	instance().of(Path),
	instance().of(Path, { loose: true }),
	shape({
		path: string(),
	}),
]);
