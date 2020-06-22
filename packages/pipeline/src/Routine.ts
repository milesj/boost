import execa, { Options as ExecaOptions } from 'execa';
import kebabCase from 'lodash/kebabCase';
import split from 'split';
import { toArray } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { Event } from '@boost/event';
import PipelineError from './PipelineError';
import Context from './Context';
import WorkUnit from './WorkUnit';
import ConcurrentPipeline from './ConcurrentPipeline';
import PooledPipeline, { PooledOptions } from './PooledPipeline';
import AggregatedPipeline from './AggregatedPipeline';
import WaterfallPipeline from './WaterfallPipeline';
import { Hierarchical } from './types';
import { debug } from './constants';

export interface ExecuteCommandOptions {
  // Unknown does not work here as it conflicts with event tuples.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  workUnit?: WorkUnit<{}, any, any>;
}

export default abstract class Routine<
  Output = unknown,
  Input = unknown,
  Options extends object = {}
> extends WorkUnit<Options, Input, Output> {
  readonly debug: Debugger;

  readonly key: string;

  // Emits before the command is ran
  readonly onCommand = new Event<[string, string[]]>('command');

  // Emits on each line chunk of the running command
  readonly onCommandData = new Event<[string, string]>('command-data');

  constructor(key: string | string[], title: string, options?: Options) {
    super(title, (context, value) => this.execute(context, value), options);

    if (!key || key.length === 0 || (typeof key !== 'string' && !Array.isArray(key))) {
      throw new PipelineError('INVALID_ROUTINE_KEY');
    }

    this.key = toArray(key).map(kebabCase).join(':');
    this.debug = createDebugger(['routine', this.key]);

    debug('New routine created: %s (%s)', this.key, this.title);
  }

  /**
   * Execute a command with the given arguments and pass the results through a promise.
   */
  async executeCommand(
    command: string,
    args: string[],
    options: ExecaOptions & ExecuteCommandOptions = {},
  ) /* infer */ {
    const { workUnit, ...opts } = options;
    const stream = execa(command, args, opts);

    this.onCommand.emit([command, args]);

    // Push chunks to the reporter
    const unit = workUnit || this;
    const handler = (line: string) => {
      if (unit.isRunning()) {
        // Only capture the status when not empty
        if (line) {
          unit.statusText = line;
        }

        this.onCommandData.emit([command, line]);
      }
    };

    stream.stderr!.pipe(split()).on('data', handler);
    stream.stdout!.pipe(split()).on('data', handler);

    return stream;
  }

  /**
   * Create and return a `AggregatedPipeline`. This pipeline will execute all work units
   * in parallel without interruption. Returns an object with a list of errors and results
   * once all resolve.
   */
  createAggregatedPipeline<C extends Context, I = unknown, O = I>(context: C, value?: I) {
    return this.updateHierarchy(new AggregatedPipeline<C, I, O>(context, value));
  }

  /**
   * Create and return a `ConcurrentPipeline`. This pipeline will execute all work units
   * in parallel. Returns a list of values once all resolve.
   */
  createConcurrentPipeline<C extends Context, I = unknown, O = I>(context: C, value?: I) {
    return this.updateHierarchy(new ConcurrentPipeline<C, I, O>(context, value));
  }

  /**
   * Create and return a `PooledPipeline`. This pipeline will execute a distinct set of work units
   * in parallel without interruption, based on a max concurrency, until all work units have ran.
   * Returns a list of errors and results once all resolve.
   */
  createPooledPipeline<C extends Context, I = unknown, O = I>(
    context: C,
    value?: I,
    options?: PooledOptions,
  ) {
    return this.updateHierarchy(new PooledPipeline<C, I, O>(context, value, options));
  }

  /**
   * Create and return a `WaterfallPipeline`. This pipeline will execute each work unit one by one,
   * with the return value of the previous being passed to the next. Returns the final value once
   * all resolve.
   */
  createWaterfallPipeline<C extends Context, I = unknown>(context: C, value?: I) {
    return this.updateHierarchy(new WaterfallPipeline<C, I>(context, value));
  }

  /**
   * Update the hierarchical depth when creating a nested pipeline.
   */
  protected updateHierarchy<P extends Hierarchical>(pipeline: P): P {
    // eslint-disable-next-line no-param-reassign
    pipeline.depth = this.depth + 1;

    return pipeline;
  }

  /**
   * Execute the current routine and return a new value.
   */
  abstract async execute(context: Context, value: Input): Promise<Output>;
}
