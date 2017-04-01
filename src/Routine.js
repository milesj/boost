/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import chalk from 'chalk';
import readline from 'readline';
import merge from 'lodash/merge';
import isObject from 'lodash/isObject';
import executeSequentially from './executeSequentially';

import type { RoutineConfig, Result, ResultPromise, Task } from './types';

export default class Routine {
  config: RoutineConfig = {};
  console: readline.Interface;
  globalConfig: RoutineConfig = {};
  name: string = '';
  subroutines: Routine[] = [];

  constructor(name: string, defaultConfig: RoutineConfig = {}) {
    if (!name || typeof name !== 'string') {
      throw new TypeError('Routine name must be a valid string.');
    }

    this.config = { ...defaultConfig };
    this.globalConfig = {};
    this.name = name;
    this.subroutines = [];
    this.console = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * Request input from the console.
   */
  askQuestion(question: string): Promise<string> {
    return new Promise((resolve: (string) => void) => {
      this.console.question(chalk.magenta(question), (answer: string) => {
        resolve(answer);
        this.console.close();
      });
    });
  }

  /**
   * Configure the routine after it has been instantiated.
   */
  configure(parentConfig: RoutineConfig, globalConfig: RoutineConfig): this {
    this.globalConfig = globalConfig;

    const config = parentConfig[this.name];

    if (isObject(config)) {
      // $FlowIssue Flow cannot introspect from isObject
      merge(this.config, config);
    }

    return this;
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
   * Output a message to the console.
   */
  log(message: string): this {
    this.console.write(message);

    return this;
  }

  /**
   * Output a title for the current routing phase.
   */
  logTitle(step: string, message: string): this {
    return this.log(`${chalk.gray(`[${step}]`)} ${chalk.reset(message)}`);
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
   * Add a new subroutine within this routine.
   */
  pipe(...routines: Routine[]): this {
    routines.forEach((routine: Routine) => {
      if (routine instanceof Routine) {
        this.subroutines.push(routine.configure(this.config, this.globalConfig));
      } else {
        throw new TypeError('Routine must be an instance of `Routine`.');
      }
    });

    return this;
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
