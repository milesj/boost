import Context from './Context';
import Pipeline from './Pipeline';
import { AggregatedResult } from './types';

export default class SynchronizedPipeline<Input, Ctx extends Context = Context> extends Pipeline<
  Input,
  Ctx
> {
  blueprint() {
    return {};
  }

  /**
   * Execute the pipelne in parallel with a value being passed to each work unit.
   * Work units will synchronize regardless of race conditions and errors.
   */
  async run<Result>(context: Ctx): Promise<AggregatedResult<Result>> {
    return Promise.all(
      this.getWorkUnits().map(unit => unit.run(context, this.value).catch(error => error)),
    ).then(responses => Promise.resolve(this.aggregateResult(responses)));
  }
}
