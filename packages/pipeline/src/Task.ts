import { Blueprint, Predicates } from '@boost/common';
import WorkUnit from './WorkUnit';

export default class Task<Input = unknown, Output = Input> extends WorkUnit<{}, Input, Output> {
	// A task is simply a work unit that executes a standard function.
	// It doesn't need configurable options, so implement an empty blueprint.
	blueprint(preds: Predicates): Blueprint<object> {
		return {};
	}
}
