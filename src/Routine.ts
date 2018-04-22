/**
 * @copyright   2017, Miles Johnson
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

export interface CommandOptions extends Struct {
  sync?: boolean;
}

export interface RoutineInterface extends TaskInterface {
  key: string;
  subroutines: RoutineInterface[];
  tool: ToolInterface;
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
  execute<T>(context: Tx, value: T | null = null): Promise<any> {
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

    this.tool.console.emit('command', [command, this]);

    // Push chunks to the reporter
    if (!options.sync) {
      const out = stream.stdout as Readable;

      out.pipe(split()).on('data', (line: string) => {
        if (this.status === STATUS_RUNNING) {
          this.statusText = line;
          this.tool.console.emit('command.data', [command, line, this]);
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
   * Execute a sub-routine with the provided value.
   */
  executeSubroutine<T>(task: TaskInterface, value: T | null = null): Promise<any> {
    return this.wrap(task.run(this.context, value));
  }

  /**
   * Execute a task, a method in the current routine, or a function,
   * with the provided value.
   */
  executeTask<T>(task: TaskInterface, value: T | null = null): Promise<any> {
    const { console: cli } = this.tool;

    cli.emit('task', [task, value]);

    return this.wrap(task.run(this.context, value))
      .then(result => {
        cli.emit('task.pass', [task, result]);

        return result;
      })
      .catch(error => {
        cli.emit('task.fail', [task, error]);

        throw error;
      });
  }

  /**
   * Execute subroutines in parralel with a value being passed to each subroutine.
   * A combination promise will be returned as the result.
   */
  parallelizeSubroutines<T>(value: T | null = null): Promise<any> {
    return Promise.all(this.subroutines.map(routine => this.executeSubroutine(routine, value)));
  }

  /**
   * Execute tasks in parralel with a value being passed to each task.
   * A combination promise will be returned as the result.
   */
  parallelizeTasks<T>(value: T | null = null): Promise<any> {
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
  run<T>(context: Tx, value: T | null = null): Promise<any> {
    if (this.exit) {
      return Promise.reject(new Error('Process has been interrupted.'));
    }

    this.debug('Executing routine');

    const { console: cli } = this.tool;

    cli.emit('routine', [this, value]);

    return super
      .run(context, value)
      .then(result => {
        cli.emit('routine.pass', [this, result]);

        return result;
      })
      .catch(error => {
        cli.emit('routine.fail', [this, error]);

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
    accumulator: (task: TaskInterface, value: T | null) => Promise<any>,
  ): Promise<any> {
    return tasks.reduce(
      (promise, task) => promise.then(value => accumulator(task, value)),
      Promise.resolve(initialValue),
    );
  }

  /**
   * Execute subroutines in sequential (serial) order.
   */
  serializeSubroutines<T>(value: T | null = null): Promise<any> {
    return this.serialize(this.subroutines, value, (task, val) =>
      this.executeSubroutine(task, val),
    );
  }

  /**
   * Execute tasks in sequential (serial) order.
   */
  serializeTasks<T>(value: T | null = null): Promise<any> {
    return this.serialize(this.subtasks, value, (task, val) => this.executeTask(task, val));
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
}
