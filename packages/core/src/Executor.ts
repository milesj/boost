/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import kebabCase from 'lodash/kebabCase';
import Context from './Context';
import Routine from './Routine';
import Task from './Task';
import Tool from './Tool';
import { Debugger } from './types';

export type ExecuteHandler<Ctx> = (task: Task<Ctx>, value?: any) => Promise<any>;

export interface AggregatedResponse {
  errors: Error[];
  results: any[];
}

export default class Executor<Ctx extends Context, Options = {}> {
  context: Ctx;

  debug: Debugger;

  options: Partial<Options>;

  parallel: boolean = false;

  tool: Tool<any, any>;

  constructor(tool: Tool<any, any>, context: Ctx, options: Partial<Options> = {}) {
    this.context = context;
    this.debug = tool.createDebugger(kebabCase(this.constructor.name));
    this.tool = tool;
    this.options = { ...options };

    this.debug('Instantiating task executor');
  }

  /**
   * Aggregate and partition errors and results into separate collections.
   */
  aggregateResponse(responses: any[]): AggregatedResponse {
    const results: any[] = [];
    const errors: Error[] = [];

    this.debug('Aggregating results');

    responses.forEach((response: any) => {
      if (response instanceof Error) {
        errors.push(response);
      } else {
        results.push(response);
      }
    });

    return { errors, results };
  }

  /**
   * Execute a routine with the provided value.
   */
  executeRoutine = async <T>(routine: Routine<Ctx, any>, value?: T): Promise<any> => {
    const { console: cli } = this.tool;
    let result = null;

    cli.emit('routine', [routine, value, this.parallel]);

    try {
      result = await routine.run(this.context, value);

      if (routine.isSkipped()) {
        cli.emit('routine.skip', [routine, value, this.parallel]);
      } else {
        cli.emit('routine.pass', [routine, result, this.parallel]);
      }
    } catch (error) {
      cli.emit('routine.fail', [routine, error, this.parallel]);

      throw error;
    }

    return result;
  };

  /**
   * Execute a task with the provided value.
   */
  executeTask = async <T>(task: Task<Ctx>, value?: T): Promise<any> => {
    const { console: cli } = this.tool;
    let result = null;

    cli.emit('task', [task, value, this.parallel]);

    try {
      result = await task.run(this.context, value);

      if (task.isSkipped()) {
        cli.emit('task.skip', [task, value, this.parallel]);
      } else {
        cli.emit('task.pass', [task, result, this.parallel]);
      }
    } catch (error) {
      cli.emit('task.fail', [task, error, this.parallel]);

      throw error;
    }

    return result;
  };

  /**
   * Method to execute tasks. Must be defined in sub-classes.
   */
  async run<T>(handler: ExecuteHandler<Ctx>, tasks: Task<Ctx>[], value?: T): Promise<any> {
    throw new Error('run() must be defined asynchronously.');
  }

  /**
   * Run all routines with the defined executor.
   */
  runRoutines<T>(routines: Routine<Ctx, any>[], value?: T): Promise<any> {
    this.tool.console.emit(this.parallel ? 'routines.parallel' : 'routines', [routines, value]);

    return this.run(this.executeRoutine as any, routines, value);
  }

  /**
   * Run all tasks with the defined executor.
   */
  runTasks<T>(tasks: Task<Ctx>[], value?: T): Promise<any> {
    this.tool.console.emit(this.parallel ? 'tasks.parallel' : 'tasks', [tasks, value]);

    return this.run(this.executeTask, tasks, value);
  }
}
