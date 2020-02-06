import React from 'react';
import { render } from 'ink';
import { Argv, parseInContext, PrimitiveType, ParseError, ValidationError } from '@boost/args';
import { Contract, Predicates } from '@boost/common';
import { ExitError } from '@boost/internal';
import {
  ProgramOptions,
  Commandable,
  GlobalArgumentOptions,
  ProgramContext,
  ExitCode,
  CommandMetadata,
  CommandMetadataMap,
} from './types';
import Command from './Command';
import Failure from './Failure';
import Help from './Help';
import Wrapper from './Wrapper';
import { VERSION_FORMAT, EXIT_PASS, EXIT_FAIL } from './constants';

export default class Program extends Contract<ProgramOptions> {
  protected commands = new Map<string, Commandable>();

  protected context: ProgramContext = {
    stderr: process.stderr,
    stdin: process.stdin,
    stdout: process.stdout,
  };

  blueprint({ string }: Predicates) {
    return {
      banner: string(),
      bin: string()
        .required()
        .kebabCase(),
      footer: string(),
      name: string().required(),
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
  getCommand<O extends GlobalArgumentOptions, P extends PrimitiveType[]>(
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

    return command as Command<O, P>;
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
  // TODO error handling
  async run(argv: Argv, ctx?: ProgramContext): Promise<ExitCode> {
    Object.assign(this.context, ctx);

    const $ = argv.join(' ');
    const { command: path, errors, options, params, rest } = parseInContext<GlobalArgumentOptions>(
      argv,
      arg => this.getCommand(arg)?.getParserOptions(),
    );

    // Display version
    if (options.version) {
      this.context.stdout.write(this.options.version);

      return EXIT_PASS;
    }

    // Display errors and exit
    if (errors.length > 0) {
      return this.handleErrors($, errors);
    }

    const command = this.getCommand(path)!;
    const metadata = command.getMetadata();

    // Display help and usage
    if (options.help) {
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

    // Apply arguments to command properties
    Object.entries(options).forEach(([key, value]) => {
      const config = metadata.options[key];

      if (config && value !== config.default) {
        (command as any)[key] = value;
      }
    });

    if (metadata.rest) {
      (command as any)[metadata.rest] = rest;
    }

    // Execute command
    let exitCode: ExitCode;

    try {
      exitCode = await this.render(await command.run(...params), EXIT_PASS);
    } catch (error) {
      exitCode = await this.handleErrors($, [error]);
    }

    return exitCode;
  }

  async runAndExit(argv: Argv, context?: ProgramContext): Promise<void> {
    process.exitCode = await this.run(argv, context);
  }

  protected handleErrors(command: string, errors: Error[]) {
    const parseErrors = errors.filter(error => error instanceof ParseError);
    const validErrors = errors.filter(error => error instanceof ValidationError);
    let mainError = parseErrors.shift();

    if (!mainError) {
      mainError = validErrors.shift();
    }

    if (!mainError) {
      mainError = errors.shift();
    }

    return this.render(
      <Failure command={command} error={mainError!} warnings={validErrors} />,
      mainError instanceof ExitError ? mainError.code : EXIT_FAIL,
    );
  }

  protected mapCommandMetadata(commands: CommandMetadata['commands']): CommandMetadataMap {
    const map: CommandMetadataMap = {};

    Object.entries(commands).forEach(([path, config]) => {
      map[path] = config.getMetadata();
    });

    return map;
  }

  protected async render(
    element: undefined | string | React.ReactElement,
    exitCode: ExitCode,
  ): Promise<ExitCode> {
    if (!element) {
      return exitCode;
    }

    const { stdin, stdout } = this.context;

    if (typeof element === 'string') {
      stdout.write(element);
    } else {
      await render(<Wrapper>{element}</Wrapper>, {
        experimental: true,
        stdin,
        stdout,
      }).waitUntilExit();
    }

    return exitCode;
  }
}
