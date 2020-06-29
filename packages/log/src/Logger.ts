import os from 'os';
import util from 'util';
import { Contract, Predicates } from '@boost/common';
import { env } from '@boost/internal';
import debug from './debug';
import ConsoleTransport from './ConsoleTransport';
import { DEFAULT_LABELS, LOG_LEVELS } from './constants';
import { LoggerOptions, LogLevel, Formatter, Transportable } from './types';

export default class Logger extends Contract<LoggerOptions> {
  protected silenced: boolean = false;

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

  blueprint({ array, func, object, shape, string }: Predicates) {
    return {
      labels: object(string()),
      name: string().required().notEmpty(),
      transports: array(
        shape({
          format: func<Formatter>().notNullable(),
          levels: array(string<LogLevel>()),
          write: func<Transportable['write']>().notNullable(),
        }),
        [new ConsoleTransport()],
      ),
    };
  }

  disable() {
    debug('Logger %s disabled', this.options.name);
    this.silenced = true;
  }

  enable() {
    debug('Logger %s enabled', this.options.name);
    this.silenced = false;
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

  log({ level: baseLevel, message }: { level?: LogLevel; message: string }, ...args: unknown[]) {
    const level = baseLevel || env('LOG_DEFAULT_LEVEL') || 'log';

    if (this.silenced || !this.isAllowed(level, env('LOG_MAX_LEVEL'))) {
      return;
    }

    const item = {
      host: os.hostname(),
      label: this.options.labels[level] || DEFAULT_LABELS[level] || '',
      level,
      message: util.format(message, ...args),
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
