import AsyncPipeline from './AsyncPipeline';
import Context from './Context';
import { AggregatedResult } from './types';

export default class SynchronizedPipeline<
  Input,
  Output = Input,
  Ctx extends Context = Context
> extends AsyncPipeline<{}, Input, Output, Ctx> {
  blueprint() {
    return {};
  }

  /**
   * Execute all work units in parallel with a value being passed to each work unit.
   * Work units will synchronize regardless of race conditions and errors.
   */
  async run(context: Ctx): Promise<AggregatedResult<Output>> {
    const { value } = this;

    this.onRun.emit([value]);

    return Promise.all(
      this.work.map(unit => {
        this.onRunWorkUnit.emit([unit, value]);

        return unit.run(context, value).catch(error => error);
      }),
    ).then(responses => this.aggregateResult(responses));
  }
}
