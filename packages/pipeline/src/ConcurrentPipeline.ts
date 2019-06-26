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
    const { value } = this;

    this.debug('Parallelizing %d work units', this.work.length);
    this.onRun.emit([value]);

    return Promise.all(
      this.work.map(unit => {
        this.onRunWorkUnit.emit([unit, value]);

        return unit.run(context, value);
      }),
    );
  }
}
