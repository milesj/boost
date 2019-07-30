import { instanceOf } from '@boost/common';
import Context from './Context';
import Pipeline from './Pipeline';
import WorkUnit from './WorkUnit';
import createWorkUnit from './createWorkUnit';
import { Action, AggregatedResult } from './types';

export default abstract class ParallelPipeline<
  Options extends object,
  Ctx extends Context,
  Input,
  Output = Input
> extends Pipeline<Options, Ctx, Input, Output> {
  /**
   * Add a work unit to the list of items to process.
   */
  add(title: string, action: Action<Ctx, Input, Output>, scope?: unknown): this;
  add(workUnit: WorkUnit<{}, Input, Output>): this;
  add(
    titleOrWorkUnit: string | WorkUnit<{}, Input, Output>,
    action?: Action<Ctx, Input, Output>,
    scope?: unknown,
  ): this {
    const workUnit = createWorkUnit(titleOrWorkUnit, action, scope);

    workUnit.depth = this.depth;
    workUnit.index = this.work.length;

    this.work.push(workUnit);

    return this;
  }

  /**
   * Aggregate and partition errors and results into separate collections.
   */
  protected aggregateResult(responses: (Error | Output)[]): AggregatedResult<Output> {
    const errors: Error[] = [];
    const results: Output[] = [];

    this.debug('Aggregating results');

    responses.forEach(response => {
      if (instanceOf(response, Error)) {
        errors.push(response);
      } else {
        results.push(response);
      }
    });

    return { errors, results };
  }

  /**
   * Run and process the work unit's asynchronously.
   * Return `any` so that sub-classes can override the output type.
   */
  abstract async run(): Promise<unknown>;
}
