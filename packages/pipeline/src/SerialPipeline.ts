import { Blueprint, Schemas } from '@boost/common/optimal';
import { Context } from './Context';
import { createWorkUnit } from './createWorkUnit';
import { Pipeline } from './Pipeline';
import { Action } from './types';
import { WorkUnit } from './WorkUnit';

export abstract class SerialPipeline<
	Options extends object,
	Ctx extends Context,
	Input = unknown,
	Output = Input,
> extends Pipeline<Options, Ctx, Input, Output> {
	// Unknown does not work here as the output type changes for each
	// node in the linked list chain.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	root: SerialPipeline<Options, Ctx, any> = this;

	// Empty blueprint so that sub-classes may type correctly
	blueprint(schemas: Schemas): Blueprint<object> {
		return {};
	}

	/**
	 * Pipe a work unit to be ran with the return value of the previous work unit.
	 */
	pipe<O>(
		title: string,
		action: Action<Ctx, Input, O>,
		scope?: unknown,
	): SerialPipeline<Options, Ctx, O>;
	pipe<O>(workUnit: WorkUnit<{}, Input, O>): SerialPipeline<Options, Ctx, O>;
	pipe<O>(
		titleOrWorkUnit: WorkUnit<{}, Input, O> | string,
		action?: Action<Ctx, Input, O>,
		scope?: unknown,
	): SerialPipeline<Options, Ctx, O> {
		const workUnit = createWorkUnit(titleOrWorkUnit, action, scope);

		workUnit.depth = this.depth;
		workUnit.index = this.getWorkUnits().length;

		this.root.work.push(workUnit);

		// @ts-expect-error How to type this?
		const next = new this.constructor(this.context, this.value, this.options) as SerialPipeline<
			Options,
			Ctx,
			O
		>;

		next.depth = this.depth;
		next.root = this.root;

		if (this.monitorInstance) {
			next.monitor(this.monitorInstance);
		}

		return next;
	}

	/**
	 * Traverse the linked list to return a list of work units in defined order.
	 */
	override getWorkUnits(): WorkUnit<{}, Input, Output>[] {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return this.root.work;
	}

	/**
	 * Run and process the work units synchronously.
	 */
	abstract run(): Promise<Output>;
}
