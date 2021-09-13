import { Blueprint, schemas } from 'optimal';
import { BlueprintFactory } from '../types';

/**
 * Can be used to generate a blueprint object for use within
 * [optimal](https://github.com/milesj/optimal) checks. All supported optimal
 * schemas are passed as an object to the factory.
 *
 * ```ts
 * import { optimal, createBlueprint } from '@boost/common';
 *
 * const blueprint = createBlueprint(({ string, number }) => ({
 * 	name: string().required(),
 * 	age: number().gt(0),
 * }));
 *
 * const data = optimal({}, blueprint);
 * ```
 */
export function createBlueprint<T extends object>(factory: BlueprintFactory<T>): Blueprint<T> {
	return factory(schemas);
}
