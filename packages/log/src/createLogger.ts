import util from 'util';
import chalk from 'chalk';
import isAllowedLogLevel from './isAllowedLogLevel';
import { Logger, LogLevel, LogLevelLabels } from './types';
import { msg, LOG_LEVELS } from './constants';

export const DEFAULT_LABELS: LogLevelLabels = {
  debug: chalk.gray(msg('log:levelDebug')),
  error: chalk.red(msg('log:levelError')),
  info: chalk.cyan(msg('log:levelInfo')),
  trace: chalk.magenta(msg('log:levelTrace')),
  warn: chalk.yellow(msg('log:levelWarn')),
};

export interface LoggerOptions {
  labels?: LogLevelLabels;
  stderr?: NodeJS.WriteStream;
  stdout?: NodeJS.WriteStream;
}

export default function createLogger({
  labels = {},
  stderr = process.stderr,
  stdout = process.stdout,
}: LoggerOptions = {}): Logger {
  let silent = false;

  function logger(message: string, ...args: any[]) {
    const self = logger as Logger;
    const defaultLevel = process.env.BOOST_LOG_DEFAULT_LEVEL as LogLevel;

    if (defaultLevel && self[defaultLevel]) {
      self[defaultLevel](message, ...args);
    } else {
      self.log(message, ...args);
    }
  }

  LOG_LEVELS.forEach(level => {
    const label = labels[level] || DEFAULT_LABELS[level] || '';
    const stream = level === 'debug' || level === 'error' || level === 'warn' ? stderr : stdout;

    Object.defineProperty(logger, level, {
      value: function log(message: string, ...args: any[]) {
        const maxLevel = process.env.BOOST_LOG_MAX_LEVEL as LogLevel;

        if (!silent && isAllowedLogLevel(level, maxLevel)) {
          const output = util.format(message, ...args);

          stream.write(level === 'log' ? `${output}\n` : `${label} ${output}\n`);
        }
      },
    });
  });

  logger.enable = () => {
    silent = false;
  };

  logger.disable = () => {
    silent = true;
  };

  return logger as Logger;
}
