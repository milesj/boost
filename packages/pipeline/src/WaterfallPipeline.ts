/* eslint-disable no-restricted-syntax, no-await-in-loop */

import Context from './Context';
import SyncPipeline from './SyncPipeline';

export default class WaterfallPipeline<Input, Ctx extends Context = Context> extends SyncPipeline<
  {},
  Input,
  Ctx
> {
  blueprint() {
    return {};
  }

  /**
   * Execute the pipeline in sequential order with the output of each
   * work unit being passed to the next work unit in the chain.
   */
  async run<Result>(context: Ctx): Promise<Result> {
    let { value } = this;

    this.onRun.emit([value]);

    for (const unit of this.getWorkUnits()) {
      this.onRunWorkUnit.emit([unit, value]);

      value = await unit.run(context, value);
    }

    return value as any;
  }
}
