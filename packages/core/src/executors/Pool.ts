/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import os from 'os';
import optimal, { bool, number } from 'optimal';
import Context from '../Context';
import Executor, { AggregatedResponse, ExecuteHandler } from '../Executor';
import Task from '../Task';
import Tool from '../Tool';

export interface PoolExecutorOptions {
  concurrency: number;
  fifo: boolean;
  timeout: number;
}

export default class PoolExecutor<Ctx extends Context> extends Executor<Ctx, PoolExecutorOptions> {
  handler: ExecuteHandler<Ctx> | null = null;

  parallel: boolean = true;

  queue: Task<Ctx>[] = [];

  resolver: ((response: AggregatedResponse) => void) | null = null;

  results: any[] = [];

  running: Task<Ctx>[] = [];

  timeoutTimer?: NodeJS.Timer;

  constructor(tool: Tool<any>, context: Ctx, options: Partial<PoolExecutorOptions> = {}) {
    super(tool, context, options);

    this.options = optimal(
      options,
      {
        concurrency: number(os.cpus().length).gte(1),
        fifo: bool(true),
        timeout: number(0).gte(0),
      },
      {
        name: 'PoolExecutor',
      },
    );
  }

  /**
   * Execute tasks using a pool with a max concurrency.
   */
  run<T>(handler: ExecuteHandler<Ctx>, tasks: Task<Ctx>[], value?: T): Promise<AggregatedResponse> {
    if (tasks.length === 0) {
      return Promise.resolve(this.aggregateResponse([]));
    }

    const { concurrency, timeout } = this.options;

    this.handler = handler;
    this.debug('Pooling %d tasks', tasks.length);

    return new Promise(resolve => {
      this.queue = [...tasks]; // Break references
      this.resolver = resolve;

      // eslint-disable-next-line promise/catch-or-return
      Promise.all(this.queue.slice(0, concurrency).map(() => this.runItem(value)));

      if (timeout) {
        this.timeoutTimer = setTimeout(() => this.resolve(), timeout);
      }
    });
  }

  /**
   * Resolve the execution with the current results.
   */
  resolve() {
    if (this.resolver) {
      this.resolver(this.aggregateResponse(this.results));
    }

    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
    }
  }

  /**
   * Run a task from the queue, and start the next task one it passes or fails.
   */
  runItem<T>(value?: T): Promise<void> {
    const task = this.options.fifo ? this.queue.shift() : this.queue.pop();

    if (!task || !this.handler) {
      return Promise.resolve();
    }

    this.running.push(task);

    const handleResult = (result: any) => {
      this.running = this.running.filter(running => running !== task);
      this.results.push(result);
      this.nextItem(value);
    };

    return this.handler(task, value)
      .then(handleResult)
      .catch(handleResult);
  }

  /**
   * Run the next task if there are tasks available in the queue, and the max concurrency isn't met.
   * Otherwise, resolve and exit the current pool.
   */
  nextItem<T>(value?: T) {
    if (this.queue.length > 0 && this.running.length < this.options.concurrency!) {
      this.runItem(value);
    } else if (this.queue.length === 0 && this.running.length === 0) {
      this.resolve();
    }
  }
}
