import kebabCase from 'lodash/kebabCase';
import { Contract } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { Event } from '@boost/event';
import { Context } from './Context';
import { debug } from './debug';
import { Monitor } from './Monitor';
import { Hierarchical } from './types';
import { WorkUnit } from './WorkUnit';

export abstract class Pipeline<Options extends object, Ctx extends Context, Input, Output>
	extends Contract<Options>
	implements Hierarchical
{
	depth: number = 0;

	index: number = 0;

	readonly context: Ctx;

	readonly debug: Debugger;

	readonly value: Input;

	/**
	 * Called after the pipeline executes work units.
	 * @category Events
	 */
	readonly onAfterRun = new Event('after-run');

	/**
	 * Called before the pipeline executes work units.
	 * @category Events
	 */
	readonly onBeforeRun = new Event<[Input]>('before-run');

	/**
	 * Called before a single work unit is executed.
	 * @category Events
	 */
	readonly onRunWorkUnit = new Event<[WorkUnit<{}, Input, Output>, Input]>('run-work-unit');

	protected monitorInstance: Monitor | null = null;

	protected work: WorkUnit<{}, Input, Output>[] = [];

	constructor(context: Ctx, value?: Input, options?: Options) {
		super(options);

		const { name } = this.constructor;

		this.context = context;
		this.debug = createDebugger(kebabCase(name));

		// This is technically invalid, but we want to allow optional values.
		// Luckily the input type defaults to `unknown`, so it forces consumers to validate.
		// @ts-expect-error Allow
		this.value = value;

		debug('New %S created', name);
	}

	/**
	 * Return a unique hierarchical ID.
	 */
	get id() {
		return `pipeline[${this.depth}:${this.index}]`;
	}

	/**
	 * Return a list of registered work units for the current pipeline.
	 */
	getWorkUnits(): WorkUnit<{}, Input, Output>[] {
		return this.work;
	}

	/**
	 * Monitor all hierarchical pipelines, routines, and tasks being executed,
	 * by listening to all applicable events.
	 */
	monitor(monitor: Monitor): this {
		this.monitorInstance = monitor.monitor(this);

		return this;
	}
}
