/* eslint-disable @typescript-eslint/consistent-type-assertions */

import React from 'react';
import execa, { Options as ExecaOptions } from 'execa';
import {
  ArgList,
  PrimitiveType,
  ParserOptions,
  ParamConfigList,
  OptionConfigMap,
  UnknownOptionMap,
  Argv,
} from '@boost/args';
import { Logger } from '@boost/log';
import { LOCALE_FORMAT, INTERNAL_OPTIONS, INTERNAL_PARAMS, INTERNAL_PROGRAM } from './constants';
import {
  Categories,
  Commandable,
  CommandMetadata,
  CommandPath,
  ExitHandler,
  GlobalOptions,
  RunResult,
  TaskContext,
  ExitCode,
} from './types';
import mapCommandMetadata from './helpers/mapCommandMetadata';
import getConstructor from './metadata/getConstructor';
import getInheritedCategories from './metadata/getInheritedCategories';
import getInheritedOptions from './metadata/getInheritedOptions';
import validateParams from './metadata/validateParams';
import validateOptions from './metadata/validateOptions';
import validateConfig from './metadata/validateConfig';
import CLIError from './CLIError';
import CommandManager from './CommandManager';
import Help from './Help';
import Program from './Program';
import msg from './translate';

export default abstract class Command<
  O extends GlobalOptions = GlobalOptions,
  P extends PrimitiveType[] = ArgList,
  Options extends object = {}
> extends CommandManager<Options> implements Commandable<O, P> {
  static aliases: string[] = [];

  static allowUnknownOptions: boolean = false;

  static allowVariadicParams: boolean | string = false;

  static categories: Categories = {};

  static category: string = '';

  static description: string = '';

  static deprecated: boolean = false;

  static hidden: boolean = false;

  static options: OptionConfigMap = {
    help: {
      category: 'global',
      description: msg('cli:optionHelpDescription'),
      short: 'h',
      type: 'boolean',
    },
    locale: {
      category: 'global',
      default: 'en',
      description: msg('cli:optionLocaleDescription'),
      type: 'string',
      validate(value: string) {
        if (value && !value.match(LOCALE_FORMAT)) {
          throw new Error(msg('cli:errorInvalidLocale'));
        }
      },
    },
    version: {
      category: 'global',
      description: msg('cli:optionVersionDescription'),
      short: 'v',
      type: 'boolean',
    },
  };

  static params: ParamConfigList = [];

  static path: string = '';

  static usage: string | string[] = '';

  // Args

  help: boolean = false;

  locale: string = 'en';

  rest: string[] = [];

  unknown: UnknownOptionMap = {};

  version: boolean = false;

  // Methods

  exit!: ExitHandler;

  log!: Logger;

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
  blueprint() {
    // This is technically invalid, but most commands will not be using options.
    // This is a side-effect of `CommandManager`, in which options are required for `Program`.
    return {};
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
   * Validate and return all metadata registered to this command instance.
   */
  getMetadata(): CommandMetadata {
    const ctor = getConstructor(this);

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
      options: getInheritedOptions(this),
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
    const defaultedOptions: OptionConfigMap = {};

    // Since default values for options are represented as class properties,
    // we need to inject the defaults into the argument parsing layer.
    // We can easily do this here and avoid a lot of headache.
    Object.entries(options).forEach(([option, config]) => {
      defaultedOptions[option] = {
        ...config,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        default: this[option as keyof this] ?? config.default,
      };
    });

    return {
      commands: [path, ...aliases],
      options: defaultedOptions,
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
   * Render a help menu for the current command.
   */
  renderHelp(): React.ReactElement {
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
  abstract run(...params: P): RunResult | Promise<RunResult>;

  /**
   * Return the program instance of fail.
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
