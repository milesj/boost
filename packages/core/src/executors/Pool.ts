/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import os from 'os';
import optimal, { bool, number } from 'optimal';
import Context from '../Context';
import Executor, { AggregatedResponse } from '../Executor';
import Task from '../Task';
import Tool from '../Tool';

export interface PoolExecutorOptions {
  concurrency: number;
  fifo: boolean;
  timeout: number;
}

export default class PoolExecutor<Tx extends Context> extends Executor<Tx, PoolExecutorOptions> {
  queue: Task<Tx>[] = [];

  resolver: ((response: AggregatedResponse) => void) | null = null;

  results: any[] = [];

  running: Task<Tx>[] = [];

  timeoutTimer?: NodeJS.Timer;

  constructor(tool: Tool, context: Tx, options: Partial<PoolExecutorOptions> = {}) {
    super(tool, context, options);

    this.options = optimal(options, {
      concurrency: number(os.cpus().length).gte(1),
      fifo: bool(true),
      timeout: number(0).gte(0),
    });
  }

  /**
   * Execute tasks using a pool with a max concurrency.
   */
  run<T>(tasks: Task<Tx>[], value?: T): Promise<AggregatedResponse> {
    if (tasks.length === 0) {
      return Promise.resolve(this.aggregateResponse([]));
    }

    const { concurrency, timeout } = this.options;

    this.debug('Pooling %d tasks', tasks.length);

    return new Promise(resolve => {
      this.queue = [...tasks]; // Break references
      this.resolver = resolve;

      // eslint-disable-next-line promise/catch-or-return
      Promise.all(this.queue.slice(0, concurrency).map(() => this.runTask(value)));

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
  runTask<T>(value?: T): Promise<void> {
    const task = this.options.fifo ? this.queue.shift() : this.queue.pop();

    if (!task) {
      return Promise.resolve();
    }

    this.running.push(task);

    const handleResult = (result: any) => {
      this.running = this.running.filter(running => running !== task);
      this.results.push(result);
      this.nextTask(value);
    };

    return this.execute(task, value, true)
      .then(handleResult)
      .catch(handleResult);
  }

  /**
   * Run the next task if there are tasks available in the queue, and the max concurrency isn't met.
   * Otherwise, resolve and exit the current pool.
   */
  nextTask<T>(value?: T) {
    if (this.queue.length > 0 && this.running.length < this.options.concurrency) {
      this.runTask(value);
    } else if (this.queue.length === 0 && this.running.length === 0) {
      this.resolve();
    }
  }
}
