import os from 'os';
import util from 'util';
import { Contract } from '@boost/common';
import { Blueprint, Schemas } from '@boost/common/optimal';
import { env } from '@boost/internal';
import { DEFAULT_LABELS, LOG_LEVELS } from './constants';
import { debug } from './debug';
import { Transport } from './Transport';
import { ConsoleTransport } from './transports/ConsoleTransport';
import { LoggerOptions, LogLevel, LogOptions, Transportable } from './types';

export class Logger extends Contract<LoggerOptions> {
	protected silent: boolean = false;

	constructor(options: LoggerOptions) {
		super(options);

		const defaultLevel = env('LOG_DEFAULT_LEVEL');
		const maxLevel = env('LOG_MAX_LEVEL');

		debug(
			'New logger "%s" created: %s %s',
			this.options.name,
			defaultLevel ? `${defaultLevel} level` : 'all levels',
			maxLevel ? `(max ${maxLevel})` : '',
		);
	}

	blueprint(schemas: Schemas): Blueprint<LoggerOptions> {
		const { array, instance, object, string } = schemas;

		return {
			labels: object().of(string()),
			metadata: object(),
			name: string().required().notEmpty(),
			transports: array([new ConsoleTransport()]).of(
				instance().of<Transportable>(Transport).notNullable(),
			),
		};
	}

	/**
	 * Disable all logger messages from logging to the console.
	 */
	disable() {
		debug('Logger %s disabled', this.options.name);
		this.silent = true;
	}

	/**
	 * Enable all logger messages to log the console.
	 */
	enable() {
		debug('Logger %s enabled', this.options.name);
		this.silent = false;
	}

	isAllowed(level: LogLevel, maxLevel?: LogLevel): boolean {
		if (!maxLevel) {
			return true;
		}

		for (const currentLevel of LOG_LEVELS) {
			if (currentLevel === level) {
				return true;
			}

			if (currentLevel === maxLevel) {
				break;
			}
		}

		return false;
	}

	log(options: LogOptions) {
		const { args = [], level, message, metadata = {} } = options;
		const logLevel = level ?? env('LOG_DEFAULT_LEVEL') ?? 'log';

		if (this.silent || !this.isAllowed(logLevel, env('LOG_MAX_LEVEL'))) {
			return;
		}

		const item = {
			host: os.hostname(),
			label: this.options.labels[logLevel] ?? DEFAULT_LABELS[logLevel] ?? '',
			level: logLevel,
			message: util.format(message, ...args),
			metadata: {
				...this.options.metadata,
				...metadata,
			},
			name: this.options.name,
			pid: process.pid,
			time: new Date(),
		};

		this.options.transports.forEach((transport) => {
			if (transport.levels.includes(item.level)) {
				void transport.write(transport.format(item), item);
			}
		});
	}
}
