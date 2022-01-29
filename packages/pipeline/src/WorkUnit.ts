import { Contract } from '@boost/common';
import { BailEvent, Event } from '@boost/event';
import {
	STATUS_FAILED,
	STATUS_PASSED,
	STATUS_PENDING,
	STATUS_RUNNING,
	STATUS_SKIPPED,
} from './constants';
import { Context } from './Context';
import { PipelineError } from './PipelineError';
import { Action, Hierarchical, Runnable, Status } from './types';

export abstract class WorkUnit<Options extends object, Input = unknown, Output = Input>
	extends Contract<Options>
	implements Runnable<Input, Output>, Hierarchical
{
	depth: number = 0;

	index: number = 0;

	output?: Output;

	input?: Input;

	startTime: number = 0;

	statusText: string = '';

	stopTime: number = 0;

	/**
	 * Called when an execution fails.
	 * @category Events
	 */
	readonly onFail = new Event<[Error | null, Input]>('fail');

	/**
	 * Called when an execution succeeds.
	 * @category Events
	 */
	readonly onPass = new Event<[Output, Input]>('pass');

	/**
	 * Called before a work unit is executed. Can return `true` to skip the work unit.
	 * @category Events
	 */
	readonly onRun = new BailEvent<[Input]>('run');

	/**
	 * Called when an execution is skipped.
	 * @category Events
	 */
	readonly onSkip = new Event<[Input]>('skip');

	readonly title: string;

	private action: Action<Context, Input, Output>;

	private status: Status = STATUS_PENDING;

	// We want to support all contexts, so we use any.
	// Unknown and `Context` will not work because of the constraint.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor(title: string, action: Action<any, Input, Output>, options?: Options) {
		super(options);

		if (!title || typeof title !== 'string') {
			throw new PipelineError('WORK_REQUIRED_TITLE');
		}

		if (action !== null && typeof action !== 'function') {
			throw new PipelineError('ACTION_REQUIRED');
		}

		this.action = action;
		this.status = STATUS_PENDING;
		this.title = title;
	}

	/**
	 * Return a unique hierarchical ID.
	 */
	get id() {
		return `work[${this.depth}:${this.index}]`;
	}

	/**
	 * Return true if the task failed when executing.
	 */
	hasFailed(): boolean {
		return this.status === STATUS_FAILED;
	}

	/**
	 * Return true if the task executed successfully.
	 */
	hasPassed(): boolean {
		return this.status === STATUS_PASSED;
	}

	/**
	 * Return true if the task has been completed in any form.
	 */
	isComplete(): boolean {
		return this.hasPassed() || this.hasFailed() || this.isSkipped();
	}

	/**
	 * Return true if the task has not been executed yet.
	 */
	isPending(): boolean {
		return this.status === STATUS_PENDING;
	}

	/**
	 * Return true if the task is currently running.
	 */
	isRunning(): boolean {
		return this.status === STATUS_RUNNING;
	}

	/**
	 * Return true if the task was or will be skipped.
	 */
	isSkipped(): boolean {
		return this.status === STATUS_SKIPPED;
	}

	/**
	 * Run the current task by executing it and performing any before and after processes.
	 */
	async run(context: Context, value: Input): Promise<Output> {
		this.input = value;
		const skip = this.onRun.emit([value]);
		const runner: Action<Context, Input, Output> = this.action;

		if (skip || this.isSkipped() || !runner) {
			this.status = STATUS_SKIPPED;
			this.onSkip.emit([value]);

			// Allow input as output. This is problematic for skipping
			// since the expected output is no longer in sync. Revisit.
			// @ts-expect-error Allow invalid type
			return value;
		}

		this.status = STATUS_RUNNING;
		this.startTime = Date.now();

		try {
			this.output = await runner(context, value, this);
			this.status = STATUS_PASSED;
			this.stopTime = Date.now();
			this.onPass.emit([this.output, value]);
		} catch (error: unknown) {
			this.status = STATUS_FAILED;
			this.stopTime = Date.now();

			if (error instanceof Error) {
				this.onFail.emit([error, value]);

				throw error;
			}
		}

		this.statusText = '';

		return this.output!;
	}

	/**
	 * Mark a task as skipped if the condition is true.
	 */
	skip(condition: boolean = true): this {
		if (condition) {
			this.status = STATUS_SKIPPED;
		}

		return this;
	}
}
