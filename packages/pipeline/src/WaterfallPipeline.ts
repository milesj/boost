/* eslint-disable no-restricted-syntax, no-await-in-loop */

import Context from './Context';
import SerialPipeline from './SerialPipeline';
import { debug } from './constants';

export default class WaterfallPipeline<Ctx extends Context, Input = unknown> extends SerialPipeline<
  {},
  Ctx,
  Input
> {
  blueprint() {
    return {};
  }

  /**
   * Execute the pipeline in sequential order with the output of each
   * work unit being passed to the next work unit in the chain.
   */
  async run(): Promise<Input> {
    const work = this.getWorkUnits();
    let { value } = this.root;

    debug('Running %d as a waterfall', work.length);

    this.onRun.emit([value]);

    for (const unit of work) {
      this.onRunWorkUnit.emit([unit, value]);

      value = await unit.run(this.context, value);
    }

    this.onFinish.emit([]);

    return value;
  }
}
