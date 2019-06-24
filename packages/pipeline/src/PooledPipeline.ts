import os from 'os';
import { Predicates } from '@boost/common';
import Context from './Context';
import Pipeline from './Pipeline';
import { AggregatedResult, Runnable } from './types';

export interface PooledOptions {
  concurrency?: number;
  fifo?: boolean;
  timeout?: number;
}

export default class PooledPipeline<Input, Ctx extends Context = Context> extends Pipeline<
  Input,
  Ctx,
  PooledOptions
> {
  queue: Runnable<any, any>[] = [];

  resolver: ((response: AggregatedResult<any>) => void) | null = null;

  results: unknown[] = [];

  running: Runnable<any, any>[] = [];

  blueprint({ bool, number }: Predicates) {
    return {
      concurrency: number(os.cpus().length).gte(1),
      fifo: bool(true),
      timeout: number(0).gte(0),
    };
  }

  /**
   * Execute all pipeline work units in parallel and return an array of all results.
   */
  async run<Result>(context: Ctx): Promise<AggregatedResult<Result>> {
    return new Promise(resolve => {
      const units = this.getWorkUnits();

      if (units.length === 0) {
        resolve(this.aggregateResult([]));

        return;
      }

      this.queue = units;
      this.resolver = resolve;

      // eslint-disable-next-line promise/catch-or-return
      Promise.all(
        this.queue
          .slice(0, this.options.concurrency)
          .map(() => this.runWorkUnit(context, this.value)),
      );
    });
  }

  /**
   * Run a single work unit from the queue, and start the next work unit when it passes or fails.
   */
  protected runWorkUnit(context: Ctx, value: Input): Promise<void> {
    const unit = this.options.fifo ? this.queue.shift() : this.queue.pop();

    if (!unit) {
      return Promise.resolve();
    }

    this.running.push(unit);

    const handleResult = (result: unknown) => {
      this.running = this.running.filter(running => running !== unit);
      this.results.push(result);

      if (this.queue.length > 0 && this.running.length < this.options.concurrency) {
        this.runWorkUnit(context, value);
      } else if (this.queue.length === 0 && this.running.length === 0 && this.resolver) {
        this.resolver(this.aggregateResult(this.results));
      }
    };

    const { timeout } = this.options;

    return new Promise((resolve, reject) => {
      let timer: NodeJS.Timeout;

      if (timeout > 0) {
        timer = setTimeout(() => {
          reject(new Error('Work unit has timed out.'));
        }, timeout);
      }

      unit
        .run(context, value)
        .then(result => {
          if (timer) {
            clearTimeout(timer);
          }

          return resolve(handleResult(result));
        })
        .catch(error => {
          return reject(handleResult(error));
        });
    });
  }
}
