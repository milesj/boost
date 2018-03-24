/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { ChildProcess } from 'child_process';
import chalk from 'chalk';
import debug from 'debug';
import execa, {
  Options as ExecaOptions,
  SyncOptions as ExecaSyncOptions,
  ExecaChildProcess,
  ExecaReturns,
} from 'execa';
import split from 'split';
import { Readable } from 'stream';
import { Options } from 'optimal';
import ExitError from './ExitError';
import Reporter from './Reporter';
import Task, { TaskAction, TaskInterface } from './Task';
import { ToolInterface } from './Tool';
import { STATUS_PENDING, STATUS_RUNNING } from './constants';
import { Context, Partial } from './types';

export interface CommandOptions {
  sync?: boolean;
}

export default class Routine<To extends Options, Tx extends Context> extends Task<To, Tx> {
  exit: boolean = false;

  // @ts-ignore Set after instantiation
  debug: debug.IDebugger;

  key: string = '';

  // @ts-ignore Set after instantiation
  tool: ToolInterface;

  constructor(key: string, title: string, options: Partial<To> = {}) {
    super(title, null, options);

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
  configure(parent: Routine<Options, Tx>): this {
    this.context = parent.context;
    this.tool = parent.tool;

    // Monitor process
    this.tool.on('exit', () => {
      this.exit = true;
    });

    // Custom debugger for this routine
    this.debug = this.tool.createDebugger('routine', this.key);
    this.debug('Bootstrapping routine %s', chalk.green(this.key));

    // Initialize routine (this must be last!)
    this.bootstrap();

    return this;
  }

  /**
   * Execute the current routine and return a new value.
   * This method *must* be overridden in a subclass.
   */
  /* istanbul ignore next */
  execute<T>(context: Tx, value: T | null = null): Promise<T | null> {
    return this.wrap(value);
  }

  /**
   * Execute a command with the given arguments and pass the results through a promise.
   */
  executeCommand(
    command: string,
    args: string[],
    options: (ExecaOptions | ExecaSyncOptions) & CommandOptions = {},
    callback: ((process: ExecaChildProcess) => void) | null = null,
  ): Promise<ExecaReturns> {
    const stream = options.sync
      ? execa.sync(command, args, options as ExecaSyncOptions)
      : execa(command, args, options);

    // Push chunks to the reporter
    if (!options.sync) {
      const out = stream.stdout as Readable;

      out.pipe(split()).on('data', (line: string) => {
        if (this.status === STATUS_RUNNING) {
          this.statusText = line;
        }
      });
    }

    // Allow consumer to wrap functionality
    if (typeof callback === 'function') {
      callback(stream as ExecaChildProcess);
    }

    return this.wrap(stream);
  }

  /**
   * Execute a task, a method in the current routine, or a function,
   * with the provided value.
   */
  executeTask<T>(task: TaskInterface, value: T | null = null): Promise<T | null> {
    return this.wrap(task.run(this.context, value));
  }

  /**
   * Execute subroutines in parralel with a value being passed to each subroutine.
   * A combination promise will be returned as the result.
   */
  parallelizeSubroutines<T>(value: T | null = null): Promise<(T | null)[]> {
    return Promise.all(this.subroutines.map(routine => this.executeTask(routine, value)));
  }

  /**
   * Execute tasks in parralel with a value being passed to each task.
   * A combination promise will be returned as the result.
   */
  parallelizeTasks<T>(value: T | null = null): Promise<(T | null)[]> {
    return Promise.all(this.subtasks.map(task => this.executeTask(task, value)));
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
  run<T>(context: Tx, value: T | null = null): Promise<T | null> {
    if (this.exit) {
      return Promise.reject(new ExitError('Process has been interrupted.'));
    }

    this.debug('Executing routine %s', chalk.green(this.key));

    return super
      .run(context, value)
      .then(result => {
        this.tool.console.update();

        return result;
      })
      .catch(error => {
        this.tool.console.update();

        throw error;
      });
  }

  /**
   * Execute processes in sequential order with the output of each
   * task being passed to the next promise in the chain. Utilize the
   * `accumulator` function to execute the list of processes.
   */
  serialize<T>(
    tasks: TaskInterface[],
    initialValue: T | null = null,
    accumulator: (task: TaskInterface, value: T | null) => Promise<T | null>,
  ): Promise<T | null> {
    return tasks.reduce(
      (promise, task) => promise.then(value => accumulator(task, value)),
      Promise.resolve(initialValue),
    );
  }

  /**
   * Execute subroutines in sequential (serial) order.
   */
  serializeSubroutines<T>(value: T | null = null): Promise<T | null> {
    return this.serialize(this.subroutines, value, (task, val) => this.executeTask(task, val));
  }

  /**
   * Execute tasks in sequential (serial) order.
   */
  serializeTasks<T>(value: T | null = null): Promise<T | null> {
    return this.serialize(this.subtasks, value, (task, val) => this.executeTask(task, val));
  }

  /**
   * Define an individual task.
   */
  task(title: string, action: TaskAction<Tx>, options: Options = {}): TaskInterface {
    if (typeof action !== 'function') {
      throw new TypeError('Tasks require an executable function.');
    }

    const task = new Task(title, action.bind(this), options);

    this.subtasks.push(task);

    return task;
  }
}
