import ParallelPipeline from './ParallelPipeline';
import Context from './Context';
import { AggregatedResult } from './types';
import debug from './debug';

export default class AggregatedPipeline<
  Ctx extends Context,
  Input = unknown,
  Output = Input
> extends ParallelPipeline<{}, Ctx, Input, Output> {
  blueprint() {
    return {};
  }

  /**
   * Execute all work units in parallel with a value being passed to each work unit.
   * Work units will synchronize regardless of race conditions and errors.
   */
  async run(): Promise<AggregatedResult<Output>> {
    const { context, value } = this;
    const work = this.getWorkUnits();

    debug('Running %d as an aggregate', work.length);

    this.onBeforeRun.emit([value]);

    const result = await Promise.all(
      work.map((unit) => {
        this.onRunWorkUnit.emit([unit, value]);

        return unit.run(context, value).catch((error) => error);
      }),
    ).then((responses) => this.aggregateResult(responses));

    this.onAfterRun.emit([]);

    return result;
  }
}
