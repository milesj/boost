/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { frames } from 'elegant-spinner';
import { Struct } from 'optimal';
import {
  STATUS_PENDING,
  STATUS_RUNNING,
  STATUS_SKIPPED,
  STATUS_PASSED,
  STATUS_FAILED,
} from './constants';
import { Context, Status } from './types';

export interface TaskInterface {
  status: Status;
  statusText: string;
  subroutines: TaskInterface[];
  subtasks: TaskInterface[];
  title: string;
  isPending(): boolean;
  isRunning(): boolean;
  isSkipped(): boolean;
  hasFailed(): boolean;
  hasPassed(): boolean;
  run<T>(context: any, initialValue?: T | null): Promise<any>;
  skip(condition?: boolean): this;
  spinner(): string;
}

export type TaskAction<Tx extends Context> = (context: Tx, value: any) => any | Promise<any>;

export default class Task<To extends Struct, Tx extends Context> implements TaskInterface {
  action: TaskAction<Tx> | null = null;

  // @ts-ignore Set after instantiation
  context: Tx;

  frame: number = 0;

  options: To;

  title: string = '';

  status: Status = STATUS_PENDING;

  statusText: string = '';

  subroutines: TaskInterface[] = [];

  subtasks: TaskInterface[] = [];

  constructor(title: string, action: TaskAction<Tx> | null = null, options: Partial<To> = {}) {
    if (!title || typeof title !== 'string') {
      throw new Error('Tasks require a title.');
    }

    if (action !== null && typeof action !== 'function') {
      throw new Error('Tasks require an executable function.');
    }

    this.action = action;
    this.options = {
      // @ts-ignore
      ...options,
    };
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
  run<T>(context: Tx, initialValue: T | null = null): Promise<any> {
    // Don't spread context as to preserve references
    this.context = context;

    if (this.isSkipped() || !this.action) {
      this.status = STATUS_SKIPPED;

      return Promise.resolve(initialValue);
    }

    this.status = STATUS_RUNNING;

    return (
      Promise.resolve(initialValue)
        // @ts-ignore
        .then(value => this.action(context, value))
        .then(
          result => {
            this.status = STATUS_PASSED;
            this.statusText = '';

            return result;
          },
          error => {
            this.status = STATUS_FAILED;

            throw error;
          },
        )
    );
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
  wrap<T>(value: T): Promise<any> {
    return value instanceof Promise ? value : Promise.resolve(value);
  }
}
