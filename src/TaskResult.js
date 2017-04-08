/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import spinner from 'elegant-spinner';
import { PENDING, RUNNING, SKIPPED, PASSED, FAILED } from './constants';

import type { Status } from './types';

export default class TaskResult {
  spinnerFrames: ?() => string = null;
  routines: TaskResult[] = [];
  status: Status;
  tasks: TaskResult[] = [];
  title: string;

  constructor(title: string, status: Status) {
    this.title = title;
    this.status = status;
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
   * Create a spinner and update the frames each call.
   */
  spinner(): string {
    if (!this.spinnerFrames) {
      this.spinnerFrames = spinner();
    }

    return this.spinnerFrames();
  }
}
