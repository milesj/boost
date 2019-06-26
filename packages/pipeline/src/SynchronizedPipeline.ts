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
    return Promise.all(
      this.queue.map(unit => unit.run(context, this.value).catch(error => error)),
    ).then(responses => this.aggregateResult(responses));
  }
}
