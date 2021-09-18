import { instanceOf } from '@boost/common';
import { Blueprint, Schemas } from '@boost/common/optimal';
import { Context } from './Context';
import { createWorkUnit } from './createWorkUnit';
import { Pipeline } from './Pipeline';
import { Action, AggregatedResult } from './types';
import { WorkUnit } from './WorkUnit';

export abstract class ParallelPipeline<
	Options extends object,
	Ctx extends Context,
	Input = unknown,
	Output = Input,
> extends Pipeline<Options, Ctx, Input, Output> {
	// Empty blueprint so that sub-classes may type correctly
	blueprint(schemas: Schemas): Blueprint<object> {
		return {};
	}

	/**
	 * Add a work unit to the list of items to process.
	 */
	add(title: string, action: Action<Ctx, Input, Output>, scope?: unknown): this;
	add(workUnit: WorkUnit<{}, Input, Output>): this;
	add(
		titleOrWorkUnit: WorkUnit<{}, Input, Output> | string,
		action?: Action<Ctx, Input, Output>,
		scope?: unknown,
	): this {
		const workUnit = createWorkUnit(titleOrWorkUnit, action, scope);

		workUnit.depth = this.depth;
		workUnit.index = this.work.length;

		this.work.push(workUnit);

		return this;
	}

	/**
	 * Aggregate and partition errors and results into separate collections.
	 */
	protected aggregateResult(responses: (Error | Output)[]): AggregatedResult<Output> {
		const errors: Error[] = [];
		const results: Output[] = [];

		responses.forEach((response) => {
			if (instanceOf(response, Error)) {
				errors.push(response);
			} else {
				results.push(response);
			}
		});

		return { errors, results };
	}

	/**
	 * Run and process the work unit's asynchronously.
	 */
	abstract run(): Promise<unknown>;
}
