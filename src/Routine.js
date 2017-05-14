/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Promise from 'bluebird';
import merge from 'lodash/merge';
import isObject from 'lodash/isObject';
import Console from './Console';
import Task from './Task';
import { PENDING } from './constants';

import type {
  Config,
  ConfigValue,
  GlobalConfig,
  Result,
  ResultPromise,
  ResultAccumulator,
  TaskCallback,
} from './types';

export default class Routine extends Task {
  console: Console;
  global: GlobalConfig;
  key: string = '';

  constructor(key: string, title: string, defaultConfig: Config = {}) {
    super(title, null, defaultConfig);

    if (!key || typeof key !== 'string') {
      throw new TypeError('Routine key must be a valid unique string.');
    }

    this.key = key;

    // We cant pass to super, so bind here
    this.action = this.execute.bind(this);

    // We also need to set it back to pending
    this.status = PENDING;
  }

  /**
   * Called once the routine has been configured and is ready to execute.
   */
  bootstrap() {}

  /**
   * Configure the routine after it has been instantiated.
   */
  configure(parentConfig: Config, globalConfig: GlobalConfig, rootConsole: Console): this {
    this.global = globalConfig;
    this.console = rootConsole;

    // Inherit config from parent
    const config = parentConfig[this.key];

    if (isObject(config)) {
      // $FlowIgnore Flow cannot introspect from isObject
      merge(this.config, config);
    }

    // Initialize routine (this must be last!)
    this.bootstrap();

    return this;
  }

  /**
   * Execute the current routine and return a new value.
   * This method *must* be overridden in a subclass.
   */
  execute(value: Result): ResultPromise {
    return value;
  }

  /**
   * Execute a task, a method in the current routine, or a function,
   * with the provided value.
   */
  executeTask = (value: Result, task: Task): ResultPromise => (
    this.wrap(task.run(value, this.context)).finally(() => {
      this.console.render();
    })
  );

  /**
   * Execute subroutines in parralel with a value being passed to each subroutine.
   * A combination promise will be returned as the result.
   */
  parallelizeSubroutines(value: Result = null): ResultPromise {
    // $FlowIgnore
    return Promise.all(this.subroutines.map(routine => this.executeTask(value, routine)));
  }

  /**
   * Execute tasks in parralel with a value being passed to each task.
   * A combination promise will be returned as the result.
   */
  parallelizeTasks(value: Result = null): ResultPromise {
    // $FlowIgnore
    return Promise.all(this.subtasks.map(task => this.executeTask(value, task)));
  }

  /**
   * Add a new subroutine within this routine.
   */
  pipe(...routines: Routine[]): this {
    routines.forEach((routine: Routine) => {
      if (routine instanceof Routine) {
        this.subroutines.push(routine.configure(
          this.config,
          this.global,
          this.console,
        ));

      } else {
        throw new TypeError('Routine must be an instance of `Routine`.');
      }
    });

    return this;
  }

  /**
   * Trigger console processes before and after execution.
   */
  run(value: Result, context: Object = {}): ResultPromise {
    this.console.groupStart(this.key);

    return super.run(value, context).finally(() => {
      this.console.groupStop();
      this.console.render();
    });
  }

  /**
   * Execute processes in sequential order with the output of each
   * task being passed to the next promise in the chain. Utilize the
   * `accumulator` function to execute the list of processes.
   */
  serialize<T>(
    initialValue: Result,
    items: T[],
    accumulator: ResultAccumulator<T>,
  ): ResultPromise {
    return items.reduce((promise: ResultPromise, item: T) => (
      promise.then(value => accumulator(value, item))
    ), Promise.resolve(initialValue));
  }

  /**
   * Execute subroutines in sequential (serial) order.
   */
  serializeSubroutines(value: Result = null): ResultPromise {
    return this.serialize(value, this.subroutines, this.executeTask);
  }

  /**
   * Execute tasks in sequential (serial) order.
   */
  serializeTasks(value: Result = null): ResultPromise {
    return this.serialize(value, this.subtasks, this.executeTask);
  }

  /**
   * Define an individual task.
   */
  task(title: string, action: TaskCallback, config: Config = {}): this {
    if (typeof action !== 'function') {
      throw new Error('Tasks require an executable function.');
    }

    this.subtasks.push(new Task(title, action.bind(this), config));

    return this;
  }

  /**
   * Validate the configuration specific to this routine.
   * This process occurs in the config loading phase.
   */
  static validateConfig(config: { [key: string]: ConfigValue }) {
  }
}
