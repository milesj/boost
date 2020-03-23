import React from 'react';
import { render } from 'ink';
import {
  Argv,
  parse,
  parseInContext,
  PrimitiveType,
  ParseError,
  ValidationError,
  Arguments,
  ArgList,
} from '@boost/args';
import { Contract, Predicates } from '@boost/common';
import { Logger, createLogger } from '@boost/log';
import { ExitError } from '@boost/internal';
import levenary from 'levenary';
import {
  ProgramOptions,
  Commandable,
  GlobalArgumentOptions,
  ProgramStreams,
  ExitCode,
  CommandMetadata,
  CommandMetadataMap,
  RunResult,
} from './types';
import Command from './Command';
import Failure from './Failure';
import Help from './Help';
import Wrapper from './Wrapper';
import { VERSION_FORMAT, EXIT_PASS, EXIT_FAIL } from './constants';
import getConstructor from './metadata/getConstructor';

export default class Program extends Contract<ProgramOptions> {
  protected commands: CommandMetadata['commands'] = {};

  protected commandLine: string = '';

  protected indexCommand: string = '';

  protected logger: Logger = createLogger();

  protected streams: ProgramStreams = {
    stderr: process.stderr,
    stdin: process.stdin,
    stdout: process.stdout,
  };

  constructor(options: ProgramOptions, streams?: ProgramStreams) {
    super(options);

    Object.assign(this.streams, streams);
  }

  blueprint({ string }: Predicates) {
    return {
      banner: string(),
      bin: string()
        .notEmpty()
        .required()
        .kebabCase(),
      footer: string(),
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
  getCommand<O extends GlobalArgumentOptions, P extends PrimitiveType[] = ArgList>(
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
    const paths = new Set(Object.keys(this.commands));

    function drill(commands: CommandMetadata['commands']) {
      Object.entries(commands).forEach(([path, command]) => {
        paths.add(path);
        drill(command.getMetadata().commands);
      });
    }

    if (deep) {
      drill(this.commands);
    }

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

  // TODO unknown options
  // index help
  async run(argv: Argv): Promise<ExitCode> {
    this.commandLine = argv.join(' ');

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
    if (argv.length === 0) {
      return this.renderIndex();
    }

    const { command: cmd, errors, options, params, rest } = this.parseArguments(argv);
    const path = cmd.join(':') || this.indexCommand;

    // Display version
    if (options.version) {
      return this.render(this.options.version, EXIT_PASS);
    }

    // Display help and usage
    if (options.help) {
      return this.renderHelp(path);
    }

    // Display errors
    if (errors.length > 0) {
      return this.renderErrors(errors);
    }

    // Apply arguments to command properties
    const command = this.getCommand(path)!;
    const metadata = command.getMetadata();

    Object.entries(options).forEach(([key, value]) => {
      const config = metadata.options[key];

      if (config) {
        // @ts-ignore Allow this
        command[key] = value;
      }
    });

    getConstructor(command).rest = rest;

    // Render command with params
    command.bootstrap();
    command.exit = this.exit;
    command.log = this.logger;

    return this.render(await command.run(...params), EXIT_PASS);
  }

  /**
   * Map a list of commands to their registered metadata.
   */
  protected mapCommandMetadata(commands: CommandMetadata['commands']): CommandMetadataMap {
    const map: CommandMetadataMap = {};

    Object.entries(commands).forEach(([path, config]) => {
      map[path] = config.getMetadata();
    });

    return map;
  }

  /**
   * Parse the arguments list according to the number of commands that have been registered.
   */
  protected parseArguments<O extends GlobalArgumentOptions, P extends PrimitiveType[] = ArgList>(
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
  protected async render(result: RunResult, exitCode: ExitCode): Promise<ExitCode> {
    if (!result) {
      return exitCode;
    }

    const { stdin, stdout } = this.streams;

    if (typeof result === 'string') {
      stdout.write(result);
    } else {
      await render(
        <Wrapper exit={this.exit} logger={this.logger} program={this.options}>
          {result}
        </Wrapper>,
        {
          debug: process.env.NODE_ENV === 'test',
          experimental: true,
          stdin,
          stdout,
        },
      ).waitUntilExit();
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

    return this.render(
      <Failure commandLine={this.commandLine} error={error} warnings={validErrors} />,
      error instanceof ExitError ? error.code : EXIT_FAIL,
    );
  }

  /**
   * Render a command help menu using the command's metadata.
   */
  protected renderHelp(path: string): Promise<ExitCode> {
    const command = this.getCommand(path)!;
    const metadata = command.getMetadata();

    return this.render(
      <Help
        config={metadata}
        commands={this.mapCommandMetadata(metadata.commands)}
        options={metadata.options}
        params={metadata.params}
      />,
      EXIT_PASS,
    );
  }

  /**
   * Render the index screen when no args are passed.
   * Should include banner, header, footer, and command (if applicable).
   */
  protected renderIndex(): Promise<ExitCode> {
    return this.render('TODO', EXIT_PASS);
  }
}
