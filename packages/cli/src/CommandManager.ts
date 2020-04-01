import { PrimitiveType, ArgList } from '@boost/args';
import { Contract } from '@boost/common';
import { Event } from '@boost/event';
import { RuntimeError } from '@boost/internal';
import { CommandMetadata, CommandPath, Commandable } from './types';

export default abstract class CommandManager<Options extends object = {}> extends Contract<
  Options
> {
  readonly onCommandRegistered = new Event<[CommandPath, Commandable]>('command-registered');

  protected commands: CommandMetadata['commands'] = {};

  protected commandAliases: { [path: string]: string } = {};

  /**
   * Return a command by registered path, or `null` if not found.
   */
  getCommand<O extends object = {}, P extends PrimitiveType[] = ArgList>(
    path: CommandPath,
  ): Commandable<O, P> | null {
    const alias = this.commandAliases[path];

    return (alias && this.commands[alias]) || this.commands[path] || null;
  }

  /**
   * Return a list of all registered command paths (including aliases).
   */
  getCommandPaths(): CommandPath[] {
    return Object.keys(this.commands).concat(Object.keys(this.commandAliases));
  }

  /**
   * Register a command and its canonical path (must be unique),
   * otherwise an error is thrown.
   */
  register(command: Commandable): this {
    const { aliases, path } = command.getMetadata();

    this.checkPath(path);
    this.commands[path] = command;

    aliases.forEach(alias => {
      this.checkPath(alias);
      this.commandAliases[alias] = path;
    });

    this.onCommandRegistered.emit([path, command]);

    return this;
  }

  /**
   * Check that a command path is valid.
   */
  protected checkPath(path: CommandPath) {
    if (this.commands[path]) {
      throw new RuntimeError('cli', 'CLI_COMMAND_EXISTS', [path]);
    }
  }
}
