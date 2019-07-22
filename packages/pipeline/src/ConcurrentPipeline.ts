import ParallelPipeline from './ParallelPipeline';
import Context from './Context';

export default class ConcurrentPipeline<
  Ctx extends Context,
  Input,
  Output = Input
> extends ParallelPipeline<{}, Ctx, Input, Output> {
  blueprint() {
    return {};
  }

  /**
   * Execute all work units in parallel with a value being passed to each work unit.
   * If an error occurs, the pipeline will abort early, otherwise return a list of all results.
   */
  async run(): Promise<Output[]> {
    const { context, value } = this;
    const work = this.getWorkUnits();

    this.debug('Parallelizing %d work units', work.length);
    this.onRun.emit([value]);

    return Promise.all(
      work.map(unit => {
        this.onRunWorkUnit.emit([unit, value]);

        return unit.run(context, value);
      }),
    );
  }
}
