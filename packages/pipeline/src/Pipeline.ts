import { Contract } from '@boost/common';
import { Debugger, createDebugger } from '@boost/debug';
import { Event } from '@boost/event';
import Context from './Context';
import WorkUnit from './WorkUnit';

export default abstract class Pipeline<
  Options extends object,
  Input,
  Output,
  Ctx extends Context = Context
> extends Contract<Options> {
  value: Input;

  readonly onRun = new Event<[Input]>('run');

  readonly onRunWorkUnit = new Event<[WorkUnit<any, Input, Output>, Input]>('run-work-unit');

  protected debug: Debugger;

  constructor(value: Input, options?: Options) {
    super(options);

    const name = this.constructor.name
      .replace(/[A-Z]/gu, match => `-${match.toLowerCase()}`)
      .slice(1);

    this.value = value;
    this.debug = createDebugger(name);

    this.debug('Instantiating pipeline');
  }

  /**
   * Run and process the entire work unit queue.
   */
  abstract async run(context: Ctx): Promise<any>;
}
