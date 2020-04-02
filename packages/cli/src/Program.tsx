import React from 'react';
import { render } from 'ink';
import {
  ArgList,
  Arguments,
  Argv,
  parse,
  ParseError,
  parseInContext,
  PrimitiveType,
  ValidationError,
} from '@boost/args';
import { Predicates } from '@boost/common';
import { Event } from '@boost/event';
import { Logger, createLogger } from '@boost/log';
import { ExitError, env, RuntimeError } from '@boost/internal';
import levenary from 'levenary';
import Command from './Command';
import CommandManager from './CommandManager';
import LogBuffer from './LogBuffer';
import Failure from './Failure';
import Help from './Help';
import IndexHelp from './IndexHelp';
import Wrapper from './Wrapper';
import mapCommandMetadata from './helpers/mapCommandMetadata';
import removeProcessBin from './middleware/removeProcessBin';
import {
  msg,
  VERSION_FORMAT,
  EXIT_PASS,
  EXIT_FAIL,
  CACHE_OPTIONS,
  CACHE_PARAMS,
} from './constants';
import {
  Commandable,
  CommandPath,
  ExitCode,
  GlobalOptions,
  ProgramOptions,
  ProgramStreams,
  RunResult,
  Middleware,
  MiddlewareNext,
  MiddlewareArguments,
} from './types';

export default class Program extends CommandManager<ProgramOptions> {
  readonly onAfterRender = new Event('after-render');

  readonly onAfterRun = new Event<[Error?]>('after-run');

  readonly onBeforeRender = new Event<[RunResult]>('before-render');

  readonly onBeforeRun = new Event<[Argv]>('before-run');

  readonly onCommandFound = new Event<[Argv, CommandPath, Commandable]>('command-found');

  readonly onCommandNotFound = new Event<[Argv, CommandPath]>('command-not-found');

  readonly onExit = new Event<[string, ExitCode]>('exit');

  readonly onHelp = new Event<[CommandPath?]>('help');

  protected commandLine: string = '';

  protected logger: Logger;

  protected middlewares: Middleware[] = [removeProcessBin];

  protected standAlone: CommandPath = '';

  protected streams: ProgramStreams = {
    stderr: process.stderr,
    stdin: process.stdin,
    stdout: process.stdout,
  };

  private errBuffer: LogBuffer;

  private outBuffer: LogBuffer;

  constructor(options: ProgramOptions, streams?: ProgramStreams) {
    super(options);

    Object.assign(this.streams, streams);

    this.errBuffer = new LogBuffer('stderr');
    this.outBuffer = new LogBuffer('stdout');

    this.logger = createLogger({
      // Use outBuffer until ink supports stderr
      stderr: this.outBuffer,
      stdout: this.outBuffer,
    });

    this.onAfterRegister.listen(this.handleAfterRegister);
    this.onBeforeRegister.listen(this.handleBeforeRegister);
  }

  blueprint({ string }: Predicates) {
    return {
      banner: string(),
      bin: string()
        .notEmpty()
        .required()
        .kebabCase(),
      footer: string(),
      header: string(),
      name: string()
        .notEmpty()
        .required(),
      version: string()
        .required()
        .match(VERSION_FORMAT),
    };
  }

  /**
   * Register a command and its canonical path as the default command.
   * A default command should be used when stand-alone binary is required.
   */
  default(command: Commandable): this {
    if (Object.keys(this.commands).length > 0) {
      throw new RuntimeError('cli', 'CLI_COMMAND_MIXED_NONDEFAULT');
    }

    this.register(command);
    this.standAlone = command.getPath();

    return this;
  }

  /**
   * Exit the program with an error code.
   * Should be called within a command or component.
   */
  exit = (message: string, code: ExitCode = 1) => {
    this.onExit.emit([message, code]);

    throw new ExitError(message, code);
  };

  /**
   * Define a middleware function to apply to the argv list or args object.
   */
  middleware(middleware: Middleware): this {
    if (typeof middleware !== 'function') {
      throw new RuntimeError('cli', 'CLI_MIDDLEWARE_INVALID');
    }

    this.middlewares.push(middleware);

    return this;
  }

  /**
   * Parse the arguments list according to the number of commands that have been registered.
   */
  parse<O extends GlobalOptions, P extends PrimitiveType[] = ArgList>(argv: Argv): Arguments<O, P> {
    if (Object.keys(this.commands).length === 0) {
      throw new RuntimeError('cli', 'CLI_COMMAND_NONE_REGISTERED');
    }

    if (this.standAlone) {
      return parse(argv, this.getCommand<O, P>(this.standAlone)!.getParserOptions());
    }

    try {
      return parseInContext(argv, arg => this.getCommand<O, P>(arg)?.getParserOptions());
    } catch {
      const [possibleCmd] = argv.filter(arg => !arg.startsWith('-'));

      this.onCommandNotFound.emit([argv, possibleCmd]);

      if (possibleCmd) {
        const closestCmd = levenary(possibleCmd, this.getCommandPaths());

        throw new RuntimeError('cli', 'CLI_COMMAND_UNKNOWN', [possibleCmd, closestCmd]);
      }

      throw new RuntimeError('cli', 'CLI_COMMAND_INVALID_RUN');
    }
  }

  /**
   * Run the program by parsing argv into an object of options and parameters,
   * while executing the found command.
   */
  async run(argv: Argv): Promise<ExitCode> {
    this.onBeforeRun.emit([argv]);

    let exitCode: ExitCode;

    try {
      exitCode = await this.doRun(argv);

      this.onAfterRun.emit([]);
    } catch (error) {
      exitCode = await this.renderErrors([error]);

      this.onAfterRun.emit([error]);
    }

    // istanbul ignore next
    if (process.env.NODE_ENV !== 'test') {
      process.exitCode = exitCode;
    }

    return exitCode;
  }

