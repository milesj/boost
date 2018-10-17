/**
 * @copyright   2017-2018, Miles Johnson
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

export type TaskAction<Ctx extends Context> = (
  context: Ctx,
  value: any,
  task: Task<Ctx>,
) => any | Promise<any>;

export default class Task<Ctx extends Context> {
  action: TaskAction<Ctx> | null = null;

  // @ts-ignore Set after instantiation
  context: Ctx;

  title: string = '';

  output: string = '';

  parent: Task<Ctx> | null = null;

  startTime: number = 0;

  status: Status = STATUS_PENDING;

  statusText: string = '';

  stopTime: number = 0;

  tasks: Task<Ctx>[] = [];

  constructor(title: string, action: TaskAction<Ctx> | null = null) {
    if (!title || typeof title !== 'string') {
      throw new Error('Tasks require a title.');
    }

    if (action !== null && typeof action !== 'function') {
      throw new Error('Tasks require an executable function.');
    }

    this.action = action;
    this.status = action ? STATUS_PENDING : STATUS_SKIPPED;
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
  async run<T>(context: Ctx, initialValue?: T): Promise<any> {
    this.setContext(context);

    if (this.isSkipped() || !this.action) {
      this.status = STATUS_SKIPPED;

      return Promise.resolve(initialValue);
    }

    this.status = STATUS_RUNNING;
    this.startTime = Date.now();

    try {
      this.output = await this.action(context, initialValue, this);
      this.status = STATUS_PASSED;
      this.stopTime = Date.now();
    } catch (error) {
      this.status = STATUS_FAILED;
      this.stopTime = Date.now();

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
