import kebabCase from 'lodash/kebabCase';
import Context from './Context';
import Routine from './Routine';
import Task from './Task';
import Tool from './Tool';
import instanceOf from './helpers/instanceOf';
import { Debugger } from './types';

export type ExecuteHandler<Ctx extends Context> = (task: Task<Ctx>, value?: any) => Promise<any>;

export interface AggregatedResponse {
  errors: Error[];
  results: any[];
}

export default abstract class Executor<Ctx extends Context, Options = {}> {
  context: Ctx;

  debug: Debugger;

  options: Partial<Options>;

  parallel: boolean = false;

  tool: Tool<any>;

  constructor(tool: Tool<any>, context: Ctx, options: Partial<Options> = {}) {
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
      if (instanceOf(response, Error)) {
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
    this.tool.console.onRoutine.emit([routine, value, this.parallel]);

    return routine.run(this.context, value);
  };

  /**
   * Execute a task with the provided value.
   */
  executeTask = async <T>(task: Task<Ctx>, value?: T): Promise<any> => {
    this.tool.console.onTask.emit([task, value, this.parallel]);

    return task.run(this.context, value);
  };

  /**
   * Run all routines with the defined executor.
   */
  runRoutines<T>(routines: Routine<Ctx, any>[], value?: T): Promise<any> {
    this.tool.console.onRoutines.emit([routines, value, this.parallel]);

    return this.run(this.executeRoutine as any, routines, value);
  }

  /**
   * Run all tasks with the defined executor.
   */
  runTasks<T>(tasks: Task<Ctx>[], value?: T): Promise<any> {
    this.tool.console.onTasks.emit([tasks, value, this.parallel]);

    return this.run(this.executeTask, tasks, value);
  }

  /**
   * Method to execute tasks. Must be defined in sub-classes.
   */
  abstract async run<T>(handler: ExecuteHandler<Ctx>, tasks: Task<Ctx>[], value?: T): Promise<any>;
}
