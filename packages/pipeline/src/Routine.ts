import execa, { Options as ExecaOptions, ExecaChildProcess } from 'execa';
import kebabCase from 'lodash/kebabCase';
import split from 'split';
import { createDebugger, Debugger } from '@boost/debug';
import { Event } from '@boost/event';
import Context from './Context';
import WorkUnit from './WorkUnit';
import ConcurrentPipeline from './ConcurrentPipeline';
import PooledPipeline, { PooledOptions } from './PooledPipeline';
import AggregatedPipeline from './AggregatedPipeline';
import WaterfallPipeline from './WaterfallPipeline';

export interface ExecuteCommandOptions {
  workUnit?: WorkUnit<any, any, any>;
}

export default abstract class Routine<
  Options extends object,
  Input,
  Output = Input
> extends WorkUnit<Options, Input, Output> {
  readonly debug: Debugger;

  readonly key: string;

  // Emits before the command is ran
  readonly onCommand = new Event<[string]>('command');

  // Emits on each line chunk of the running command
  readonly onCommandData = new Event<[string, string]>('command-data');

  constructor(key: string, title: string, options?: Options) {
    super(title, (context, value) => this.execute(context, value), options);

    if (!key || typeof key !== 'string') {
      throw new Error('Routine key must be a valid unique string.');
    }

    this.key = kebabCase(key);
    this.debug = createDebugger(['routine', this.key]);
  }

  /**
   * Execute a command with the given arguments and pass the results through a promise.
   */
  async executeCommand(
    command: string,
    args: string[],
    options: ExecaOptions & ExecuteCommandOptions = {},
  ): Promise<ExecaChildProcess> {
    const { workUnit, ...opts } = options;
    const stream = execa(command, args, opts);

    this.onCommand.emit([command]);

    // Push chunks to the reporter
    const unit = workUnit || this;
    const handler = (line: string) => {
      if (unit.isRunning()) {
        unit.output += line;

        // Only capture the status when not empty
        if (line) {
          unit.statusText = line;
        }

        this.onCommandData.emit([command, line]);
      }
    };

    stream.stderr!.pipe(split()).on('data', handler);
    stream.stdout!.pipe(split()).on('data', handler);

    return stream as any;
  }

  /**
   * Create and return a `AggregatedPipeline`. This pipeline will execute all work units
   * in parallel without interruption. Returns a list of errors and results once all resolve.
   */
  createAggregatedPipeline<C extends Context, I, O = I>(context: C, value: I) {
    return new AggregatedPipeline<C, I, O>(context, value);
  }

  /**
   * Create and return a `ConcurrentPipeline`. This pipeline will execute all work units
   * in parallel. Returns a list of values once all resolve.
   */
  createConcurrentPipeline<C extends Context, I, O = I>(context: C, value: I) {
    return new ConcurrentPipeline<C, I, O>(context, value);
  }

  /**
   * Create and return a `PooledPipeline`. This pipeline will execute a distinct set of work units
   * in parallel without interruption, based on a max concurrency, until all work units have ran.
   * Returns a list of errors and results once all resolve.
   */
  createPooledPipeline<C extends Context, I, O = I>(context: C, value: I, options?: PooledOptions) {
    return new PooledPipeline<C, I, O>(context, value, options);
  }

  /**
   * Create and return a `WaterfallPipeline`. This pipeline will execute each work unit one by one,
   * with the return value of the previous being passed to the next. Returns the final value once
   * all resolve.
   */
  createWaterfallPipeline<C extends Context, I>(context: C, value: I) {
    return new WaterfallPipeline<C, I>(context, value);
  }

  /**
   * Execute the current routine and return a new value.
   */
  abstract async execute<Ctx extends Context>(context: Ctx, value: Input): Promise<Output>;
}
