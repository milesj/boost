/* eslint-disable */

import { Contract, instanceOf } from '@boost/common';
import Context from './Context';
import Task from './Task';
import WorkUnit from './WorkUnit';
import { Action, Runnable, AggregatedResult } from './types';

export default abstract class Pipeline<
  Input,
  Ctx extends Context = Context,
  Options extends object = {}
> extends Contract<Options> {
  next?: Pipeline<any, Ctx>;

  prev?: Pipeline<any, Ctx>;

  root: Pipeline<any, Ctx>;

  work?: Runnable<Input, any>;

  value: Input;

  constructor(value: Input, options?: Options) {
    super(options);

    this.value = value;
    this.root = this;
  }

  pipe<Output>(title: string, action: Action<Ctx, Input, Output>): Pipeline<Output, Ctx>;
  pipe<Output>(workUnit: Runnable<Input, Output>): Pipeline<Output, Ctx>;
  pipe<Output>(
    titleOrWorkUnit: string | Runnable<Input, Output>,
    action?: Action<Ctx, Input, Output>,
  ): Pipeline<Output, Ctx> {
    if (titleOrWorkUnit instanceof WorkUnit) {
      this.work = titleOrWorkUnit;
    } else if (typeof titleOrWorkUnit === 'string' && typeof action === 'function') {
      this.work = new Task(titleOrWorkUnit, action);
    } else {
      throw new TypeError('Unknown work unit type. Must be a `Routine` or `Task`.');
    }

    const NextPipeline = this.constructor;
    const next = new NextPipeline<Output, Ctx>(this.value, this.options);

    next.prev = this;
    next.root = this.root;
    this.next = next;

    return next;
  }

  abstract async run(context: Ctx): Promise<any>;

  /**
   * Aggregate and partition errors and results into separate collections.
   */
  protected aggregateResult<T>(responses: (Error | T)[]): AggregatedResult<T> {
    const errors: Error[] = [];
    const results: T[] = [];

    responses.forEach(response => {
      if (instanceOf(response, Error)) {
        errors.push(response);
      } else {
        results.push(response);
      }
    });

    return { errors, results };
  }

  protected getWorkUnits(): Runnable<any, any>[] {
    const units: Runnable<any, any>[] = [];
    let current: Pipeline<any, Ctx> | undefined = this.root;

    while (current) {
      if (current.work) {
        units.push(current.work);
      }

      current = current.next;
    }

    return units;
  }
}
