import Context from './Context';
import Pipeline from './Pipeline';

export default class ConcurrentPipeline<Input, Ctx extends Context = Context> extends Pipeline<
  Input,
  Ctx
> {
  /**
   * Execute all pipeline work units in parallel and return an array of all results.
   */
  async run<Result>(context: Ctx): Promise<Result[]> {
    return Promise.all(this.getWorkUnits().map(unit => unit.run(context, this.root.value)));
  }
}
