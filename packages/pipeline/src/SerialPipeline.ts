import Context from './Context';
import Pipeline from './Pipeline';
import WorkUnit from './WorkUnit';
import createWorkUnit from './createWorkUnit';
import { Action } from './types';

export default abstract class SerialPipeline<
  Options extends object,
  Ctx extends Context,
  Input = unknown,
  Output = Input
> extends Pipeline<Options, Ctx, Input, Output> {
  // Unknown does not work here as the output type changes for each
  // node in the linked list chain.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  root: SerialPipeline<Options, Ctx, any> = this;

  /**
   * Pipe a work unit to be ran with the return value of the previous work unit.
   */
  pipe<Output>(
    title: string,
    action: Action<Ctx, Input, Output>,
    scope?: unknown,
  ): SerialPipeline<Options, Ctx, Output>;
  pipe<Output>(workUnit: WorkUnit<{}, Input, Output>): SerialPipeline<Options, Ctx, Output>;
  pipe<Output>(
    titleOrWorkUnit: string | WorkUnit<{}, Input, Output>,
    action?: Action<Ctx, Input, Output>,
    scope?: unknown,
  ): SerialPipeline<Options, Ctx, Output> {
    const workUnit = createWorkUnit(titleOrWorkUnit, action, scope);

    workUnit.depth = this.depth;
    workUnit.index = this.getWorkUnits().length;

    this.root.work.push(workUnit);

    // @ts-expect-error
    const next = new this.constructor(this.context, this.value, this.options);

    next.depth = this.depth;
    next.root = this.root;

    return next;
  }

  /**
   * Traverse the linked list to return a list of work units in defined order.
   */
  getWorkUnits(): WorkUnit<{}, Input, Output>[] {
    return this.root.work;
  }

  /**
   * Run and process the work units synchronously.
   */
  abstract async run(): Promise<Output>;
}
