import { Contract, instanceOf } from '@boost/common';
import Context from './Context';
import { Action, AggregatedResult, Runnable } from './types';
import createWorkUnit from './createWorkUnit';

export default abstract class AsyncPipeline<
  Options extends object,
  Input,
  Output = Input,
  Ctx extends Context = Context
> extends Contract<Options> {
  queue: Runnable<Input, Output>[] = [];

  value: Input;

  constructor(value: Input, options?: Options) {
    super(options);

    this.value = value;
  }

  /**
   * Enqueue a work unit to the end of the queue.
   */
  push(title: string, action: Action<Ctx, Input, Output>): this;
  push(workUnit: Runnable<Input, Output>): this;
  push(
    titleOrWorkUnit: string | Runnable<Input, Output>,
    action?: Action<Ctx, Input, Output>,
  ): this {
    this.queue.push(createWorkUnit(titleOrWorkUnit, action));

    return this;
  }

  /**
   * Aggregate and partition errors and results into separate collections.
   */
  protected aggregateResult(responses: (Error | Output)[]): AggregatedResult<Output> {
    const errors: Error[] = [];
    const results: Output[] = [];

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
   * Run and process the entire work unit queue.
   */
  abstract async run(context: Ctx): Promise<any>;
}
