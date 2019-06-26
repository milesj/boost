import Context from './Context';
import Pipeline from './Pipeline';
import WorkUnit from './WorkUnit';
import createWorkUnit from './createWorkUnit';
import { Action } from './types';

export default abstract class SyncPipeline<
  Options extends object,
  Input,
  Ctx extends Context = Context
> extends Pipeline<Options, Input, unknown, Ctx> {
  next?: SyncPipeline<Options, any, Ctx>;

  root: SyncPipeline<Options, any, Ctx> = this;

  work?: WorkUnit<any, Input, unknown>;

  /**
   * Pipe a work unit to be ran with the return value of the previous work unit.
   */
  pipe<Output>(
    title: string,
    action: Action<Ctx, Input, Output>,
    scope?: unknown,
  ): SyncPipeline<Options, Output, Ctx>;
  pipe<Output>(workUnit: WorkUnit<any, Input, Output>): SyncPipeline<Options, Output, Ctx>;
  pipe<Output>(
    titleOrWorkUnit: string | WorkUnit<any, Input, Output>,
    action?: Action<Ctx, Input, Output>,
    scope?: unknown,
  ): SyncPipeline<Options, Output, Ctx> {
    this.work = createWorkUnit(titleOrWorkUnit, action, scope);

    // @ts-ignore How to type/call this?
    const next = new this.constructor(this.value, this.options);

    next.root = this.root;
    this.next = next;

    return next;
  }

  /**
   * Traverse the linked list to return a list of work units in defined order.
   */
  protected getWorkUnits(): WorkUnit<any, Input, unknown>[] {
    const units: WorkUnit<any, Input, unknown>[] = [];
    let current: SyncPipeline<Options, any, Ctx> | undefined = this.root;

    while (current) {
      if (current.work) {
        units.push(current.work);
      }

      current = current.next;
    }

    return units;
  }
}
