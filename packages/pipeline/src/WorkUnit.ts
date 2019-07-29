import { Contract } from '@boost/common';
import { Event, BailEvent } from '@boost/event';
import Context from './Context';
import {
  STATUS_PENDING,
  STATUS_RUNNING,
  STATUS_SKIPPED,
  STATUS_PASSED,
  STATUS_FAILED,
} from './constants';
import { Action, Status, Hierarchical, Runnable } from './types';

export default abstract class WorkUnit<Options extends object, Input, Output = Input>
  extends Contract<Options>
  implements Runnable<Input, Output>, Hierarchical {
  depth: number = 0;

  index: number = 0;

  output?: Output;

  startTime: number = 0;

  statusText: string = '';

  stopTime: number = 0;

  readonly onFail = new Event<[Error | null]>('fail');

  readonly onPass = new Event<[Output]>('pass');

  readonly onRun = new BailEvent<[Input]>('run');

  readonly onSkip = new Event<[Input]>('skip');

  readonly title: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private action: Action<any, Input, Output>;

  private status: Status = STATUS_PENDING;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(title: string, action: Action<any, Input, Output>, options?: Options) {
    super(options);

    if (!title || typeof title !== 'string') {
      throw new Error('Work units require a title.');
    }

    if (action !== null && typeof action !== 'function') {
      throw new Error('Work units require an executable function.');
    }

    this.action = action;
    this.status = STATUS_PENDING;
    this.title = title;
  }

  /**
   * Return true if the task failed when executing.
   */
  hasFailed(): boolean {
    return this.status === STATUS_FAILED;
  }

  /**
   * Return true if the task executed successfully.
   */
  hasPassed(): boolean {
    return this.status === STATUS_PASSED;
  }

  /**
   * Return true if the task has been completed in any form.
   */
  isComplete(): boolean {
    return this.hasPassed() || this.hasFailed() || this.isSkipped();
  }

  /**
   * Return true if the task has not been executed yet.
   */
  isPending(): boolean {
    return this.status === STATUS_PENDING;
  }

  /**
   * Return true if the task is currently running.
   */
  isRunning(): boolean {
    return this.status === STATUS_RUNNING;
  }

  /**
   * Return true if the task was or will be skipped.
   */
  isSkipped(): boolean {
    return this.status === STATUS_SKIPPED;
  }

  /**
   * Run the current task by executing it and performing any before and after processes.
   */
  async run<Ctx extends Context>(context: Ctx, value: Input): Promise<Output> {
    const skip = this.onRun.emit([value]);
    const runner: Action<Ctx, Input, Output> = this.action;

    if (skip || this.isSkipped() || !runner) {
      this.status = STATUS_SKIPPED;
      this.onSkip.emit([value]);

      // @ts-ignore Allow input as output
      return Promise.resolve(value);
    }

    this.status = STATUS_RUNNING;
    this.startTime = Date.now();

    try {
      this.output = await runner(context, value, this);
      this.status = STATUS_PASSED;
      this.stopTime = Date.now();
      this.onPass.emit([this.output]);
    } catch (error) {
      this.status = STATUS_FAILED;
      this.stopTime = Date.now();
      this.onFail.emit([error]);

      throw error;
    }

    this.statusText = '';

    return this.output;
  }

  /**
   * Mark a task as skipped if the condition is true.
   */
  skip(condition: boolean = true): this {
    if (condition) {
      this.status = STATUS_SKIPPED;
    }

    return this;
  }
}
