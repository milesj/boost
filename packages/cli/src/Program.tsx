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
import { Contract, Predicates } from '@boost/common';
import { Logger, createLogger } from '@boost/log';
import { ExitError, env } from '@boost/internal';
import levenary from 'levenary';
import LogBuffer from './LogBuffer';
import Command from './Command';
import Failure from './Failure';
import Help from './Help';
import IndexHelp from './IndexHelp';
import Wrapper from './Wrapper';
import mapCommandMetadata from './helpers/mapCommandMetadata';
import { msg, VERSION_FORMAT, EXIT_PASS, EXIT_FAIL } from './constants';
import {
  Commandable,
  CommandMetadata,
  ExitCode,
  GlobalOptions,
  ProgramOptions,
  ProgramStreams,
  RunResult,
} from './types';

export default class Program extends Contract<ProgramOptions> {
  protected commands: CommandMetadata['commands'] = {};

  protected commandLine: string = '';

  protected indexCommand: string = '';

  protected logger: Logger;

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
   * Return a command or sub-command by name. If a sub-command is provided,
   * it will attempt to drill down from the parent command.
   * If no command can be found, `null` will be returned.
   */
  getCommand<O extends GlobalOptions, P extends PrimitiveType[] = ArgList>(
    name: string,
  ): Command<O, P> | null {
    const names = name.split(':');
    const baseName = names.shift()!;
    let command = this.commands[baseName];

    while (command && names.length > 0) {
      const subName = names.shift()!;
      const subPath = `${command.getPath()}:${subName}`;
      const subCommands = command.getMetadata().commands;

      if (subCommands[subPath]) {
        command = subCommands[subPath];
      } else {
        return null;
      }
    }

    if (!command) {
      return null;
    }

    return command as Command<O, P>;
  }

  /**
   * Return a list of all registered command paths.
   * If deep is true, will return all nested command paths.
   */
  getCommandPaths(deep: boolean = false): string[] {
    const paths = new Set<string>();

    function drill(commands: CommandMetadata['commands']) {
      Object.entries(commands).forEach(([path, command]) => {
        paths.add(path);

        if (deep) {
          drill(command.getMetadata().commands);
        }
      });
    }

    drill(this.commands);

    return Array.from(paths);
  }

  /**
   * Exit the program with an error code.
   * Should be called within a command or component.
   */
  exit(message: string, code?: ExitCode) {
    throw new ExitError(message, code || 1);
  }

  /**
   * Register a command and its canonical path as the index or primary command.
   * An index should be used when only a single command is required.
   */
  index(command: Commandable): this {
    if (Object.keys(this.commands).length > 0) {
      throw new Error(
        'Other commands have been registered. Cannot mix index and non-index commands.',
      );
    }

    this.register(command);
    this.indexCommand = command.getPath();

    return this;
  }

  /**
   * Register a command and its canonical path. Paths must be unique,
   * otherwise an error is thrown. Furthermore, sub-commands should not be
   * registered here, and instead should be registered in the parent command.
   */
  register(command: Commandable): this {
    const path = command.getPath();

    if (this.commands[path]) {
      throw new Error(`A command has already been registered with the canonical path "${path}".`);
    } else if (this.indexCommand) {
      throw new Error(
        'An index command has been registered. Cannot mix index and non-index commands.',
      );
    }

    this.commands[path] = command;

    return this;
  }

  /**
   * Run the program by parsing argv into an object of options and parameters,
   * while executing the found command.
   */
  async run(argv: Argv): Promise<ExitCode> {
    this.commandLine = [this.options.bin, ...argv].join(' ');

    let exitCode: ExitCode;

    try {
      exitCode = await this.doRun(argv);
    } catch (error) {
      exitCode = await this.renderErrors([error]);
    }

    // istanbul ignore next
    if (process.env.NODE_ENV !== 'test') {
      process.exitCode = exitCode;
    }

    return exitCode;
  }

  /**
   * Internal run that does all the heavy lifting and parsing,
   * while the public run exists to catch any unexpected errors.
   */
  protected async doRun(argv: Argv): Promise<ExitCode> {
    const showVersion = argv.some(arg => arg === '-v' || arg === '--version');
    const showHelp = argv.some(arg => arg === '-h' || arg === '--help');

    // Display index and or help
    if ((!this.indexCommand && argv.length === 0) || (argv.length === 1 && showHelp)) {
      return this.render(this.createIndex());
    }

    // Display version
    if (showVersion) {
      return this.render(this.options.version);
    }

    // Parse the arguments
    const { command: cmd, errors, options, params, rest } = this.parseArguments(argv);
    const path = cmd.join(':') || this.indexCommand;
    const command = this.getCommand(path)!;

    // Display command help
    if (options.help) {
      return this.render(command.renderHelp());
    }

    // Display errors
    if (errors.length > 0) {
      return this.renderErrors(errors);
    }

    // Apply arguments to command properties
    Object.assign(command, options);

    command.rest = rest;
    command.exit = this.exit;
    command.log = this.logger;
    command.bootstrap();

    return this.render(() => command.run(...params), EXIT_PASS);
  }

  /**
   * Render the index screen when no args are passed.
   * Should include banner, header, footer, and command (if applicable).
   */
  protected createIndex(): React.ReactElement {
    const command = this.getCommand(this.indexCommand);

    return (
      <IndexHelp {...this.options}>
        {command?.renderHelp() || (
          <Help header={msg('cli:labelAbout')} commands={mapCommandMetadata(this.commands)} />
        )}
      </IndexHelp>
    );
  }

  /**
   * Parse the arguments list according to the number of commands that have been registered.
   */
  protected parseArguments<O extends GlobalOptions, P extends PrimitiveType[] = ArgList>(
    argv: Argv,
  ): Arguments<O, P> {
    if (Object.keys(this.commands).length === 0) {
      throw new Error('No commands have been registered. At least 1 is required.');
    }

    if (this.indexCommand) {
      return parse(argv, this.getCommand<O, P>(this.indexCommand)!.getParserOptions());
    }

    try {
      return parseInContext(argv, arg => this.getCommand<O, P>(arg)?.getParserOptions());
    } catch {
      const [possibleCmd] = argv.filter(arg => !arg.startsWith('-'));

      if (possibleCmd) {
        const closestCmd = levenary(possibleCmd, this.getCommandPaths());

        throw new Error(`Unknown command "${possibleCmd}". Did you mean "${closestCmd}"?`);
      }

      throw new Error('Failed to determine a command to run.');
    }
  }

  /**
   * Render the result of a command's run to the defined stream.
   * If a string has been returned, write it immediately.
   * If a React component, render with Ink and wait for it to finish.
   */
  protected async render(
    result: RunResult | (() => RunResult | Promise<RunResult>),
    exitCode: ExitCode = EXIT_PASS,
  ): Promise<ExitCode> {
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

      const children = typeof result === 'function' ? await result() : result;

      await render(
        <Wrapper
          errBuffer={this.errBuffer}
          exit={this.exit}
          logger={this.logger}
          outBuffer={this.outBuffer}
          program={this.options}
        >
          {children as React.ReactElement}
        </Wrapper>,
        {
          debug: process.env.NODE_ENV === 'test',
          experimental: true,
          stdin,
          stdout,
        },
      ).waitUntilExit();
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
        commandLine={this.commandLine}
        error={error}
        warnings={validErrors.filter(verror => verror !== error)}
      />,
      error instanceof ExitError ? error.code : EXIT_FAIL,
    );
  }
}
