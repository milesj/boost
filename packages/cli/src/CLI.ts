import { Argv, parseInContext, PrimitiveType } from '@boost/args';
import { Contract, Predicates } from '@boost/common';
import { CLIOptions, Commandable, GlobalArgumentOptions } from './types';
import Command from './Command';

export default class CLI extends Contract<CLIOptions> {
  protected commands: { [name: string]: Commandable } = {};

  blueprint({ string }: Predicates) {
    return {
      banner: string(),
      bin: string().required(),
      footer: string(),
      name: string().required(),
      version: string().required(),
    };
  }

  getCommand<O extends GlobalArgumentOptions, P extends PrimitiveType[]>(
    name: string | string[],
  ): Command<O, P> | null {
    const names = Array.isArray(name) ? [...name] : name.split(':');
    const baseName = names.shift()!;
    let command: Commandable = this.commands[baseName];

    if (!command) {
      return null;
    }

    while (names.length > 0) {
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

  register(command: Commandable): this {
    return this;
  }

  // TODO unknown options
  // TODO index command
  // TODO error handling
  async run(argv: Argv): Promise<void> {
    const { command: cmd, errors, options, params, rest } = parseInContext<GlobalArgumentOptions>(
      argv,
      arg => this.getCommand(arg)?.getParserOptions(),
    );

    // Display version and exit
    if (options.version) {
      console.log(this.options.version);

      return;
    }

    // Display errors and exit
    if (errors.length > 0) {
      throw new Error('TODO');
    }

    const command = this.getCommand(cmd)!;
    const metadata = command.getMetadata();

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
    await command.execute(...params);
  }
}
