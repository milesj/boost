/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Promise from 'bluebird';
import TaskResult from './TaskResult';
import { PENDING, RUNNING, SKIPPED, PASSED, FAILED } from './constants';

import type { Result, ResultPromise, Status, TaskCallback } from './types';

export default class Task {
  action: TaskCallback;
  time: number = 0;
  title: string = '';
  status: Status = PENDING;

  constructor(title: string, action: TaskCallback) {
    if (!title || typeof title !== 'string') {
      throw new Error('Tasks require a title.');
    }

    if (!action || typeof action !== 'function') {
      throw new Error('Tasks require an executable function.');
    }

    this.title = title;
    this.action = action;
  }

  /**
   * Run the current task by executing it and performing any
   * before and after processes.
   */
  run(value: Result): ResultPromise {
    if (this.status === SKIPPED) {
      return Promise.resolve(value);
    }

    this.status = RUNNING;

    return new Promise((resolve: *) => {
      resolve(this.action(value));
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
   * Generate a result to use in CLI output.
   */
  toResult(): TaskResult {
    return new TaskResult(this.title, this.status);
  }

  /**
   * Wrap a value in a promise if it has not already been.
   */
  wrap(value: Result): ResultPromise {
    return (value instanceof Promise) ? value : Promise.resolve(value);
  }
}
