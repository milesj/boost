import kebabCase from 'lodash/kebabCase';
import { Contract } from '@boost/common';
import { Debugger, createDebugger } from '@boost/debug';
import { Event } from '@boost/event';
import Context from './Context';
import WorkUnit from './WorkUnit';

export default abstract class Pipeline<
  Options extends object,
  Ctx extends Context,
  Input,
  Output
> extends Contract<Options> {
  readonly context: Ctx;

  readonly value: Input;

  readonly onRun = new Event<[Input]>('run');

  readonly onRunWorkUnit = new Event<[WorkUnit<any, Input, Output>, Input]>('run-work-unit');

  protected debug: Debugger;

  constructor(context: Ctx, value: Input, options?: Options) {
    super(options);

    this.context = context;
    this.value = value;
    this.debug = createDebugger(kebabCase(this.constructor.name));

    this.debug('Instantiating pipeline');
  }

  /**
   * Run and process the entire work unit queue.
   */
  abstract async run(): Promise<any>;
}
