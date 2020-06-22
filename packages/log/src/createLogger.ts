import util from 'util';
import chalk from 'chalk';
import { env } from '@boost/internal';
import isAllowedLogLevel from './isAllowedLogLevel';
import debug from './debug';
import { msg, LOG_LEVELS } from './constants';
import { Logger, LogLevel, LogLevelLabels, Loggable } from './types';

export const DEFAULT_LABELS: LogLevelLabels = {
  debug: chalk.gray(msg('log:levelDebug')),
  error: chalk.red(msg('log:levelError')),
  info: chalk.cyan(msg('log:levelInfo')),
  trace: chalk.magenta(msg('log:levelTrace')),
  warn: chalk.yellow(msg('log:levelWarn')),
};

export interface LoggerOptions {
  /** Custom labels to use for each log type. */
  labels?: LogLevelLabels;
  /** Writable stream to send `stderr` messages to. */
  stderr?: Loggable;
  /** Writable stream to send `stdout` messages to. */
  stdout?: Loggable;
}

export default function createLogger({
  labels = {},
  stderr = process.stderr,
  stdout = process.stdout,
}: LoggerOptions = {}): Logger {
  let silent = false;

  {
    const defaultLevel = env('LOG_DEFAULT_LEVEL');
    const maxLevel = env('LOG_MAX_LEVEL');

    debug(
      'New logger created: %s %s',
      defaultLevel ? `${defaultLevel} level` : 'all levels',
      maxLevel ? `(max ${maxLevel})` : '',
    );
  }

  function logger(message: string, ...args: any[]) {
    const self = logger as Logger;
    const defaultLevel: LogLevel | undefined = env('LOG_DEFAULT_LEVEL');

    if (defaultLevel && self[defaultLevel]) {
      self[defaultLevel](message, ...args);
    } else {
      self.log(message, ...args);
    }
  }

  LOG_LEVELS.forEach((level) => {
    const label = labels[level] || DEFAULT_LABELS[level] || '';
    const stream = level === 'debug' || level === 'error' || level === 'warn' ? stderr : stdout;

    Object.defineProperty(logger, level, {
      value: function log(message: string, ...args: unknown[]) {
        const maxLevel: LogLevel | undefined = env('LOG_MAX_LEVEL');

        if (!silent && isAllowedLogLevel(level, maxLevel)) {
          const output = util.format(message, ...args);

          stream.write(level === 'log' ? `${output}\n` : `${label} ${output}\n`);
        }
      },
    });
  });

  logger.enable = () => {
    debug('Logger enabled');
    silent = false;
  };

  logger.disable = () => {
    debug('Logger disabled');
    silent = true;
  };

  return logger as Logger;
}
