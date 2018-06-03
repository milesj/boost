/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { ChildProcess } from 'child_process';
import chalk from 'chalk';
import execa, {
  Options as ExecaOptions,
  SyncOptions as ExecaSyncOptions,
  ExecaChildProcess,
  ExecaReturns,
} from 'execa';
import split from 'split';
import { Readable } from 'stream';
import { Struct } from 'optimal';
import Task, { TaskAction, TaskInterface } from './Task';
import { ToolInterface } from './Tool';
import { STATUS_PENDING, STATUS_RUNNING } from './constants';
import { Debugger, Context } from './types';
import { AggregatedResponse } from './Executor';
import ParallelExecutor from './executors/Parallel';
import PoolExecutor, { PoolExecutorOptions } from './executors/Pool';
import SerialExecutor from './executors/Serial';
import SyncExecutor from './executors/Sync';
import wrapWithPromise from './helpers/wrapWithPromise';

export interface CommandOptions extends Struct {
  sync?: boolean;
  task?: TaskInterface;
  wrap?: (process: ExecaChildProcess) => void;
}

export interface RoutineInterface extends TaskInterface {
  key: string;
  routines: RoutineInterface[];
  tool: ToolInterface;
  run<T>(context: any, initialValue?: T | null, wasParallel?: boolean): Promise<any>;
}

export default class Routine<To extends Struct, Tx extends Context> extends Task<To, Tx>
  implements RoutineInterface {
  exit: boolean = false;

  // @ts-ignore Set after instantiation
  debug: Debugger;

  key: string = '';

  routines: RoutineInterface[] = [];

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
  configure(parent: Routine<Struct, Tx>): this {
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
  execute<T>(context: Tx, value?: T): Promise<any> {
    throw new Error('execute() must be defined.');
  }

  /**
   * Execute a command with the given arguments and pass the results through a promise.
   */
  executeCommand(
    command: string,
    args: string[],
    options: (ExecaOptions | ExecaSyncOptions) & CommandOptions = {},
  ): Promise<ExecaReturns> {
    const stream = options.sync
      ? execa.sync(command, args, options as ExecaSyncOptions)
      : execa(command, args, options);

    this.tool.console.emit('command', [command, this]);

    // Push chunks to the reporter
    if (!options.sync) {
      const out = stream.stdout as Readable;
      const task = options.task || this;

      out.pipe(split()).on('data', (line: string) => {
        /* istanbul ignore next */
        if (task.status === STATUS_RUNNING) {
          task.statusText = line;
          this.tool.console.emit('command.data', [command, line, this]);
        }
      });
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
  parallelizeRoutines<T>(value?: T, routines?: RoutineInterface[]): Promise<any[]> {
    return new ParallelExecutor(this.tool, this.context).run(routines || this.routines, value);
  }

  /**
   * Execute tasks in parallel.
   */
  parallelizeTasks<T>(value?: T, tasks?: TaskInterface[]): Promise<any[]> {
    return new ParallelExecutor(this.tool, this.context).run(tasks || this.tasks, value);
  }

  /**
   * Add a new routine within this routine.
   */
  pipe(routine: RoutineInterface): this {
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
  poolRoutines<T>(
    value?: T,
    options?: Partial<PoolExecutorOptions>,
    routines?: RoutineInterface[],
  ): Promise<AggregatedResponse> {
    return new PoolExecutor(this.tool, this.context, options).run(routines || this.routines, value);
  }

  /**
   * Execute tasks in a pool.
   */
  poolTasks<T>(
    value?: T,
    options?: Partial<PoolExecutorOptions>,
    tasks?: TaskInterface[],
  ): Promise<AggregatedResponse> {
    return new PoolExecutor(this.tool, this.context, options).run(tasks || this.tasks, value);
  }

  /**
   * Trigger processes before and after execution.
   */
  run<T>(context: Tx, value?: T, wasParallel: boolean = false): Promise<any> {
    if (this.exit) {
      return Promise.reject(new Error('Process has been interrupted.'));
    }

    this.debug('Executing routine');

    const { console: cli } = this.tool;

    cli.emit('routine', [this, value, wasParallel]);

    return super
      .run(context, value)
      .then(result => {
        cli.emit('routine.pass', [this, result, wasParallel]);

        return result;
      })
      .catch(error => {
        cli.emit('routine.fail', [this, error, wasParallel]);

        throw error;
      });
  }

  /**
   * Execute routines in sequential (serial) order.
   */
  serializeRoutines<T>(value?: T, routines?: RoutineInterface[]): Promise<any> {
    return new SerialExecutor(this.tool, this.context).run(routines || this.routines, value);
  }

  /**
   * Execute tasks in sequential (serial) order.
   */
  serializeTasks<T>(value?: T, tasks?: TaskInterface[]): Promise<any> {
    return new SerialExecutor(this.tool, this.context).run(tasks || this.tasks, value);
  }

  /**
   * Execute routines in sync.
   */
  synchronizeRoutines<T>(value?: T, routines?: RoutineInterface[]): Promise<AggregatedResponse> {
    return new SyncExecutor(this.tool, this.context).run(routines || this.routines, value);
  }

  /**
   * Execute tasks in sync.
   */
  synchronizeTasks<T>(value?: T, tasks?: TaskInterface[]): Promise<AggregatedResponse> {
    return new SyncExecutor(this.tool, this.context).run(tasks || this.tasks, value);
  }

  /**
   * Define an individual task.
   */
  task<Tp extends Struct>(title: string, action: TaskAction<Tx>, options?: Tp): TaskInterface {
    if (typeof action !== 'function') {
      throw new TypeError('Tasks require an executable function.');
    }

    const task = new Task(title, action.bind(this), options);

    this.tasks.push(task);

    return task;
  }
}
