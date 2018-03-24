/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { ChildProcess } from 'child_process';
import chalk from 'chalk';
import execa, { Options as ExecaOptions, ExecaReturns } from 'execa';
import split from 'split';
import ExitError from './ExitError';
import Reporter from './Reporter';
import Task, { TaskInterface } from './Task';
import { ToolInterface } from './Tool';
import { STATUS_PENDING, STATUS_RUNNING } from './constants';
import { Context, TaskAction } from './types';

interface CommandOptions {
  sync?: boolean;
}

export default class Routine<Tc extends object, Tx extends Context> extends Task<Tc, Tx> {
  exit: boolean = false;

  key: string = '';

  // @ts-ignore Set after instantiation
  tool: ToolInterface;

  constructor(key: string, title: string, defaultConfig?: Tc) {
    super(title, null, defaultConfig);

    if (!key || typeof key !== 'string') {
      throw new Error('Routine key must be a valid unique string.');
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
  configure(parent: Routine<object, Tx>): this {
    this.context = parent.context;
    this.tool = parent.tool;

    // Monitor process
    this.tool.on('exit', () => {
      this.exit = true;
    });

    // Initialize routine (this must be last!)
    this.bootstrap();

    this.tool.debug(`Bootstrapping routine ${chalk.green(this.key)}`);

    return this;
  }

  /**
   * Execute the current routine and return a new value.
   * This method *must* be overridden in a subclass.
   */
  /* istanbul ignore next */
  execute<T>(value: T, context?: Tx): Promise<T> {
    return this.wrap(value);
  }

  /**
   * Execute a command with the given arguments and pass the results through a promise.
   */
  executeCommand(
    command: string,
    args: string[],
    options: ExecaOptions & CommandOptions = {},
    callback: ((process: ChildProcess) => void) | null = null,
  ): Promise<ExecaReturns> {
    const stream = options.sync
      ? execa.sync(command, args, options)
      : execa(command, args, options);

    // Push chunks to the reporter
    if (!options.sync) {
      stream.stdout.pipe(split()).on('data', (line: string) => {
        if (this.status === STATUS_RUNNING) {
          this.statusText = line;
        }
      });
    }

    // Allow consumer to wrap functionality
    if (typeof callback === 'function') {
      callback(stream);
    }

    return this.wrap(stream);
  }

  /**
   * Execute a task, a method in the current routine, or a function,
   * with the provided value.
   */
  executeTask = (value: any, task: TaskInterface): Promise<any> => (
    this.wrap(task.run(value, this.context))
  );

  /**
   * Execute subroutines in parralel with a value being passed to each subroutine.
   * A combination promise will be returned as the result.
   */
  parallelizeSubroutines(value: any): Promise<any[]> {
    return Promise.all(this.subroutines.map(routine => this.executeTask(value, routine)));
  }

  /**
   * Execute tasks in parralel with a value being passed to each task.
   * A combination promise will be returned as the result.
   */
  parallelizeTasks(value: any): Promise<any[]> {
    return Promise.all(this.subtasks.map(task => this.executeTask(value, task)));
  }

  /**
   * Add a new subroutine within this routine.
   */
  pipe(routine: TaskInterface): this {
    if (routine instanceof Routine) {
      this.subroutines.push(routine.configure(this));

    } else {
      throw new TypeError('Routines must be an instance of `Routine`.');
    }

    return this;
  }

  /**
   * Trigger processes before and after execution.
   */
  run(value: any, context: Tx): Promise<any> {
    const { console: cli } = this.tool;

    if (this.exit) {
      return Promise.reject(new ExitError('Process has been interrupted.'));
    }

    this.tool.debug(`Executing routine ${chalk.green(this.key)}`);

    cli.startDebugGroup(this.key);

    return super.run(value, context)
      .then((result) => {
        cli.stopDebugGroup();
        cli.update();

        return result;
      })
      .catch((error) => {
        cli.stopDebugGroup();
        cli.update();

        throw error;
      });
  }

  /**
   * Execute processes in sequential order with the output of each
   * task being passed to the next promise in the chain. Utilize the
   * `accumulator` function to execute the list of processes.
   */
  serialize(
    initialValue: any,
    items: any[],
    accumulator: (value: any, item: any) => Promise<any>,
  ): Promise<any> {
    return items.reduce((promise: Promise<any>, item: any) => (
      promise.then(value => accumulator(value, item))
    ), Promise.resolve(initialValue));
  }

  /**
   * Execute subroutines in sequential (serial) order.
   */
  serializeSubroutines(value: any): Promise<any> {
    return this.serialize(value, this.subroutines, this.executeTask);
  }

  /**
   * Execute tasks in sequential (serial) order.
   */
  serializeTasks(value: any): Promise<any> {
    return this.serialize(value, this.subtasks, this.executeTask);
  }

  /**
   * Define an individual task.
   */
  task<C extends object>(title: string, action: TaskAction<Tx>, config?: C): TaskInterface {
    if (typeof action !== 'function') {
      throw new TypeError('Tasks require an executable function.');
    }

    const task = new Task(title, action.bind(this), config);

    this.subtasks.push(task);

    return task;
  }
}
