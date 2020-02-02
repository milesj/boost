import os from 'os';
import { Predicates } from '@boost/common';
import { RuntimeError } from '@boost/internal';
import ParallelPipeline from './ParallelPipeline';
import Context from './Context';
import WorkUnit from './WorkUnit';
import { debug } from './constants';
import { AggregatedResult } from './types';

export interface PooledOptions {
  /** How many work units to process in parallel. */
  concurrency?: number;
  /** Process with first-in-last-out order, instead of first-in-first-out. */
  filo?: boolean;
  /** Timeout in milliseconds that each work unit may run. */
  timeout?: number;
}

export default class PooledPipeline<
  Ctx extends Context,
  Input = unknown,
  Output = Input
> extends ParallelPipeline<PooledOptions, Ctx, Input, Output> {
  protected resolver?: (response: AggregatedResult<Output>) => void;

  protected results: (Error | Output)[] = [];

  protected running: WorkUnit<{}, Input, Output>[] = [];

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
  async run(): Promise<AggregatedResult<Output>> {
    debug('Running %d as a pool', this.work.length);

    this.debug('Pooling %d work units', this.work.length);
    this.onRun.emit([this.value]);

    return new Promise(resolve => {
      if (this.work.length === 0) {
        resolve(this.aggregateResult([]));

        return;
      }

      this.resolver = resolve;

      // eslint-disable-next-line promise/catch-or-return
      Promise.all(
        this.work
          .slice(0, this.options.concurrency)
          .map(() => this.runWorkUnit(this.context, this.value)),
      );
    });
  }

  /**
   * Run a single work unit from the queue, and start the next work unit when it passes or fails.
   */
  protected runWorkUnit(context: Ctx, value: Input): Promise<void> {
    const { concurrency, filo, timeout } = this.options;
    const unit = filo ? this.work.pop()! : this.work.shift()!;

    this.running.push(unit);

    const handleResult = (result: Error | Output) => {
      this.running = this.running.filter(running => running !== unit);
      this.results.push(result);

      if (this.work.length > 0 && this.running.length < concurrency) {
        this.runWorkUnit(context, value);
      } else if (this.work.length === 0 && this.running.length === 0 && this.resolver) {
        this.resolver(this.aggregateResult(this.results));
      }
    };

    return new Promise(resolve => {
      let timer: NodeJS.Timeout;

      if (timeout > 0) {
        timer = setTimeout(() => {
          resolve(handleResult(new RuntimeError('pipeline', 'PL_WORK_TIME_OUT')));
        }, timeout);
      }

      this.onRunWorkUnit.emit([unit, value]);

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
