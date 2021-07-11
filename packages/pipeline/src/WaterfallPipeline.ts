/* eslint-disable no-await-in-loop */

import { Context } from './Context';
import { debug } from './debug';
import { SerialPipeline } from './SerialPipeline';

export class WaterfallPipeline<Ctx extends Context, Input = unknown> extends SerialPipeline<
	{},
	Ctx,
	Input
> {
	/**
	 * Execute the pipeline in sequential order with the output of each
	 * work unit being passed to the next work unit in the chain.
	 */
	async run(): Promise<Input> {
		const work = this.getWorkUnits();
		let value = this.root.value as Input;

		debug('Running %d as a waterfall', work.length);

		this.onBeforeRun.emit([value]);

		for (const unit of work) {
			this.onRunWorkUnit.emit([unit, value]);

			value = await unit.run(this.context, value);
		}

		this.onAfterRun.emit([]);

		return value;
	}
}
