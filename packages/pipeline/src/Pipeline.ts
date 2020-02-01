import kebabCase from 'lodash/kebabCase';
import { Contract } from '@boost/common';
import { Debugger, createDebugger } from '@boost/debug';
import { Event } from '@boost/event';
import Context from './Context';
import WorkUnit from './WorkUnit';
import { debug } from './constants';
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
  readonly onRunWorkUnit = new Event<[WorkUnit<{}, Input, Output>, Input]>('run-work-unit');

  protected work: WorkUnit<{}, Input, Output>[] = [];

  constructor(context: Ctx, value?: Input, options?: Options) {
    super(options);

    const { name } = this.constructor;

    this.context = context;
    this.debug = createDebugger(kebabCase(name));

    // This is technically invalid, but we want to allow optional values.
    // Luckily the input type defaults to `unknown`, so it forces consumers to validate.
    // @ts-ignore
    this.value = value;

    this.debug('Instantiating pipeline');

    debug('Creating %s pipeline', name.toLowerCase().replace('pipeline', ''));
  }

  /**
   * Return a list of registered work units for the current pipeline.
   */
  getWorkUnits(): WorkUnit<{}, Input, Output>[] {
    return this.work;
  }
}
