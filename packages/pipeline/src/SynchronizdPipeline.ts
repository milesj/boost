import Context from './Context';
import Pipeline from './Pipeline';

export default class SynchronizedPipeline<Input, Ctx extends Context = Context> extends Pipeline<
  Input,
  Ctx
> {
  /**
   * Execute the pipelne in parallel with a value being passed to each work unit.
   * Work units will synchronize regardless of race conditions and errors.
   */
  async run<Result>(context: Ctx): Promise<Result[]> {
    return Promise.all(
      this.getWorkUnits().map(unit => unit.run(context, this.root.value).catch(error => error)),
    );
  }
}
