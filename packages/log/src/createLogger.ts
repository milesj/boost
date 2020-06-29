import os from 'os';
import util from 'util';
import chalk from 'chalk';
import { env } from '@boost/internal';
import isAllowedLogLevel from './helpers/isAllowedLogLevel';
import ConsoleTransport from './ConsoleTransport';
import debug from './debug';
import msg from './translate';
import { LOG_LEVELS } from './constants';
import { Logger, LogLevel, LogLevelLabels, LoggerOptions, LogItem } from './types';

export const DEFAULT_LABELS: LogLevelLabels = {
  debug: chalk.gray(msg('log:levelDebug')),
  error: chalk.red(msg('log:levelError')),
  info: chalk.cyan(msg('log:levelInfo')),
  log: chalk.yellow(msg('log:levelLog')),
  trace: chalk.magenta(msg('log:levelTrace')),
  warn: chalk.yellow(msg('log:levelWarn')),
};

export default function createLogger({
  labels = {},
  name,
  transports = [new ConsoleTransport()],
}: LoggerOptions): Logger {
  let silent = false;

  {
    const defaultLevel = env('LOG_DEFAULT_LEVEL');
    const maxLevel = env('LOG_MAX_LEVEL');

    debug(
      'New logger "%s" created: %s %s',
      name,
      defaultLevel ? `${defaultLevel} level` : 'all levels',
      maxLevel ? `(max ${maxLevel})` : '',
    );
  }

  function logger(message: string, ...args: unknown[]) {
    const self = logger as Logger;
    const defaultLevel: LogLevel | undefined = env('LOG_DEFAULT_LEVEL');

    if (defaultLevel && self[defaultLevel]) {
      self[defaultLevel](message, ...args);
    } else {
      self.log(message, ...args);
    }
  }

  function writeToTransports(item: LogItem) {
    transports.forEach((transport) => {
      if (transport.levels.includes(item.level)) {
        void transport.write(transport.format(item), item);
      }
    });
  }

  LOG_LEVELS.forEach((level) => {
    const label = labels[level] || DEFAULT_LABELS[level] || '';

    Object.defineProperty(logger, level, {
      value: function log(message: string, ...args: unknown[]) {
        if (!silent && isAllowedLogLevel(level, env('LOG_MAX_LEVEL'))) {
          writeToTransports({
            host: os.hostname(),
            label,
            level,
            message: util.format(message, ...args),
            name,
            pid: process.pid,
            time: new Date().toUTCString(),
          });
        }
      },
    });
  });

  logger.enable = () => {
    debug('Logger %s enabled', name);
    silent = false;
  };

  logger.disable = () => {
    debug('Logger %s disabled', name);
    silent = true;
  };

  return logger as Logger;
}
