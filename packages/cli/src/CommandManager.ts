import { ArgList, PrimitiveType } from '@boost/args';
import { Contract, isObject } from '@boost/common';
import { Event } from '@boost/event';
import { CLIError } from './CLIError';
import { Commandable, CommandMetadata, CommandPath } from './types';

export abstract class CommandManager<Options extends object = {}> extends Contract<Options> {
	/**
	 * Called after a command has been registered.
	 * @category Events
	 */
	readonly onAfterRegister = new Event<[CommandPath, Commandable]>('after-register');

	/**
	 * Called before a command has been registered.
	 * @category Events
	 */
	readonly onBeforeRegister = new Event<[CommandPath, Commandable]>('before-register');

	protected commands: CommandMetadata['commands'] = {};

	protected commandAliases: Record<string, string> = {};

	/**
	 * Return a command by registered path, or `null` if not found.
	 */
	getCommand<O extends object = {}, P extends PrimitiveType[] = ArgList>(
		path: CommandPath,
	): Commandable<O, P> | null {
		if (!path) {
			return null;
		}

		const alias = this.commandAliases[path];

		return (alias && this.commands[alias]) || this.commands[path] || null;
	}

	/**
	 * Return a list of all registered command paths (including aliases).
	 */
	getCommandPaths(): CommandPath[] {
		return [...Object.keys(this.commands), ...Object.keys(this.commandAliases)];
	}

	/**
	 * Register a command and its canonical path (must be unique),
	 * otherwise an error is thrown.
	 */
	register(command: Commandable): this {
		if (!isObject(command) || typeof command.run !== 'function') {
			throw new CLIError('COMMAND_INVALID_REGISTER');
		}

		const { aliases, path } = command.getMetadata();

		this.onBeforeRegister.emit([path, command]);

		this.checkPath(path);
		this.commands[path] = command;

		aliases.forEach((alias) => {
			this.checkPath(alias);
			this.commandAliases[alias] = path;
		});

		this.onAfterRegister.emit([path, command]);

		return this;
	}

	/**
	 * Check that a command path is valid.
	 */
	protected checkPath(path: CommandPath) {
		if (this.commands[path]) {
			throw new CLIError('COMMAND_DEFINED', [path]);
		}
	}
}
