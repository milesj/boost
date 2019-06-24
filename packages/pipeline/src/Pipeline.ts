/* eslint-disable */

import Context from './Context';
import Task from './Task';
import WorkUnit from './WorkUnit';
import { Action, Runnable } from './types';

export default abstract class Pipeline<Input, Ctx extends Context = Context> {
  next?: Pipeline<any, Ctx>;

  prev?: Pipeline<any, Ctx>;

  root: Pipeline<any, Ctx>;

  work?: Runnable<Input, any>;

  value: Input;

  constructor(value: Input) {
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
    const next = new NextPipeline<Output, Ctx>();

    next.prev = this;
    next.root = this.root;
    this.next = next;

    return next;
  }

  abstract async run(context: Ctx): Promise<any>;

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
