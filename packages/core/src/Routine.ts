/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import execa, { Options as ExecaOptions, ExecaChildProcess, ExecaReturns } from 'execa';
import split from 'split';
import { Readable } from 'stream';
import Context from './Context';
import Task, { TaskAction } from './Task';
import Tool from './Tool';
import { AggregatedResponse } from './Executor';
import ParallelExecutor from './executors/Parallel';
import PoolExecutor, { PoolExecutorOptions } from './executors/Pool';
import SerialExecutor from './executors/Serial';
import SyncExecutor from './executors/Sync';
import wrapWithPromise from './helpers/wrapWithPromise';
import { STATUS_PENDING, STATUS_RUNNING } from './constants';
import { Debugger } from './types';

export interface CommandOptions {
  shell?: boolean;
  task?: Task<any>;
  wrap?: (process: ExecaChildProcess) => void;
}

export default class Routine<Ctx extends Context, Options = {}> extends Task<Ctx, Options> {
  exit: boolean = false;

  // @ts-ignore Set after instantiation
  debug: Debugger;

  key: string = '';

  routines: Routine<Ctx, any>[] = [];

  // @ts-ignore Set after instantiation
  tool: Tool;

  constructor(key: string, title: string, options: Partial<Options> = {}) {
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
  configure(parent: Routine<Ctx>): this {
    this.context = parent.context;
    this.tool = parent.tool;

    // Monitor process
    this.tool.on('exit', () => {
      this.exit = true;
    });

    // Custom debugger for this routine
    this.debug = this.tool.createDebugger('routine', this.key);
    this.debug('Bootstrapping routine');

    // Initialize routine (this must be last!)
    this.bootstrap();

    return this;
  }

  /**
   * Execute the current routine and return a new value.
   * This method *must* be overridden in a subclass.
   */
  async execute<T>(context: Ctx, value?: T): Promise<any> {
    throw new Error('execute() must be defined asynchronously.');
  }

  /**
   * Execute a command with the given arguments and pass the results through a promise.
   */
  async executeCommand(
    command: string,
    args: string[],
    options: ExecaOptions & CommandOptions = {},
  ): Promise<ExecaReturns> {
    const stream = options.shell
      ? execa.shell(`${command} ${args.join(' ')}`.trim(), options)
      : execa(command, args, options);

    this.tool.console.emit('command', [command, this]);

    // Push chunks to the reporter
    const task = options.task || this;
    const handler = (line: string) => {
      /* istanbul ignore next */
      if (task.status === STATUS_RUNNING) {
        task.statusText = line;
        this.tool.console.emit('command.data', [command, line, this]);
      }
    };

    if (stream && stream.stdout) {
      (stream.stdout as Readable).pipe(split()).on('data', handler);
    }

    if (stream && stream.stderr) {
      (stream.stderr as Readable).pipe(split()).on('data', handler);
    }

    // Allow consumer to wrap functionality
    if (typeof options.wrap === 'function') {
      options.wrap(stream as ExecaChildProcess);
    }

    return wrapWithPromise(stream);
  }

  /**
   * Execute routines in parallel.
   */
  async parallelizeRoutines<T>(value?: T, routines?: Routine<Ctx>[]): Promise<any[]> {
    return new ParallelExecutor(this.tool, this.context).run(routines || this.routines, value);
  }

  /**
   * Execute tasks in parallel.
   */
  async parallelizeTasks<T>(value?: T, tasks?: Task<Ctx>[]): Promise<any[]> {
    return new ParallelExecutor(this.tool, this.context).run(tasks || this.tasks, value);
  }

  /**
   * Add a new routine within this routine.
   */
  pipe(routine: Routine<Ctx>): this {
    if (routine instanceof Routine) {
      this.routines.push(routine.configure(this));
    } else {
      throw new TypeError('Routines must be an instance of `Routine`.');
    }

    return this;
  }

  /**
   * Execute routines in a pool.
   */
  async poolRoutines<T>(
    value?: T,
    options?: Partial<PoolExecutorOptions>,
    routines?: Routine<Ctx>[],
  ): Promise<AggregatedResponse> {
    return new PoolExecutor(this.tool, this.context, options).run(routines || this.routines, value);
  }

  /**
   * Execute tasks in a pool.
   */
  async poolTasks<T>(
    value?: T,
    options?: Partial<PoolExecutorOptions>,
    tasks?: Task<Ctx>[],
  ): Promise<AggregatedResponse> {
    return new PoolExecutor(this.tool, this.context, options).run(tasks || this.tasks, value);
  }

  /**
   * Trigger processes before and after execution.
   */
  async run<T>(context: Ctx, value?: T, wasParallel: boolean = false): Promise<any> {
    if (this.exit) {
      return Promise.reject(new Error('Process has been interrupted.'));
    }

    this.debug('Executing routine');

    const { console: cli } = this.tool;
    let result = null;

    cli.emit('routine', [this, value, wasParallel]);

    try {
      result = await super.run(context, value);

      cli.emit('routine.pass', [this, result, wasParallel]);
    } catch (error) {
      cli.emit('routine.fail', [this, error, wasParallel]);

      throw error;
    }

    return result;
  }

  /**
   * Execute routines in sequential (serial) order.
   */
  serializeRoutines<T>(value?: T, routines?: Routine<Ctx>[]): Promise<any> {
    return new SerialExecutor(this.tool, this.context).run(routines || this.routines, value);
  }

  /**
   * Execute tasks in sequential (serial) order.
   */
  serializeTasks<T>(value?: T, tasks?: Task<Ctx>[]): Promise<any> {
    return new SerialExecutor(this.tool, this.context).run(tasks || this.tasks, value);
  }

  /**
   * Execute routines in sync.
   */
  async synchronizeRoutines<T>(value?: T, routines?: Routine<Ctx>[]): Promise<AggregatedResponse> {
    return new SyncExecutor(this.tool, this.context).run(routines || this.routines, value);
  }

  /**
   * Execute tasks in sync.
   */
  async synchronizeTasks<T>(value?: T, tasks?: Task<Ctx>[]): Promise<AggregatedResponse> {
    return new SyncExecutor(this.tool, this.context).run(tasks || this.tasks, value);
  }

  /**
   * Define an individual task.
   */
  task<Tp>(title: string, action: TaskAction<Ctx>, options?: Tp): Task<Ctx, Tp> {
    if (typeof action !== 'function') {
      throw new TypeError('Tasks require an executable function.');
    }

    const task = new Task<Ctx, Tp>(title, action.bind(this), options);

    this.tasks.push(task);

    return task;
  }
}
