/* eslint-disable no-restricted-syntax, no-await-in-loop */

import Context from './Context';
import SerialPipeline from './SerialPipeline';

export default class WaterfallPipeline<Ctx extends Context, Input> extends SerialPipeline<
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

    this.debug('Serializing %d work units', work.length);
    this.onRun.emit([value]);

    for (const unit of work) {
      this.onRunWorkUnit.emit([unit, value]);

      value = await unit.run(this.context, value);
    }

    return value;
  }
}
