import { Blueprint, predicates } from 'optimal';
import { BlueprintFactory } from '../types';

export default function createBlueprint<T extends object>(
	factory: BlueprintFactory<T>,
): Blueprint<T> {
	return factory(predicates);
}
