/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Promise from 'bluebird';
import execa from 'execa';
import merge from 'lodash/merge';
import Task from './Task';
import Tool from './Tool';
import isObject from './helpers/isObject';
import { STATUS_PENDING, RESTRICTED_CONFIG_KEYS } from './constants';

import type {
  Config,
  Result,
  ResultPromise,
  ResultAccumulator,
  TaskCallback,
} from './types';

export default class Routine extends Task {
  key: string = '';

  tool: Tool<*>;

  constructor(key: string, title: string, defaultConfig?: Config = {}) {
    super(title, null, defaultConfig);

    if (!key || typeof key !== 'string') {
      throw new Error('Routine key must be a valid unique string.');

    } else if (RESTRICTED_CONFIG_KEYS.includes(key)) {
      throw new Error(`Invalid routine key "${key}". This key is reserved.`);
    }

    this.key = key;

    // We cant pass to super, so bind here
    this.action = this.execute.bind(this);

    // We also need to set it back to pending
    this.status = STATUS_PENDING;
  }

  /**
   * Called once the routine has been configured and is ready to execute.
   */
  bootstrap() {}

  /**
   * Configure the routine after it has been instantiated.
   */
  configure(parent: Routine): this {
    this.context = parent.context;
    this.tool = parent.tool;

    // Inherit config from parent
    const config = parent.config[this.key];

    if (isObject(config)) {
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
  execute(value: Result, context?: Object = {}): ResultPromise {
    return value;
  }

  /**
   * Execute a command with the given arguments and pass the results through a promise.
   */
  executeCommand(command: string, args?: string[] = [], options?: Object = {}): ResultPromise {
    /* istanbul ignore next */
    return this.wrap(execa.stdout(command, args, options));
  }

  /**
   * Execute a task, a method in the current routine, or a function,
   * with the provided value.
   */
  executeTask = (value: Result, task: Task): ResultPromise => (
    this.wrap(task.run(value, this.context)).finally(() => {
      this.tool.render();
    })
  );

  /**
   * Execute subroutines in parralel with a value being passed to each subroutine.
   * A combination promise will be returned as the result.
   */
  parallelizeSubroutines(value: Result): ResultPromise {
    // $FlowIgnore Native Promise.all() type definitions do not match Bluebird
    return Promise.all(this.subroutines.map(routine => this.executeTask(value, routine)));
  }

  /**
   * Execute tasks in parralel with a value being passed to each task.
   * A combination promise will be returned as the result.
   */
  parallelizeTasks(value: Result): ResultPromise {
    // $FlowIgnore Native Promise.all() type definitions do not match Bluebird
    return Promise.all(this.subtasks.map(task => this.executeTask(value, task)));
  }

  /**
   * Add a new subroutine within this routine.
   */
  pipe(...routines: Routine[]): this {
    routines.forEach((routine) => {
      if (routine instanceof Routine) {
        this.subroutines.push(routine.configure(this));

      } else {
        throw new TypeError('Routines must be an instance of `Routine`.');
      }
    });

    return this;
  }

  /**
   * Trigger processes before and after execution.
   */
  run(value: Result, context?: Object = {}): ResultPromise {
    this.tool.startDebugGroup(this.key);

    return super.run(value, context).finally(() => {
      this.tool.stopDebugGroup();
      this.tool.render();
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
  serializeSubroutines(value: Result): ResultPromise {
    return this.serialize(value, this.subroutines, this.executeTask);
  }

  /**
   * Execute tasks in sequential (serial) order.
   */
  serializeTasks(value: Result): ResultPromise {
    return this.serialize(value, this.subtasks, this.executeTask);
  }

  /**
   * Define an individual task.
   */
  task(title: string, action: TaskCallback, config?: Config = {}): this {
    if (typeof action !== 'function') {
      throw new TypeError('Tasks require an executable function.');
    }

    this.subtasks.push(new Task(title, action.bind(this), config));

    return this;
  }
}
