/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import kebabCase from 'lodash/kebabCase';
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

  tool: Tool<any, any>;

  constructor(tool: Tool<any, any>, context: Ctx, options: Partial<Options> = {}) {
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
  async execute<T>(
    task: Task<Ctx> | Routine<Ctx, any>,
    value?: T,
    wasParallel: boolean = false,
  ): Promise<any> {
    if (this.getInstanceType(task) === 'Routine') {
      return this.executeRoutine(task as Routine<Ctx, any>, value, wasParallel);
    }

    return this.executeTask(task, value, wasParallel);
  }

  /**
   * Execute a routine with the provided value.
   */
  async executeRoutine<T>(
    routine: Routine<Ctx, any>,
    value?: T,
    wasParallel: boolean = false,
  ): Promise<any> {
    return routine.run(this.context, value, wasParallel);
  }

  /**
   * Execute a task with the provided value.
   */
  async executeTask<T>(task: Task<Ctx>, value?: T, wasParallel: boolean = false): Promise<any> {
    const { console: cli } = this.tool;
    let result = null;

    cli.emit('task', [task, value, wasParallel]);

    try {
      result = await task.run(this.context, value);

      cli.emit('task.pass', [task, result, wasParallel]);
    } catch (error) {
      cli.emit('task.fail', [task, error, wasParallel]);

      throw error;
    }

    return result;
  }

  /**
   * Importing Routine causes a circular reference, so we can't use an instanceof check,
   * so we need to hackily check this another way.
   */
  getInstanceType(task: Task<Ctx> | Routine<Ctx, any>): string {
    let instance = task;
    let name = '';

    do {
      ({ name } = instance.constructor);

      if (name === 'Routine' || name === 'Task') {
        return name;
      }

      instance = Object.getPrototypeOf(instance);
    } while (instance);

    // istanbul ignore next
    return name;
  }

  /**
   * Method to execute tasks. Must be defined in sub-classes.
   */
  async run<T>(tasks: Task<Ctx>[], value?: T): Promise<any> {
    throw new Error('run() must be defined asynchronously.');
  }
}
