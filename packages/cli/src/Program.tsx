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
import { VERSION_FORMAT } from './constants';

export default class Program extends Contract<ProgramOptions> {
  protected commands = new Map<string, Commandable>();

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
    const context = {
      stderr: process.stderr,
      stdin: process.stdin,
      stdout: process.stdout,
      ...ctx,
    };
    const { command: path, errors, options, params, rest } = parseInContext<GlobalArgumentOptions>(
      argv,
      arg => this.getCommand(arg)?.getParserOptions(),
    );

    // Display version
    if (options.version) {
      context.stdout.write(this.options.version);

      return 0;
    }

    // Display errors and exit
    if (errors.length > 0) {
      return this.handleErrors(errors, context);
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
        context,
        0,
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
    let exitCode: ExitCode = 0;

    try {
      exitCode = await this.render(await command.run(...params), context, 0);
    } catch (error) {
      exitCode = await this.render(
        <Failure error={error} />,
        context,
        error instanceof ExitError ? error.code : 1,
      );
    }

    return exitCode;
  }

  async runAndExit(argv: Argv, context?: ProgramContext): Promise<void> {
    process.exitCode = await this.run(argv, context);
  }

  protected handleErrors(errors: Error[], context: ProgramContext) {
    const parseErrors = errors.filter(error => error instanceof ParseError);
    const validErrors = errors.filter(error => error instanceof ValidationError);
    let mainError = parseErrors.shift();

    if (!mainError) {
      mainError = validErrors.shift();
    }

    return this.render(<Failure error={mainError!} warnings={validErrors} />, context, 1);
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
    { stdin, stdout }: ProgramContext,
    exitCode: ExitCode,
  ): Promise<ExitCode> {
    if (!element) {
      return exitCode;
    } else if (typeof element === 'string') {
      stdout.write(element);
    } else {
      await render(element, {
        experimental: true,
        stdin,
        stdout,
      }).waitUntilExit();
    }

    return exitCode;
  }
}
