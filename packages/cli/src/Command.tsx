/* eslint-disable @typescript-eslint/consistent-type-assertions */

import React from 'react';
import execa, { Options as ExecaOptions } from 'execa';
import {
  ArgList,
  Arguments,
  Argv,
  MapParamType,
  OptionConfigMap,
  ParamConfigList,
  ParserOptions,
  PrimitiveType,
  UnknownOptionMap,
} from '@boost/args';
import { Blueprint, Predicates } from '@boost/common';
import { LoggerFunction } from '@boost/log';
import CLIError from './CLIError';
import CommandManager from './CommandManager';
import { Help } from './components/Help';
import { INTERNAL_OPTIONS, INTERNAL_PARAMS, INTERNAL_PROGRAM } from './constants';
import mapCommandMetadata from './helpers/mapCommandMetadata';
import getConstructor from './metadata/getConstructor';
import getInheritedCategories from './metadata/getInheritedCategories';
import getInheritedOptions from './metadata/getInheritedOptions';
import globalOptions from './metadata/globalOptions';
import validateConfig from './metadata/validateConfig';
import validateOptions from './metadata/validateOptions';
import validateParams from './metadata/validateParams';
import Program from './Program';
import {
  Categories,
  Commandable,
  CommandMetadata,
  CommandPath,
  ExitCode,
  ExitHandler,
  GlobalOptions,
  RunResult,
  TaskContext,
} from './types';

