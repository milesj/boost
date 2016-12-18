/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import isObject from 'lodash/isObject';
import executeSequentially from './executeSequentially';

import type { RoutineConfig, Result, ResultPromise, Task } from './types';

export default class Routine {
  name: string = '';
  config: RoutineConfig = {};
  subroutines: Routine[] = [];

  constructor(name: string, config: RoutineConfig = {}) {
    if (!name || typeof name !== 'string') {
      throw new TypeError('Routine name must be a valid string.');
    }

    this.name = name;
    this.config = { ...config };
    this.subroutines = [];
  }

  /**
   * Add a new subroutine within this routine.
   */
  chain(...routines: Routine[]): this {
    routines.forEach((routine: Routine) => {
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
    });

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
  execute(value: Result<*>): Result<*> {
    return value;
  }

  /**
   * Execute a subroutine wih the provided value.
   */
  executeSubroutine(value: Result<*>, routine: Routine): Result<*> {
    return routine.execute(value);
  }

  /**
   * Execute a task (a method in the current routine) with the provided value.
   */
  executeTask(value: Result<*>, task: Task<*>): Result<*> {
    return task.call(this, value);
  }

  /**
   * Execute subroutines in parralel with a value being passed to each subroutine.
   * A combination promise will be returned as the result.
   */
  parallelizeSubroutines(value: Result<*>): ResultPromise<*> {
    return Promise.all(this.subroutines.map(routine => this.executeSubroutine(value, routine)));
  }

  /**
   * Execute tasks in parralel with a value being passed to each task.
   * A combination promise will be returned as the result.
   */
  parallelizeTasks(value: Result<*>, tasks: Task<*>[]): ResultPromise<*> {
    return Promise.all(tasks.map(task => this.executeTask(value, task)));
  }

  /**
   * Execute subroutines in sequential (serial) order.
   */
  serializeSubroutines(value: Result<*>): ResultPromise<*> {
    return executeSequentially(value, this.subroutines, this.executeSubroutine);
  }

  /**
   * Execute tasks in sequential (serial) order.
   */
  serializeTasks(value: Result<*>, tasks: Task<*>[]): ResultPromise<*> {
    return executeSequentially(value, tasks, this.executeTask);
  }
}
