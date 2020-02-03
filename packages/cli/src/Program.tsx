import React from 'react';
import { render } from 'ink';
import { Argv, parseInContext, PrimitiveType } from '@boost/args';
import { Contract, Predicates } from '@boost/common';
import { ExitError } from '@boost/internal';
import {
  ProgramOptions,
  Commandable,
  GlobalArgumentOptions,
  ProgramContext,
  ExitCode,
} from './types';
import Command from './Command';
import { VERSION_FORMAT } from './constants';
import Usage from './Usage';

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
      throw new Error('TODO');
    }

    const command = this.getCommand(path)!;
    const metadata = command.getMetadata();

    // Display help and usage
    if (options.help) {
      return this.render(<Usage metadata={metadata} />, context);
    }

    // Apply arguments to command
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
      exitCode = await this.render(await command.run(...params), context);
    } catch (error) {
      exitCode = error instanceof ExitError ? error.code : 1;
    }

    return exitCode;
  }

  async runAndExit(argv: Argv, context?: ProgramContext): Promise<void> {
    process.exitCode = await this.run(argv, context);
  }

  protected async render(
    element: string | React.ReactElement,
    { stdin, stdout }: ProgramContext,
  ): Promise<ExitCode> {
    if (typeof element === 'string') {
      stdout.write(element);

      return 0;
    }

    const { waitUntilExit } = render(element, {
      experimental: true,
      stdin,
      stdout,
    });

    await waitUntilExit();

    return 0;
  }
}
