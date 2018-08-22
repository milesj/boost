/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import kebabCase from 'lodash/kebabCase';
import wrapWithPromise from './helpers/wrapWithPromise';
import Context from './Context';
import Routine from './Routine';
import Task from './Task';
import Tool from './Tool';
import { Debugger } from './types';

export interface AggregatedResponse {
  errors: Error[];
  results: any[];
}

export default class Executor<Ctx extends Context, Options = {}> {
  context: Ctx;

  debug: Debugger;

  options: Options;

  tool: Tool;

  constructor(tool: Tool, context: Ctx, options: Partial<Options> = {}) {
    this.context = context;
    this.debug = tool.createDebugger(kebabCase(this.constructor.name));
    this.tool = tool;
    // @ts-ignore
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
   * Execute either a task or routine.
   */
  execute<T>(
    task: Task<Ctx> | Routine<Ctx>,
    value?: T,
    wasParallel: boolean = false,
  ): Promise<any> {
    return this.getInstanceType(task) === 'Routine'
      ? this.executeRoutine(task as Routine<Ctx>, value, wasParallel)
      : this.executeTask(task, value, wasParallel);
  }

  /**
   * Execute a routine with the provided value.
   */
  executeRoutine<T>(routine: Routine<Ctx>, value?: T, wasParallel: boolean = false): Promise<any> {
    return wrapWithPromise(routine.run(this.context, value, wasParallel));
  }

  /**
   * Execute a task with the provided value.
   */
  executeTask<T>(task: Task<Ctx>, value?: T, wasParallel: boolean = false): Promise<any> {
    const { console: cli } = this.tool;

    cli.emit('task', [task, value, wasParallel]);

    return wrapWithPromise(task.run(this.context, value))
      .then(result => {
        cli.emit('task.pass', [task, result, wasParallel]);

        return result;
      })
      .catch(error => {
        cli.emit('task.fail', [task, error, wasParallel]);

        throw error;
      });
  }

  /**
   * Importing Routine causes a circular reference, so we can't use an instanceof check,
   * so we need to hackily check this another way.
   */
  getInstanceType(task: Task<Ctx> | Routine<Ctx>): string {
    let instance = task;
    let name = '';

    do {
      ({ name } = instance.constructor);

      if (name === 'Routine' || name === 'Task') {
        return name;
      }

      instance = Object.getPrototypeOf(instance);
    } while (instance);

    return name;
  }

  /**
   * Method to execute tasks. Must be defined in sub-classes.
   */
  run<T>(tasks: Task<Ctx>[], value?: T) {
    throw new Error('run() must be defined.');
  }
}
