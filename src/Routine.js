/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import isObject from './helpers/isObject';
import executeSequentially from './helpers/executeSequentially';

import type { RoutineConfig, Result, ResultPromise, Task } from './types';

export default class Routine {
  name: string = '';
  config: RoutineConfig = {};
  subroutines: Routine[] = [];

  constructor(name: string, config: RoutineConfig = {}) {
    this.name = name;
    this.config = { ...config };
    this.subroutines = [];
  }

  /**
   * Add a new subroutine within this routine.
   */
  chain(routine: Routine): this {
    if (!(routine instanceof Routine)) {
      throw new TypeError('Routine must be an instance of `Routine`.');
    }

    // Inherit configurations if they exists
    const nestedConfig = this.config[routine.name];

    if (isObject(nestedConfig)) {
      // $FlowIssue isObject check not persisting here
      routine.configure(nestedConfig);
    }

    this.subroutines.push(routine);

    return this;
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
   * Execute a subroutine wih the provided value.
   */
  executeSubroutine(value: Result<*>, routine: Routine): ResultPromise<*> {
    return routine.execute(value);
  }

  /**
   * Execute a task (usually a method in the current routine class)
   * with the provided value. If the result is not a promise,
   * convert it to one.
   */
  executeTask(value: Result<*>, task: Task): ResultPromise<*> {
    const nextValue = task.call(this, value);

    if (nextValue instanceof Promise) {
      return nextValue;

    } else if (nextValue instanceof Error) {
      return Promise.reject(nextValue);
    }

    return Promise.resolve(nextValue);
  }

  /**
   * Execute subroutines in parralel with a value being passed to each subroutine.
   * A combination promise will be returned as the result.
   */
  parallelizeSubroutines(value: Result<*>): ResultPromise<*> {
    try {
      return Promise.all(this.subroutines.map(routine => (
        this.executeSubroutine(value, routine)
      )));
    } catch (e) {
      throw e;
    }
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
   * Execute subroutines in sequential (serial) order.
   */
  serializeSubroutines(value: Result<*>): ResultPromise<*> {
    try {
      return executeSequentially(this.subroutines, value, this.executeSubroutine);
    } catch (e) {
      throw e;
    }
  }

  /**
   * Execute tasks in sequential (serial) order.
   */
  serializeTasks(value: Result<*>, tasks: Task[]): ResultPromise<*> {
    try {
      return executeSequentially(tasks, value, this.executeTask);
    } catch (e) {
      throw e;
    }
  }
}
