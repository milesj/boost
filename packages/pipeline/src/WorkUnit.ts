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
import { Action, Status, Runnable } from './types';

export interface WorkUnitMetadata {
  depth: number;
  index: number;
  startTime: number;
  stopTime: number;
}

export default abstract class WorkUnit<Options extends object, Input, Output = Input>
  extends Contract<Options>
  implements Runnable<Input, Output> {
  action: Action<any, Input, Output>;

  title: string;

  metadata: WorkUnitMetadata = {
    depth: 0,
    index: 0,
    startTime: 0,
    stopTime: 0,
  };

  onFail = new Event<[Error | null]>('fail');

  onPass = new Event<[unknown]>('pass');

  onRun = new BailEvent<[unknown]>('run');

  onSkip = new Event<[unknown]>('skip');

  output: unknown = '';

  parent: WorkUnit<any, any, any> | null = null;

  status: Status = STATUS_PENDING;

  statusText: string = '';

  constructor(title: string, action: Action<any, Input, Output>, options?: Options) {
    super(options);

    if (!title || typeof title !== 'string') {
      throw new Error('Tasks require a title.');
    }

    if (action !== null && typeof action !== 'function') {
      throw new Error('Tasks require an executable function.');
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

    if (skip || this.isSkipped()) {
      this.status = STATUS_SKIPPED;
      this.onSkip.emit([value]);

      return Promise.resolve(value);
    }

    this.status = STATUS_RUNNING;
    this.metadata.startTime = Date.now();

    try {
      this.output = await this.action(context, value);
      this.status = STATUS_PASSED;
      this.metadata.stopTime = Date.now();
      this.onPass.emit([this.output]);
    } catch (error) {
      this.status = STATUS_FAILED;
      this.metadata.stopTime = Date.now();
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
