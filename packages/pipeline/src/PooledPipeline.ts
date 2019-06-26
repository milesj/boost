import os from 'os';
import { Predicates } from '@boost/common';
import AsyncPipeline from './AsyncPipeline';
import Context from './Context';
import { AggregatedResult, Runnable } from './types';

export interface PooledOptions {
  /** How many work units to process in parallel. */
  concurrency?: number;
  /** Process in first-in-last-out order instead of first-in-first-out. */
  filo?: boolean;
  /** Timeout in milliseconds that each work unit may run. */
  timeout?: number;
}

export default class PooledPipeline<
  Input,
  Output = Input,
  Ctx extends Context = Context
> extends AsyncPipeline<PooledOptions, Input, Output, Ctx> {
  resolver?: (response: AggregatedResult<Output>) => void;

  results: (Error | Output)[] = [];

  running: Runnable<Input, Output>[] = [];

  blueprint({ bool, number }: Predicates) {
    return {
      concurrency: number(os.cpus().length).gte(1),
      filo: bool(),
      timeout: number(0).gte(0),
    };
  }

  /**
   * Execute all work units in parallel, in a pool with a max concurrency,
   * with a value being passed to each work unit.
   * Work units will synchronize regardless of race conditions and errors.
   */
  async run(context: Ctx): Promise<AggregatedResult<Output>> {
    return new Promise(resolve => {
      const queue = [...this.queue];

      if (queue.length === 0) {
        resolve(this.aggregateResult([]));

        return;
      }

      this.queue = queue;
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
    const { concurrency, filo, timeout } = this.options;
    const unit = filo ? this.queue.pop() : this.queue.shift();

    if (!unit) {
      return Promise.resolve();
    }

    this.running.push(unit);

    const handleResult = (result: Error | Output) => {
      this.running = this.running.filter(running => running !== unit);
      this.results.push(result);

      if (this.queue.length > 0 && this.running.length < concurrency) {
        this.runWorkUnit(context, value);
      } else if (this.queue.length === 0 && this.running.length === 0 && this.resolver) {
        this.resolver(this.aggregateResult(this.results));
      }
    };

    return new Promise(resolve => {
      let timer: NodeJS.Timeout;

      if (timeout > 0) {
        timer = setTimeout(() => {
          resolve(handleResult(new Error('Work unit has timed out.')));
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
          return resolve(handleResult(error));
        });
    });
  }
}
