import execa, { Options as ExecaOptions, ExecaChildProcess } from 'execa';
import split from 'split';
import { RuntimeError } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { Event } from '@boost/event';
import Context from './Context';
import WorkUnit from './WorkUnit';
import { msg } from './constants';

export interface CommandOptions {
  workUnit?: WorkUnit<any, any, any>;
  wrap?: (process: ExecaChildProcess) => void;
}

export default abstract class Routine<
  Options extends object,
  Input,
  Output = Input
> extends WorkUnit<Options, Input, Output> {
  readonly debug: Debugger;

  readonly key: string;

  readonly onCommand = new Event<[string]>('command');

  readonly onCommandData = new Event<[string, string]>('command-data');

  constructor(key: string, title: string, options?: Options) {
    super(title, (context, value) => this.execute(context, value), options);

    if (!key || typeof key !== 'string') {
      throw new RuntimeError('INVALID_ROUTINE_KEY', msg('error:INVALID_ROUTINE_KEY'));
    }

    this.key = key;
    this.debug = createDebugger(['routine', this.key]);
  }

  /**
   * Called once the routine has been configured and is ready to execute.
   */
  async bootstrap() {
    // Empty
  }

  /**
   * Execute a command with the given arguments and pass the results through a promise.
   */
  async executeCommand(
    command: string,
    args: string[],
    options: ExecaOptions & CommandOptions = {},
  ): Promise<ExecaChildProcess> {
    const { workUnit, wrap, ...opts } = options;
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

    stream.stdout!.pipe(split()).on('data', handler);
    stream.stderr!.pipe(split()).on('data', handler);

    // Allow consumer to wrap functionality
    if (typeof wrap === 'function') {
      wrap(stream);
    }

    return stream as any;
  }

  /**
   * Execute the current routine and return a new value.
   */
  abstract async execute<Ctx extends Context>(context: Ctx, value: Input): Promise<Output>;
}