  /**
   * Render the index screen when no args are passed.
   * Should include banner, header, footer, and command (if applicable).
   */
  protected createIndex(): React.ReactElement {
    return (
      <IndexHelp {...this.options}>
        {this.getCommand(this.standAlone)?.renderHelp() || (
          <Help header={msg('cli:labelAbout')} commands={mapCommandMetadata(this.commands)} />
        )}
      </IndexHelp>
    );
  }

  /**
   * Internal run that does all the heavy lifting and parsing,
   * while the public run exists to catch any unexpected errors.
   */
  protected async doRun(argv: Argv): Promise<ExitCode> {
    const showVersion = argv.some(arg => arg === '-v' || arg === '--version');
    const showHelp = argv.some(arg => arg === '-h' || arg === '--help');

    // Display index help
    if ((!this.standAlone && argv.length === 0) || (argv.length === 1 && showHelp)) {
      this.onHelp.emit([]);

      return this.render(this.createIndex());
    }

    // Display version
    if (showVersion) {
      return this.render(this.options.version);
    }

    // Parse the arguments
    const {
      command: paths,
      errors,
      options,
      params,
      rest,
      unknown,
    } = await this.applyMiddlewareAndParseArgs(argv);
    const path = paths.join(':') || this.standAlone;
    const command = this.getCommand(path) as Command;

    this.onCommandFound.emit([argv, path, command]);

    // Display command help
    if (options.help) {
      this.onHelp.emit([path]);

      return this.render(command.renderHelp());
    }

    // Display errors
    if (errors.length > 0) {
      return this.renderErrors(errors);
    }

    // Apply arguments to command properties
    Object.assign(command, options);

    command.rest = rest;
    command.unknown = unknown;
    command.exit = this.exit;
    command.log = this.logger;
    command[CACHE_OPTIONS] = options;
    command[CACHE_PARAMS] = params;
    command.bootstrap();

    return this.render(await command.run(...params), EXIT_PASS);
  }

  /**
   * Loop through all middleware to modify the argv list
   * and resulting args object.
   */
  protected applyMiddlewareAndParseArgs(
    argv: Argv,
  ): MiddlewareArguments | Promise<MiddlewareArguments> {
    let index = -1;

    const next: MiddlewareNext = nextArgv => {
      index += 1;
      const middleware = this.middlewares[index];

      // Keep calling middleware until we exhaust them all
      if (middleware) {
        return middleware(nextArgv, next);
      }

      // Otherwise all middleware have ran, so parse the final list
      this.commandLine = nextArgv.join(' ');

      return this.parse(nextArgv);
    };

    return next(argv);
  }

  /**
   * Render the result of a command's run to the defined stream.
   * If a string has been returned, write it immediately.
   * If a React component, render with Ink and wait for it to finish.
   */
  protected async render(result: RunResult, exitCode: ExitCode = EXIT_PASS): Promise<ExitCode> {
    const { stdin, stdout } = this.streams;

    // For simple strings, ignore react and the buffer
    if (typeof result === 'string') {
      this.errBuffer.flush();
      this.outBuffer.flush();

      stdout.write(result);

      return exitCode;
    }

    try {
      this.errBuffer.wrap();
      this.outBuffer.wrap();

      this.onBeforeRender.emit([result]);

      await render(
        <Wrapper
          errBuffer={this.errBuffer}
          exit={this.exit}
          logger={this.logger}
          outBuffer={this.outBuffer}
          program={this.options}
        >
          {result || null}
        </Wrapper>,
        {
          debug: process.env.NODE_ENV === 'test',
          experimental: true,
          stdin,
          stdout,
        },
      ).waitUntilExit();

      this.onAfterRender.emit([]);
    } finally {
      this.errBuffer.unwrap();
      this.outBuffer.unwrap();
    }

    return exitCode;
  }

  /**
   * Render an error and warnings menu based on the list provided.
   * If argument parser or validation errors are found, treat them with special logic.
   */
  protected renderErrors(errors: Error[]): Promise<ExitCode> {
    const parseErrors = errors.filter(error => error instanceof ParseError);
    const validErrors = errors.filter(error => error instanceof ValidationError);
    const error = parseErrors[0] ?? validErrors[0] ?? errors[0];

    // Mostly for testing, but useful for other things
    // istanbul ignore next
    if (env('CLI_FAIL_HARD')) {
      throw error;
    }

    return this.render(
      <Failure
        binName={this.options.bin}
        commandLine={this.commandLine}
        error={error}
        warnings={validErrors.filter(verror => verror !== error)}
      />,
      error instanceof ExitError ? error.code : EXIT_FAIL,
    );
  }

  /**
   * Deeply register all commands so that we can easily access it during parse.
   */
  protected handleAfterRegister = (_path: CommandPath, command: Commandable) => {
    const deepRegister = (cmd: Commandable) => {
      const { aliases, commands, path } = cmd.getMetadata();

      this.commands[path] = cmd;

      aliases.forEach(alias => {
        this.commandAliases[alias] = path;
      });

      Object.values(commands).forEach(deepRegister);
    };

    deepRegister(command);
  };

  /**
   * Check for default and non-default command mixing.
   */
  protected handleBeforeRegister = () => {
    if (this.standAlone) {
      throw new RuntimeError('cli', 'CLI_COMMAND_MIXED_DEFAULT');
    }
  };
}
