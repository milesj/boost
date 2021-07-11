import { Context } from './Context';
import { debug } from './debug';
import { ParallelPipeline } from './ParallelPipeline';
import { AggregatedResult } from './types';

export class AggregatedPipeline<
	Ctx extends Context,
	Input = unknown,
	Output = Input,
> extends ParallelPipeline<{}, Ctx, Input, Output> {
	/**
	 * Execute all work units in parallel with a value being passed to each work unit.
	 * Work units will synchronize regardless of race conditions and errors.
	 */
	async run(): Promise<AggregatedResult<Output>> {
		const { context, value } = this;
		const work = this.getWorkUnits();

		debug('Running %d as an aggregate', work.length);

		this.onBeforeRun.emit([value]);

		const result = await Promise.all(
			work.map(async (unit) => {
				this.onRunWorkUnit.emit([unit, value]);

				try {
					return await unit.run(context, value);
				} catch (error: unknown) {
					return error as Error;
				}
			}),
		).then((responses) => this.aggregateResult(responses));

		this.onAfterRun.emit([]);

		return result;
	}
}
