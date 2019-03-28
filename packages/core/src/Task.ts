import { Event, BailEvent } from '@boost/event';
import Context from './Context';
import {
  STATUS_PENDING,
  STATUS_RUNNING,
  STATUS_SKIPPED,
  STATUS_PASSED,
  STATUS_FAILED,
} from './constants';
import { Status } from './types';

export type TaskAction<Ctx extends Context> = (
  context: Ctx,
  value: any,
  task: Task<Ctx>,
) => unknown | Promise<unknown>;

export interface TaskMetadata {
  depth: number;
  index: number;
  startTime: number;
  stopTime: number;
}

export default class Task<Ctx extends Context> {
  action: TaskAction<Ctx>;

  // @ts-ignore Set after instantiation
  context: Ctx;

  title: string;

  metadata: TaskMetadata = {
    depth: 0,
    index: 0,
    startTime: 0,
    stopTime: 0,
  };

  onFail: Event<[Error | null]>;

  onPass: Event<[unknown]>;

  onRun: BailEvent<[unknown]>;

  onSkip: Event<[unknown]>;

  output: unknown = '';

  parent: Task<Ctx> | null = null;

  status: Status = STATUS_PENDING;

  statusText: string = '';

  constructor(title: string, action: TaskAction<Ctx>) {
    if (!title || typeof title !== 'string') {
      throw new Error('Tasks require a title.');
    }

    if (action !== null && typeof action !== 'function') {
      throw new Error('Tasks require an executable function.');
    }

    this.action = action;
    this.status = STATUS_PENDING;
    this.title = title;
    this.onFail = new Event('fail');
    this.onPass = new Event('pass');
    this.onRun = new BailEvent('run');
    this.onSkip = new Event('skip');
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
  async run(context: Ctx, value: any): Promise<any> {
    this.setContext(context);

    const skip = this.onRun.emit([value]);

    if (skip || this.isSkipped()) {
      this.status = STATUS_SKIPPED;
      this.onSkip.emit([value]);

      return Promise.resolve(value);
    }

    this.status = STATUS_RUNNING;
    this.metadata.startTime = Date.now();

    try {
      this.output = await this.action(context, value, this);
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
   * Set the context to be passed around.
   */
  setContext(context: Ctx): this {
    this.context = context;

    return this;
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

  /**
   * Temporary bridge until v2.
   */
  on(eventName: string, listener: any) {
    switch (eventName) {
      case 'fail':
        this.onFail.listen(listener);
        break;
      case 'pass':
        this.onPass.listen(listener);
        break;
      case 'run':
        this.onRun.listen(listener);
        break;
      case 'skip':
        this.onSkip.listen(listener);
        break;
      default:
        throw new Error(`Unsupported event ${eventName}.`);
    }

    return this;
  }
}
