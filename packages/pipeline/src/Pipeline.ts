import { Event } from '@boost/event';
import { Contract } from '@boost/common';
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

  constructor(value: Input, options?: Options) {
    super(options);

    this.value = value;
  }

  /**
   * Run and process the entire work unit queue.
   */
  abstract async run(context: Ctx): Promise<any>;
}
