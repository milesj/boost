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

export default class Program extends Contract<ProgramOptions> {
  protected commands = new Map<string, Commandable>();

  protected commandLine: string = '';

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
    name: string | string[],
  ): Command<O, P> | null {
    const names = Array.isArray(name) ? [...name] : name.split(':');
    const baseName = names.shift()!;
    let command = this.commands.get(baseName);

    while (names.length > 0) {
      if (!command) {
        return null;
      }

      const subName = names.shift()!;
      const subCommands = command.getMetadata().commands;

      if (subCommands[subName]) {
        command = subCommands[subName];
      } else {
        return null;
      }
    }

    if (!command) {
      return null;
    }

    // Bootstrap command
    const cmd = command as Command<O, P>;

    cmd.exit = this.exit;
    cmd.log = this.logger;

    return cmd;
  }

  /**
   * Exit the program with an error code.
   * Should be called within a command or component.
   */
  exit(message: string, code: ExitCode) {
    throw new ExitError(message, code || 1);
  }

  /**
   * Register a root command and its canonical path. Paths must be unique,
   * otherwise an error is thrown. Furthermore, sub-commands should not be
   * registered here, and instead should be registered in the parent command.
   */
  register(command: Commandable): this {
    const path = command.getPath();

    if (this.commands.has(path)) {
      throw new Error(`A command already exists with the canonical path "${path}".`);
    }

    this.commands.set(path, command);

    return this;
  }

  // TODO unknown options
  // TODO index command
  async run(argv: Argv): Promise<void> {
    this.commandLine = argv.join(' ');

    let exitCode: ExitCode;

    try {
      exitCode = await this.doRun(argv);
    } catch (error) {
      exitCode = await this.renderErrors([error]);
    }

    process.exitCode = exitCode;
  }

  /**
   * Internal run that does all the heavy lifting and parsing,
   * while the public run exists to catch any unexpected errors.
   */
  protected async doRun(argv: Argv): Promise<ExitCode> {
    const { command: path, errors, options, params, rest } = this.parseArguments(argv);

    // Display errors
    if (errors.length > 0) {
      return this.renderErrors(errors);
    }

    // Display version
    if (options.version) {
      return this.render(this.options.version, EXIT_PASS);
    }

    const command = this.getCommand(path)!;
    const metadata = command.getMetadata();

    // Display help and usage
    if (options.help) {
      return this.renderHelp(metadata);
    }

    // Apply arguments to command properties
    Object.entries(options).forEach(([key, value]) => {
      const config = metadata.options[key];

      if (config) {
        // @ts-ignore Allow this
        command[key] = value;
      }
    });

    if (metadata.rest) {
      // @ts-ignore Allow this
      command[metadata.rest] = rest;
    }

    // Render command with params
    command.bootstrap();

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
    switch (this.commands.size) {
      case 0:
        throw new Error('No commands have been defined. At least 1 is required.');

      case 1: {
        const command = this.getCommand<O, P>(this.options.bin);

        if (!command) {
          throw new Error(
            'Single command programs must match the command path to the binary name.',
          );
        }

        return parse(argv, command.getParserOptions());
      }

      default:
        return parseInContext(argv, arg => this.getCommand<O, P>(arg)?.getParserOptions());
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
  protected renderHelp(metadata: CommandMetadata): Promise<ExitCode> {
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
}
