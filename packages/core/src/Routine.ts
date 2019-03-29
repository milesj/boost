import execa, { Options as ExecaOptions, ExecaChildProcess, ExecaReturns } from 'execa';
import split from 'split';
import { Readable } from 'stream';
import optimal, { predicates, Blueprint, Predicates } from 'optimal';
import { Event } from '@boost/event';
import Context from './Context';
import Task, { TaskAction } from './Task';
import CoreTool from './Tool';
import { AggregatedResponse } from './Executor';
import ParallelExecutor from './executors/Parallel';
import PoolExecutor, { PoolExecutorOptions } from './executors/Pool';
import SerialExecutor from './executors/Serial';
import SyncExecutor from './executors/Sync';
import instanceOf from './helpers/instanceOf';
import wrapWithPromise from './helpers/wrapWithPromise';
import { STATUS_RUNNING } from './constants';
import { Debugger } from './types';

export interface CommandOptions {
  shell?: boolean;
  task?: Task<any>;
  wrap?: (process: ExecaChildProcess) => void;
}

export default abstract class Routine<
  Ctx extends Context,
  Tool extends CoreTool<any>,
  Options extends object = {}
> extends Task<Ctx> {
  // @ts-ignore Set after instantiation
  debug: Debugger;

  key: string = '';

  onCommand: Event<[string]>;

  onCommandData: Event<[string, string]>;

  options: Options;

  parent: Routine<Ctx, Tool> | null = null;

  // TODO Change to Set in 2.0
  routines: Routine<Ctx, Tool>[] = [];

  // TODO Change to Set in 2.0
  tasks: Task<Ctx>[] = [];

  // @ts-ignore Set after instantiation
  tool: Tool;

  constructor(key: string, title: string, options: Partial<Options> = {}) {
    super(title, (context, value) => this.execute(context, value));

    if (!key || typeof key !== 'string') {
      throw new Error('Routine key must be a valid unique string.');
    }

    this.key = key;
    this.options = optimal(options, this.blueprint(predicates), {
      name: this.constructor.name,
    });

    this.onCommand = new Event('command');
    this.onCommandData = new Event('command.data');
  }

  /**
   * Define an optimal blueprint in which to validate and build the
   * options passed to the constructor.
   */
  blueprint(preds: Predicates): Blueprint<Options> {
    return {} as any;
  }

  /**
   * Called once the routine has been configured and is ready to execute.
   */
  bootstrap() {}

  /**
   * Configure the routine after it has been instantiated.
   */
  configure(parent: Routine<Ctx, Tool>): this {
    this.parent = parent;
    this.tool = parent.tool;
    this.context = parent.context;
    this.metadata.depth = parent.metadata.depth + 1;

    // Custom debugger for this routine
    this.debug = this.tool.createDebugger('routine', this.key);
    this.debug('Bootstrapping routine');

    // Initialize routine
    this.bootstrap();

    return this;
  }

  /**
   * Execute a command with the given arguments and pass the results through a promise.
   */
  async executeCommand(
    command: string,
    args: string[],
    options: ExecaOptions & CommandOptions = {},
  ): Promise<ExecaReturns> {
    const { shell, task, wrap, ...opts } = options;
    const stream = shell
      ? execa.shell(`${command} ${args.join(' ')}`.trim(), opts)
      : execa(command, args, opts);

    this.onCommand.emit([command]);

    // Push chunks to the reporter
    const unit = task || this;
    const handler = (line: string) => {
      if (unit.status === STATUS_RUNNING) {
        unit.output += line;

        // Only capture the status when not empty
        if (line) {
          unit.statusText = line;
        }

        this.onCommandData.emit([command, line]);
      }
    };

    if (!shell) {
      (stream.stdout as Readable).pipe(split()).on('data', handler);
      (stream.stderr as Readable).pipe(split()).on('data', handler);
    }

    // Allow consumer to wrap functionality
    if (typeof wrap === 'function') {
      wrap(stream as ExecaChildProcess);
    }

    return wrapWithPromise(stream);
  }

  /**
   * Execute routines in parallel.
   */
  async parallelizeRoutines<T>(value?: T, routines?: Routine<Ctx, Tool>[]): Promise<any[]> {
    return new ParallelExecutor(this.tool, this.context).runRoutines(
      Array.from(routines || this.routines),
      value,
    );
  }

  /**
   * Execute tasks in parallel.
   */
  async parallelizeTasks<T>(value?: T, tasks?: Task<Ctx>[]): Promise<any[]> {
    return new ParallelExecutor(this.tool, this.context).runTasks(
      Array.from(tasks || this.tasks),
      value,
    );
  }

  /**
   * Add a new routine within this routine.
   */
  pipe(routine: Routine<Ctx, Tool>): this {
    if (instanceOf(routine, Routine)) {
      // eslint-disable-next-line no-param-reassign
      routine.metadata.index = this.routines.length;

      this.routines.push(routine.configure(this));
    } else {
      throw new TypeError(this.tool.msg('errors:routineInstanceInvalid'));
    }

    return this;
  }

  /**
   * Execute routines in a pool.
   */
  async poolRoutines<T>(
    value?: T,
    options?: Partial<PoolExecutorOptions>,
    routines?: Routine<Ctx, Tool>[],
  ): Promise<AggregatedResponse> {
    return new PoolExecutor(this.tool, this.context, options).runRoutines(
      Array.from(routines || this.routines),
      value,
    );
  }

  /**
   * Execute tasks in a pool.
   */
  async poolTasks<T>(
    value?: T,
    options?: Partial<PoolExecutorOptions>,
    tasks?: Task<Ctx>[],
  ): Promise<AggregatedResponse> {
    return new PoolExecutor(this.tool, this.context, options).runTasks(
      Array.from(tasks || this.tasks),
      value,
    );
  }

  /**
   * Execute routines in sequential (serial) order.
   */
  serializeRoutines<T>(value?: T, routines?: Routine<Ctx, Tool>[]): Promise<any> {
    return new SerialExecutor(this.tool, this.context).runRoutines(
      Array.from(routines || this.routines),
      value,
    );
  }

  /**
   * Execute tasks in sequential (serial) order.
   */
  serializeTasks<T>(value?: T, tasks?: Task<Ctx>[]): Promise<any> {
    return new SerialExecutor(this.tool, this.context).runTasks(
      Array.from(tasks || this.tasks),
      value,
    );
  }

  /**
   * Execute routines in sync.
   */
  async synchronizeRoutines<T>(
    value?: T,
    routines?: Routine<Ctx, Tool>[],
  ): Promise<AggregatedResponse> {
    return new SyncExecutor(this.tool, this.context).runRoutines(
      Array.from(routines || this.routines),
      value,
    );
  }

  /**
   * Execute tasks in sync.
   */
  async synchronizeTasks<T>(value?: T, tasks?: Task<Ctx>[]): Promise<AggregatedResponse> {
    return new SyncExecutor(this.tool, this.context).runTasks(
      Array.from(tasks || this.tasks),
      value,
    );
  }

  /**
   * Define an individual task.
   */
  task(title: string, action: TaskAction<Ctx>, scope?: any): Task<Ctx> {
    if (typeof action !== 'function') {
      throw new TypeError(this.tool.msg('errors:taskRequireAction'));
    }

    const task = new Task<Ctx>(title, action.bind(scope || this));

    task.parent = this;
    task.metadata.index = this.tasks.length;

    this.tasks.push(task);

    return task;
  }

  /**
   * Execute the current routine and return a new value.
   * This method *must* be overridden in a subclass.
   */
  abstract async execute(context: Ctx, value: any): Promise<any>;
}
