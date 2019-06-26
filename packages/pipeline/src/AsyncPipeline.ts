import { instanceOf } from '@boost/common';
import Context from './Context';
import Pipeline from './Pipeline';
import WorkUnit from './WorkUnit';
import createWorkUnit from './createWorkUnit';
import { Action, AggregatedResult } from './types';

export default abstract class AsyncPipeline<
  Options extends object,
  Input,
  Output = Input,
  Ctx extends Context = Context
> extends Pipeline<Options, Input, Output, Ctx> {
  work: WorkUnit<any, Input, Output>[] = [];

  /**
   * Add a work unit to the list of items to process.
   */
  add(title: string, action: Action<Ctx, Input, Output>, scope?: unknown): this;
  add(workUnit: WorkUnit<any, Input, Output>): this;
  add(
    titleOrWorkUnit: string | WorkUnit<any, Input, Output>,
    action?: Action<Ctx, Input, Output>,
    scope?: unknown,
  ): this {
    this.work.push(createWorkUnit(titleOrWorkUnit, action, scope));

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
}
