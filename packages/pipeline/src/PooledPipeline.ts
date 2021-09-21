/* eslint-disable promise/prefer-await-to-callbacks */
/* eslint-disable promise/prefer-await-to-then */

import os from 'os';
import { Blueprint, Schemas } from '@boost/common/optimal';
import { Context } from './Context';
import { debug } from './debug';
import { ParallelPipeline } from './ParallelPipeline';
import { PipelineError } from './PipelineError';
import { AggregatedResult } from './types';
import { WorkUnit } from './WorkUnit';

export interface PooledOptions {
	/** How many work units to process in parallel. */
	concurrency?: number;
	/** Process with first-in-last-out order, instead of first-in-first-out. */
	filo?: boolean;
	/** Timeout in milliseconds that each work unit may run, or `0` to avoid a
  timeout. Defaults to `0`. */
	timeout?: number;
}

export class PooledPipeline<
	Ctx extends Context,
	Input = unknown,
	Output = Input,
> extends ParallelPipeline<PooledOptions, Ctx, Input, Output> {
	protected resolver?: (response: AggregatedResult<Output>) => void;

	protected results: (Error | Output)[] = [];

	protected running: WorkUnit<{}, Input, Output>[] = [];

	override blueprint(schemas: Schemas): Blueprint<PooledOptions> {
		const { bool, number } = schemas;

		return {
			concurrency: number(os.cpus().length).gte(1),
			filo: bool(),
			timeout: number(0).gte(0),
		};
	}

	/**
	 * Execute all work units in parallel, in a pool with a max concurrency,
	 * with a value being passed to each work unit.
	 * Work units will synchronize regardless of race conditions and errors.
	 */
	async run(): Promise<AggregatedResult<Output>> {
		debug('Running %d as a pool', this.work.length);

		this.onBeforeRun.emit([this.value]);

		const result = await new Promise<AggregatedResult<Output>>((resolve) => {
			if (this.work.length === 0) {
				resolve(this.aggregateResult([]));

				return;
			}

			this.resolver = resolve;

			void Promise.all(
				this.work
					.slice(0, this.options.concurrency)
					.map(() => this.runWorkUnit(this.context, this.value)),
			);
		});

		this.onAfterRun.emit([]);

		return result;
	}

	/**
	 * Run a single work unit from the queue, and start the next work unit when it passes or fails.
	 */
	protected async runWorkUnit(context: Ctx, value: Input): Promise<void> {
		const { concurrency, filo, timeout } = this.options;
		const unit = filo ? this.work.pop()! : this.work.shift()!;

		this.running.push(unit);

		const handleResult = (result: Error | Output) => {
			this.running = this.running.filter((running) => running !== unit);
			this.results.push(result);

			if (this.work.length > 0 && this.running.length < concurrency) {
				return this.runWorkUnit(context, value);
			}
			if (this.work.length === 0 && this.running.length === 0 && this.resolver) {
				this.resolver(this.aggregateResult(this.results));
			}

			return Promise.resolve();
		};

		return new Promise((resolve) => {
			let timer: NodeJS.Timeout;

			if (timeout > 0) {
				timer = setTimeout(() => {
					resolve(handleResult(new PipelineError('WORK_TIME_OUT')));
				}, timeout);
			}

			this.onRunWorkUnit.emit([unit, value]);

			unit
				.run(context, value)
				.then((result) => {
					if (timer) {
						clearTimeout(timer);
					}

					resolve(handleResult(result));

					return result;
				})
				.catch((error) => {
					resolve(handleResult(error as Error));
				});
		});
	}
}
