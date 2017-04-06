/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Promise from 'bluebird';
import { PENDING, SKIPPED, PASSED, FAILED } from './constants';

import type { Result, ResultPromise, Status, TaskCallback, TreeNode } from './types';

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
   * Return true if this task has failed when executing.
   */
  hasFailed(): boolean {
    return (this.status === FAILED);
  }

  /**
   * Return true if this task has been executed successfully.
   */
  hasPassed(): boolean {
    return (this.status === PASSED);
  }

  /**
   * Return true if this task has not been executed yet.
   */
  isPending(): boolean {
    return (this.status === PENDING);
  }

  /**
   * Return true if this task will be skipped.
   */
  isSkipped(): boolean {
    return (this.status === SKIPPED);
  }

  /**
   * Run the current task by executing it and performing any
   * before and after processes.
   */
  run(value: Result): ResultPromise {
    this.time = Date.now();

    if (this.isSkipped()) {
      return Promise.resolve(value);
    }

    try {
      this.status = PASSED;

      return this.wrapPromise(this.action(value));

    } catch (error) {
      this.status = FAILED;

      return Promise.reject(error);
    }
  }

  /**
   * Generate a tree structure to use in CLI output.
   */
  toTree(): TreeNode {
    return {
      time: Date.now(),
      title: this.title,
      status: this.status,
    };
  }

  /**
   * Wrap a value in a promise if it has not already been.
   */
  wrapPromise(value: Result): ResultPromise {
    return (value instanceof Promise || value instanceof global.Promise)
      ? value
      : Promise.resolve(value);
  }
}
