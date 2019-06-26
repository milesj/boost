import AsyncPipeline from './AsyncPipeline';
import Context from './Context';

export default class ConcurrentPipeline<
  Input,
  Output = Input,
  Ctx extends Context = Context
> extends AsyncPipeline<{}, Input, Output, Ctx> {
  blueprint() {
    return {};
  }

  /**
   * Execute all work units in parallel with a value being passed to each work unit.
   * If an error occurs, the pipeline will abort early, otherwise return a list of all results.
   */
  async run(context: Ctx): Promise<Output[]> {
    return Promise.all(this.queue.map(unit => unit.run(context, this.value)));
  }
}
