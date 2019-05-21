import util from 'util';
import chalk from 'chalk';
import isAllowedLogLevel from './isAllowedLogLevel';
import { Logger, LogLevel, LogLevelLabels } from './types';
import { LOG_LEVELS } from './constants';

export const DEFAULT_LABELS: LogLevelLabels = {
  debug: chalk.gray('[debug]'),
  error: chalk.red('[error]'),
  info: chalk.cyan('[info]'),
  trace: chalk.magenta('[trace]'),
  warn: chalk.yellow('[warn]'),
};

export interface LoggerOptions {
  defaultLevel?: LogLevel;
  labels?: LogLevelLabels;
  maxLevel?: LogLevel;
  stderr?: NodeJS.WriteStream;
  stdout?: NodeJS.WriteStream;
}

export default function createLogger({
  defaultLevel,
  labels = {},
  maxLevel,
  stderr = process.stderr,
  stdout = process.stdout,
}: LoggerOptions = {}): Logger {
  let silent = false;

  function logger(message: string, ...args: any[]) {
    const self = logger as Logger;

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
