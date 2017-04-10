/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Promise from 'bluebird';
import { frames } from 'elegant-spinner';
import { PENDING, RUNNING, SKIPPED, PASSED, FAILED } from './constants';

import type { Config, Result, ResultPromise, Status, TaskCallback } from './types';

export default class Task {
  action: ?TaskCallback = null;
  config: Config = {};
  context: Object = {};
  frame: number = 0;
  title: string = '';
  status: Status = PENDING;
  subroutines: Task[] = [];
  subtasks: Task[] = [];

  constructor(title: string, action: ?TaskCallback = null, defaultConfig: Config = {}) {
    if (!title || typeof title !== 'string') {
      throw new Error('Tasks require a title.');
    }

    if (action !== null && typeof action !== 'function') {
      throw new Error('Tasks require an executable function.');
    }

    this.action = action;
    this.config = { ...defaultConfig };
    this.status = action ? PENDING : SKIPPED;
    this.title = title;
  }

  /**
   * Return true if the task failed when executing.
   */
  hasFailed(): boolean {
    return (this.status === FAILED);
  }

  /**
   * Return true if the task executed successfully.
   */
  hasPassed(): boolean {
    return (this.status === PASSED);
  }

  /**
   * Return true if the task has not been executed yet.
   */
  isPending(): boolean {
    return (this.status === PENDING);
  }

  /**
   * Return true if the task is currently running.
   */
  isRunning(): boolean {
    return (this.status === RUNNING);
  }

  /**
   * Return true if the task was or will be skipped.
   */
  isSkipped(): boolean {
    return (this.status === SKIPPED);
  }

  /**
   * Run the current task by executing it and performing any
   * before and after processes.
   */
  run(value: Result, context: Object = {}): ResultPromise {
    this.context = context;

    if (this.isSkipped() || !this.action) {
      return Promise.resolve(value);
    }

    this.status = RUNNING;

    return new Promise((resolve: *) => {
      // $FlowIgnore We check above
      resolve(this.action(value, context));
    }).then(
      (result: Result) => {
        this.status = PASSED;

        return result;
      },
      (error: Error) => {
        this.status = FAILED;

        throw error;
      },
    );
  }

  /**
   * Mark a task as skipped if the condition is true.
   */
  skip(condition: boolean = true): this {
    if (condition) {
      this.status = SKIPPED;
    }

    return this;
  }

  /**
   * Create a spinner and update the frames each call.
   */
  spinner(): string {
    // eslint-disable-next-line no-plusplus
    this.frame = ++this.frame % frames.length;

    return frames[this.frame];
  }

  /**
   * Wrap a value in a promise if it has not already been.
   */
  wrap(value: Result): ResultPromise {
    return (value instanceof Promise) ? value : Promise.resolve(value);
  }
}
