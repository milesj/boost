import kebabCase from 'lodash/kebabCase';
import { Contract } from '@boost/common';
import { Debugger, createDebugger } from '@boost/debug';
import { Event } from '@boost/event';
import Context from './Context';
import WorkUnit from './WorkUnit';
import { Hierarchical } from './types';

export default abstract class Pipeline<Options extends object, Ctx extends Context, Input, Output>
  extends Contract<Options>
  implements Hierarchical {
  depth: number = 0;

  index: number = 0;

  readonly context: Ctx;

  readonly debug: Debugger;

  readonly value: Input;

  // Emits before work units are ran
  readonly onRun = new Event<[Input]>('run');

  // Emits before a single work unit is ran
  readonly onRunWorkUnit = new Event<[WorkUnit<any, Input, Output>, Input]>('run-work-unit');

  protected work: WorkUnit<any, Input, Output>[] = [];

  constructor(context: Ctx, value: Input, options?: Options) {
    super(options);

    this.context = context;
    this.value = value;
    this.debug = createDebugger(kebabCase(this.constructor.name));

    this.debug('Instantiating pipeline');
  }

  /**
   * Return a list of registered work units for the current pipeline.
   */
  getWorkUnits(): WorkUnit<any, Input, any>[] {
    return this.work;
  }
}
