import 'reflect-metadata';
import { META_COMMANDS } from '../constants';
import { Commandable, CommandMetadata } from '../types';

export default function registerCommand<T extends Object>(target: T, command: Commandable) {
  const { path } = command.getMetadata(); // Runs validation
  const commands: CommandMetadata['commands'] = Reflect.getMetadata(META_COMMANDS, target) ?? {};

  commands[path] = command;

  Reflect.defineMetadata(META_COMMANDS, commands, target);
}
