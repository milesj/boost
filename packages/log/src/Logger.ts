import os from 'os';
import util from 'util';
import { Contract, Predicates, Blueprint } from '@boost/common';
import { env } from '@boost/internal';
import ConsoleTransport from './transports/ConsoleTransport';
import Transport from './Transport';
import debug from './debug';
import { DEFAULT_LABELS, LOG_LEVELS } from './constants';
import { LoggerOptions, LogLevel, LogMetadata } from './types';

export default class Logger extends Contract<LoggerOptions> {
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

  blueprint({
    array,
    func,
    instance,
    object,
    shape,
    string,
  }: Predicates): Blueprint<LoggerOptions> {
    return {
      labels: object(string()),
      metadata: object(),
      name: string().required().notEmpty(),
      transports: array(instance(Transport).notNullable(), [new ConsoleTransport()]),
    };
  }

  disable() {
    debug('Logger %s disabled', this.options.name);
    this.silent = true;
  }

  enable() {
    debug('Logger %s enabled', this.options.name);
    this.silent = false;
  }

  isAllowed(level: LogLevel, maxLevel?: LogLevel): boolean {
    if (!maxLevel) {
      return true;
    }

    // eslint-disable-next-line no-restricted-syntax
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

  log({
    args = [],
    level,
    message,
    metadata = {},
  }: {
    args?: unknown[];
    level?: LogLevel;
    message: string;
    metadata?: LogMetadata;
  }) {
    const logLevel = level || env('LOG_DEFAULT_LEVEL') || 'log';

    if (this.silent || !this.isAllowed(logLevel, env('LOG_MAX_LEVEL'))) {
      return;
    }

    const item = {
      host: os.hostname(),
      label: this.options.labels[logLevel] || DEFAULT_LABELS[logLevel] || '',
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
