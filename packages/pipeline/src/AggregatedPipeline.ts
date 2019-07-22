import ParallelPipeline from './ParallelPipeline';
import Context from './Context';
import { AggregatedResult } from './types';

export default class AggregatedPipeline<
  Ctx extends Context,
  Input,
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

    this.debug('Aggregating %d work units', work.length);
    this.onRun.emit([value]);

    return Promise.all(
      work.map(unit => {
        this.onRunWorkUnit.emit([unit, value]);

        return unit.run(context, value).catch(error => error);
      }),
    ).then(responses => this.aggregateResult(responses));
  }
}
