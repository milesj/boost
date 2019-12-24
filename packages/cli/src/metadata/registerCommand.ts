import 'reflect-metadata';
import { META_COMMANDS } from '../constants';
import { Commandable, CommandMetadata } from '../types';

export default function registerCommand<T extends Object>(target: T, command: Commandable) {
  const { name } = command.getMetadata();

  if (!name || typeof name !== 'string') {
    throw new Error('Command registered without a name. Have you decorated your command?');
  }

  const commands: CommandMetadata['commands'] = Reflect.getMetadata(META_COMMANDS, target) ?? {};

  commands[name] = command;

  Reflect.defineMetadata(META_COMMANDS, commands, target);
}
