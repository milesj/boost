import Context from './Context';
import Pipeline from './Pipeline';
import WorkUnit from './WorkUnit';
import createWorkUnit from './createWorkUnit';
import { Action } from './types';

export default abstract class SyncPipeline<
  Options extends object,
  Ctx extends Context,
  Input
> extends Pipeline<Options, Ctx, Input, unknown> {
  next?: SyncPipeline<Options, Ctx, any>;

  root: SyncPipeline<Options, Ctx, any> = this;

  work?: WorkUnit<any, Input, unknown>;

  /**
   * Pipe a work unit to be ran with the return value of the previous work unit.
   */
  pipe<Output>(
    title: string,
    action: Action<Ctx, Input, Output>,
    scope?: unknown,
  ): SyncPipeline<Options, Ctx, Output>;
  pipe<Output>(workUnit: WorkUnit<any, Input, Output>): SyncPipeline<Options, Ctx, Output>;
  pipe<Output>(
    titleOrWorkUnit: string | WorkUnit<any, Input, Output>,
    action?: Action<Ctx, Input, Output>,
    scope?: unknown,
  ): SyncPipeline<Options, Ctx, Output> {
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
  protected getWorkUnits(): WorkUnit<any, Input, any>[] {
    const units: WorkUnit<any, Input, unknown>[] = [];
    let current: SyncPipeline<Options, Ctx, any> | undefined = this.root;

    while (current) {
      if (current.work) {
        units.push(current.work);
      }

      current = current.next;
    }

    return units;
  }
}
