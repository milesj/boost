/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import chalk from 'chalk';
import execa from 'execa';
import split from 'split';
import ExitError from './ExitError';
import Task from './Task';
import { STATUS_PENDING, STATUS_RUNNING } from './constants';

import type Reporter from './Reporter';
import type Tool from './Tool';
import type { TaskAction, ExecaOptions } from './types';

export default class Routine<Tc, Tx> extends Task<Tc, Tx> {
  exit: boolean = false;

  key: string = '';

  tool: Tool<*, Reporter<*>>;

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
  configure(parent: Routine<*, Tx>): this {
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
  execute(value: *, context?: Tx): Promise<*> {
    return value;
  }

  /**
   * Execute a command with the given arguments and pass the results through a promise.
   */
  executeCommand(
    command: string,
    args: string[],
    options?: $Shape<ExecaOptions> = {},
    // eslint-disable-next-line camelcase
    callback?: ?((process: child_process$ChildProcess) => void) = null,
  ): Promise<*> {
    const stream = options.sync
      ? execa.sync(command, args, options)
      : execa(command, args, options);

    // Push chunks to the reporter
    if (!options.sync) {
      stream.stdout.pipe(split()).on('data', (line) => {
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
  executeTask = (value: *, task: Task<*, Tx>): Promise<*> => (
    this.wrap(task.run(value, this.context))
  );

  /**
   * Execute subroutines in parralel with a value being passed to each subroutine.
   * A combination promise will be returned as the result.
   */
  parallelizeSubroutines(value: *): Promise<*[]> {
    // $FlowFixMe Annoying to solve
    return Promise.all(this.subroutines.map(routine => this.executeTask(value, routine)));
  }

  /**
   * Execute tasks in parralel with a value being passed to each task.
   * A combination promise will be returned as the result.
   */
  parallelizeTasks(value: *): Promise<*[]> {
    // $FlowFixMe Annoying to solve
    return Promise.all(this.subtasks.map(task => this.executeTask(value, task)));
  }

  /**
   * Add a new subroutine within this routine.
   */
  pipe(routine: Routine<*, Tx>): this {
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
  run(value: *, context: Tx): Promise<*> {
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
    initialValue: *,
    items: *[],
    accumulator: (value: *, item: *) => Promise<*>,
  ): Promise<*> {
    return items.reduce((promise: Promise<*>, item: *) => (
      promise.then(value => accumulator(value, item))
    ), Promise.resolve(initialValue));
  }

  /**
   * Execute subroutines in sequential (serial) order.
   */
  serializeSubroutines(value: *): Promise<*> {
    return this.serialize(value, this.subroutines, this.executeTask);
  }

  /**
   * Execute tasks in sequential (serial) order.
   */
  serializeTasks(value: *): Promise<*> {
    return this.serialize(value, this.subtasks, this.executeTask);
  }

  /**
   * Define an individual task.
   */
  task<C>(title: string, action: TaskAction<Tx>, config?: C): Task<C, Tx> {
    if (typeof action !== 'function') {
      throw new TypeError('Tasks require an executable function.');
    }

    const task = new Task(title, action.bind(this), config);

    this.subtasks.push(task);

    return task;
  }
}
