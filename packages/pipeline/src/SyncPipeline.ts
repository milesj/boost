import { Contract } from '@boost/common';
import Context from './Context';
import { Action, Runnable } from './types';
import createWorkUnit from './createWorkUnit';

export default abstract class SyncPipeline<
  Options extends object,
  Input,
  Ctx extends Context = Context
> extends Contract<Options> {
  next?: SyncPipeline<Options, any, Ctx>;

  prev?: SyncPipeline<Options, any, Ctx>;

  root: SyncPipeline<Options, any, Ctx>;

  work?: Runnable<Input, any>;

  value: Input;

  constructor(value: Input, options?: Options) {
    super(options);

    this.value = value;
    this.root = this;
  }

  /**
   * Pipe a work unit to be ran with the return value of the previous work unit.
   */
  pipe<Output>(
    title: string,
    action: Action<Ctx, Input, Output>,
  ): SyncPipeline<Options, Output, Ctx>;
  pipe<Output>(workUnit: Runnable<Input, Output>): SyncPipeline<Options, Output, Ctx>;
  pipe<Output>(
    titleOrWorkUnit: string | Runnable<Input, Output>,
    action?: Action<Ctx, Input, Output>,
  ): SyncPipeline<Options, Output, Ctx> {
    this.work = createWorkUnit(titleOrWorkUnit, action);

    // @ts-ignore How to type/call this?
    const next = new this.constructor(this.value, this.options);

    next.prev = this;
    next.root = this.root;
    this.next = next;

    return next;
  }

  /**
   * Traverse the linked list to return a list of work units in defined order.
   */
  protected getWorkUnits(): Runnable<any, any>[] {
    const units: Runnable<any, any>[] = [];
    let current: SyncPipeline<Options, any, Ctx> | undefined = this.root;

    while (current) {
      if (current.work) {
        units.push(current.work);
      }

      current = current.next;
    }

    return units;
  }

  /**
   * Run and process the entire work unit queue.
   */
  abstract async run(context: Ctx): Promise<any>;
}
