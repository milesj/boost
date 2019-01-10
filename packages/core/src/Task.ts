/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Context from './Context';
import {
  STATUS_PENDING,
  STATUS_RUNNING,
  STATUS_SKIPPED,
  STATUS_PASSED,
  STATUS_FAILED,
} from './constants';
import { Status } from './types';
import Emitter from './Emitter';

export type TaskAction<Ctx extends Context> = (
  context: Ctx,
  value: any,
  task: Task<Ctx>,
) => any | Promise<any>;

export interface TaskMetadata {
  depth: number;
  index: number;
  startTime: number;
  stopTime: number;
}

export default class Task<Ctx extends Context> extends Emitter {
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

  output: string = '';

  parent: Task<Ctx> | null = null;

  status: Status = STATUS_PENDING;

  statusText: string = '';

  tasks: Task<Ctx>[] = [];

  constructor(title: string, action: TaskAction<Ctx>) {
    super();

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
  async run(context: Ctx, value: any): Promise<any> {
    this.setContext(context);
    this.emit('run', [value]);

    if (this.isSkipped()) {
      this.status = STATUS_SKIPPED;
      this.emit('skip', [value]);

      return Promise.resolve(value);
    }

    this.status = STATUS_RUNNING;
    this.metadata.startTime = Date.now();

    try {
      this.output = await this.action(context, value, this);
      this.status = STATUS_PASSED;
      this.metadata.stopTime = Date.now();
      this.emit('pass', [this.output]);
    } catch (error) {
      this.status = STATUS_FAILED;
      this.metadata.stopTime = Date.now();
      this.emit('fail', [error]);

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
}
