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
import { Debugger, Context, SynchronizedResponse } from './types';

export interface CommandOptions extends Struct {
  sync?: boolean;
  task?: TaskInterface;
  wrap?: (process: ExecaChildProcess) => void;
}

export interface RoutineInterface extends TaskInterface {
  key: string;
  subroutines: RoutineInterface[];
  tool: ToolInterface;
  run<T>(context: any, initialValue?: T | null, wasParallel?: boolean): Promise<any>;
}

export default class Routine<To extends Struct, Tx extends Context> extends Task<To, Tx>
  implements RoutineInterface {
  exit: boolean = false;

  // @ts-ignore Set after instantiation
  debug: Debugger;

  key: string = '';

  subroutines: RoutineInterface[] = [];

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
  /* istanbul ignore next */
  execute<T>(context: Tx, value?: T): Promise<any> {
    return this.wrap(value);
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

    return this.wrap(stream);
  }

  /**
   * Execute a sub-routine with the provided value.
   */
  executeSubroutine<T>(
    routine: RoutineInterface,
    value?: T,
    wasParallel: boolean = false,
  ): Promise<any> {
    return this.wrap(routine.run(this.context, value, wasParallel));
  }

  /**
   * Execute a task, a method in the current routine, or a function,
   * with the provided value.
   */
  executeTask<T>(task: TaskInterface, value?: T, wasParallel: boolean = false): Promise<any> {
    const { console: cli } = this.tool;

    cli.emit('task', [task, this, value, wasParallel]);

    return this.wrap(task.run(this.context, value))
      .then(result => {
        cli.emit('task.pass', [task, this, result, wasParallel]);

        return result;
      })
      .catch(error => {
        cli.emit('task.fail', [task, this, error, wasParallel]);

        throw error;
      });
  }

  /**
   * Execute subroutines in parralel with a value being passed to each subroutine.
   * A combination promise will be returned as the result.
   */
  parallelizeSubroutines<T>(value?: T): Promise<any[]> {
    return Promise.all(
      this.subroutines.map(routine => this.executeSubroutine(routine, value, true)),
    );
  }

  /**
   * Execute tasks in parralel with a value being passed to each task.
   * A combination promise will be returned as the result.
   */
  parallelizeTasks<T>(value?: T): Promise<any[]> {
    return Promise.all(this.subtasks.map(task => this.executeTask(task, value, true)));
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
   * Execute subroutines in sequential (serial) order.
   */
  serializeSubroutines<T>(value?: T): Promise<any> {
    return this.serialize(
      this.subroutines,
      (routine, val) => this.executeSubroutine(routine, val),
      value,
    );
  }

  /**
   * Execute tasks in sequential (serial) order.
   */
  serializeTasks<T>(value?: T): Promise<any> {
    return this.serialize(this.subtasks, (task, val) => this.executeTask(task, val), value);
  }

  /**
   * Execute subroutines in parralel with a value being passed to each subroutine.
   * Subroutines will synchronize regardless of race conditions and errors.
   */
  synchronizeSubroutines<T>(value?: T): Promise<SynchronizedResponse> {
    return this.synchronize(
      this.subroutines.map(routine =>
        this.executeSubroutine(routine, value, true).catch(error => error),
      ),
    );
  }

  /**
   * Execute tasks in parralel with a value being passed to each task.
   * Tasks will synchronize regardless of race conditions and errors.
   */
  synchronizeTasks<T>(value?: T): Promise<SynchronizedResponse> {
    return this.synchronize(
      this.subtasks.map(task => this.executeTask(task, value, true).catch(error => error)),
    );
  }

  /**
   * Define an individual task.
   */
  task(title: string, action: TaskAction<Tx>, options: Struct = {}): TaskInterface {
    if (typeof action !== 'function') {
      throw new TypeError('Tasks require an executable function.');
    }

    const task = new Task(title, action.bind(this), options);

    this.subtasks.push(task);

    return task;
  }

  /**
   * Execute processes in sequential order with the output of each
   * task being passed to the next promise in the chain. Utilize the
   * `accumulator` function to execute the list of processes.
   */
  private serialize<T, T2 extends TaskInterface>(
    tasks: T2[],
    accumulator: (task: T2, value?: T) => Promise<any>,
    initialValue?: T,
  ): Promise<any> {
    return tasks.reduce(
      (promise, task) => promise.then(value => accumulator(task, value)),
      Promise.resolve(initialValue),
    );
  }

  /**
   * Synchronize parallel promises and partition errors and results into separate collections.
   */
  private synchronize(promises: Promise<any>[]): Promise<SynchronizedResponse> {
    return Promise.all(promises).then((responses: any) => {
      const results: any[] = [];
      const errors: Error[] = [];

      responses.forEach((response: any) => {
        if (response instanceof Error) {
          errors.push(response);
        } else {
          results.push(response);
        }
      });

      return Promise.resolve({ errors, results });
    });
  }
}
