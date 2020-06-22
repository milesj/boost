import ParallelPipeline from './ParallelPipeline';
import Context from './Context';
import debug from './debug';

export default class ConcurrentPipeline<
  Ctx extends Context,
  Input = unknown,
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

    debug('Running %d in parallel', work.length);

    this.onRun.emit([value]);

    const result = await Promise.all(
      work.map((unit) => {
        this.onRunWorkUnit.emit([unit, value]);

        return unit.run(context, value);
      }),
    );

    this.onFinish.emit([]);

    return result;
  }
}
