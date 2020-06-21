import kebabCase from 'lodash/kebabCase';
import { instanceOf } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import Context from './Context';
import Routine from './Routine';
import Task from './Task';
import Tool from './Tool';

export type ExecuteHandler<Ctx extends Context> = (task: Task<Ctx>, value?: any) => Promise<any>;

export interface AggregatedResponse<T> {
  errors: Error[];
  results: T[];
}

export default abstract class Executor<Ctx extends Context, Options extends object = {}> {
  context: Ctx;

  debug: Debugger;

  options: Options;

  parallel: boolean = false;

  tool: Tool<any>;

  constructor(tool: Tool<any>, context: Ctx, options?: Options) {
    this.context = context;
    this.debug = createDebugger(kebabCase(this.constructor.name));
    this.tool = tool;

    // @ts-expect-error
    this.options = { ...options };

    this.debug('Instantiating task executor');
  }

  /**
   * Aggregate and partition errors and results into separate collections.
   */
  aggregateResponse<T>(responses: T[]): AggregatedResponse<T> {
    const results: T[] = [];
    const errors: Error[] = [];

    this.debug('Aggregating results');

    responses.forEach((response: T | Error) => {
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
    this.tool.console.emit('routine', [routine, value, this.parallel]);
    this.tool.console.onRoutine.emit([routine, value, this.parallel]);

    return routine.run(this.context, value);
  };

  /**
   * Execute a task with the provided value.
   */
  executeTask = async <T>(task: Task<Ctx>, value?: T): Promise<any> => {
    this.tool.console.emit('task', [task, value, this.parallel]);
    this.tool.console.onTask.emit([task, value, this.parallel]);

    return task.run(this.context, value);
  };

  /**
   * Run all routines with the defined executor.
   */
  runRoutines<T>(routines: Routine<Ctx, any>[], value?: T): Promise<any> {
    this.tool.console.emit(this.parallel ? 'routines.parallel' : 'routines', [routines, value]);
    this.tool.console.onRoutines.emit([routines, value, this.parallel]);

    return this.run(this.executeRoutine as any, routines, value);
  }

  /**
   * Run all tasks with the defined executor.
   */
  runTasks<T>(tasks: Task<Ctx>[], value?: T): Promise<any> {
    this.tool.console.emit(this.parallel ? 'tasks.parallel' : 'tasks', [tasks, value]);
    this.tool.console.onTasks.emit([tasks, value, this.parallel]);

    return this.run(this.executeTask, tasks, value);
  }

  /**
   * Method to execute tasks. Must be defined in sub-classes.
   */
  abstract async run<T>(handler: ExecuteHandler<Ctx>, tasks: Task<Ctx>[], value?: T): Promise<any>;
}