export default abstract class Command<
    O extends GlobalOptions = GlobalOptions,
    P extends PrimitiveType[] = ArgList,
    Options extends object = {}
  >
  extends CommandManager<Options>
  implements Commandable<O, P> {
  static aliases: string[] = [];

  static allowUnknownOptions: boolean = false;

  static allowVariadicParams: boolean | string = false;

  static categories: Categories = {};

  static category: string = '';

  static description: string = '';

  static deprecated: boolean = false;

  static hidden: boolean = false;

  static options: OptionConfigMap = globalOptions;

  static params: ParamConfigList = [];

  static path: string = '';

  static usage: string[] | string = '';

  // Args

  help: boolean = false;

  locale: string = 'en';

  rest: string[] = [];

  unknown: UnknownOptionMap = {};

  version: boolean = false;

  // Methods

  exit!: ExitHandler;

  log!: LoggerFunction;

  // Internals

  [INTERNAL_OPTIONS]?: O;

  [INTERNAL_PARAMS]?: P;

  [INTERNAL_PROGRAM]?: Program;

  constructor(options?: Options) {
    super(options);

    const ctor = getConstructor(this);

    validateConfig(this.constructor.name, {
      aliases: ctor.aliases,
      allowUnknownOptions: ctor.allowUnknownOptions,
      allowVariadicParams: ctor.allowVariadicParams,
      categories: ctor.categories,
      category: ctor.category,
      deprecated: ctor.deprecated,
      description: ctor.description,
      hidden: ctor.hidden,
      path: ctor.path,
      usage: ctor.usage,
    });
    validateOptions(ctor.options);
    validateParams(ctor.params);

    this.onBeforeRegister.listen(this.handleBeforeRegister);
  }

  /**
   * Validate options passed to the constructor.
   */
  // Empty blueprint so that sub-classes may type correctly
  blueprint(preds: Predicates): Blueprint<object> {
    return {};
  }

  /**
   * Create a React element based on the Help component.
   */
  createHelp(): React.ReactElement {
    const metadata = this.getMetadata();

    return (
      <Help
        categories={metadata.categories}
        config={metadata}
        commands={mapCommandMetadata(metadata.commands)}
        delimiter={this[INTERNAL_PROGRAM]?.options.delimiter}
        header={metadata.path}
        options={metadata.options}
        params={metadata.params}
      />
    );
  }

  /**
   * Execute a system native command with the given arguments
   * and pass the results through a promise. This does *not* execute Boost CLI
   * commands, use `runProgram()` instead.
   */
  executeCommand(command: string, args: string[], options: ExecaOptions = {}) /* infer */ {
    const { streams } = this.getProgram();

    return execa(command, args, {
      ...streams,
      ...options,
    });
  }

  /**
   * Return the current command class as an arguments object.
   * Options and params must be parsed first to operate correctly.
   */
  getArguments(): Arguments<O, P> {
    return {
      command: this.getPath().split(':'),
      errors: [],
      options: (this[INTERNAL_OPTIONS] || {}) as O,
      params: ((this[INTERNAL_PARAMS] || []) as unknown) as MapParamType<P>,
      rest: this.rest,
      unknown: this.unknown,
    };
  }

  /**
   * Validate and return all metadata registered to this command instance.
   */
  getMetadata(): CommandMetadata {
    const ctor = getConstructor(this);
    const options: OptionConfigMap = {};

    // Since default values for options are represented as class properties,
    // we need to inject the defaults into the argument parsing layer.
    // We can easily do this here and avoid a lot of headache.
    Object.entries(getInheritedOptions(this)).forEach(([option, config]) => {
      options[option] = {
        ...config,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        default: this[option as keyof this] ?? config.default,
      };
    });

    return {
      aliases: ctor.aliases,
      allowUnknownOptions: ctor.allowUnknownOptions,
      allowVariadicParams: ctor.allowVariadicParams,
      categories: getInheritedCategories(this),
      category: ctor.category,
      commands: this.commands,
      deprecated: ctor.deprecated,
      description: ctor.description,
      hidden: ctor.hidden,
      options,
      params: ctor.params,
      path: ctor.path,
      usage: ctor.usage,
    };
  }

  /**
   * Return metadata as options for argument parsing.
   */
  getParserOptions(): ParserOptions<O, P> {
    const {
      aliases,
      allowUnknownOptions,
      allowVariadicParams,
      options,
      params,
      path,
    } = this.getMetadata();

    return {
      commands: [path, ...aliases],
      options,
      params,
      unknown: allowUnknownOptions,
      variadic: Boolean(allowVariadicParams),
    } as ParserOptions<O, P>;
  }

  /**
   * Return the command path (canonical name on the command line).
   */
  getPath(): string {
    return getConstructor(this).path;
  }

  /**
   * Render a React element with Ink and output to the configured streams.
   */
  async render(element: React.ReactElement) {
    return this.getProgram().renderElement(element);
  }

  /**
   * Run the program within itself, by passing a custom command and argv list.
   */
  runProgram = (argv: Argv): Promise<ExitCode> => this.getProgram().run(argv, true);

  /**
   * Run a task (function) with the defined arguments and
   * the current command instance bound to the task's context.
   */
  runTask = <A extends unknown[], R>(
    task: (this: TaskContext<O>, ...args: A) => R,
    ...args: A
  ): R => {
    // We dont want tasks to have full access to the command
    // and its methods, so recreate a similar but smaller context.
    const context: TaskContext<O> = {
      exit: this.exit,
      log: this.log,
      rest: this.rest,
      unknown: this.unknown,
      ...this[INTERNAL_OPTIONS]!,
      runProgram: this.runProgram,
      runTask: this.runTask,
    };

    return task.apply(context, args);
  };

  /**
   * Executed when the command is being ran.
   */
  abstract run(...params: P): Promise<RunResult> | RunResult;

  /**
   * Return the program instance or fail.
   */
  private getProgram(): Program {
    const program = this[INTERNAL_PROGRAM];

    if (!program) {
      throw new CLIError('COMMAND_NO_PROGRAM');
    }

    return program;
  }

  /**
   * Verify sub-command is prefixed with the correct path.
   */
  private handleBeforeRegister = (subPath: CommandPath) => {
    const path = this.getPath();

    if (!subPath.startsWith(path)) {
      throw new CLIError('COMMAND_INVALID_SUBPATH', [subPath, path]);
    }
  };
}
