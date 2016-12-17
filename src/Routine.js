/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import executeSequentially from './helpers/executeSequentially';

import type { RoutineConfig, Result, ResultPromise, Task } from './types';

export default class Routine {
  config: RoutineConfig = {};

  constructor(config: RoutineConfig = {}) {
    this.config = { ...config };
  }

  /**
   * Configure the routine after it has been instantiated.
   */
  configure(config: RoutineConfig) {
    Object.assign(this.config, config);
  }

  /**
   * Execute the current routine and return a new value.
   * This method *must* be overridden in a subclass.
   */
  execute(value: Result<*>): ResultPromise<*> {
    return Promise.resolve(value);
  }

  /**
   * Execute a task (usually a method in the current routine class)
   * with the provided value. If the result is not a promise,
   * convert it to one.
   */
  executeTask(value: Result<*>, task: Task): ResultPromise<*> {
    const nextValue = task(value);

    if (nextValue instanceof Promise) {
      return nextValue;

    } else if (nextValue instanceof Error) {
      return Promise.reject(nextValue);

    } else if (nextValue instanceof Function) {
      return new Promise(nextValue);
    }

    return Promise.resolve(nextValue);
  }

  /**
   * Execute tasks in parralel with a value being passed to each task.
   * A combination promise will be returned as the result.
   */
  parallelizeTasks(value: Result<*>, tasks: Task[]): ResultPromise<*> {
    try {
      return Promise.all(tasks.map(task => this.executeTask(value, task)));
    } catch (e) {
      throw e;
    }
  }

  /**
   * Execute tasks in sequential (serial) order with the output of each
   * task being passed to the next one in the chain.
   */
  serializeTasks(value: Result<*>, tasks: Task[]): ResultPromise<*> {
    try {
      return executeSequentially(tasks, value, this.executeTask);
    } catch (e) {
      throw e;
    }
  }
}
