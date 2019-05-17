/* eslint-disable babel/no-invalid-this */

import util from 'util';
import isAllowedLogLevel from './isAllowedLogLevel';
import { Logger, LogLevel, LogLevelColors, LogLevelLabels } from './types';
import { LOG_LEVELS, LOG_LEVEL_COLORS } from './constants';

export interface LoggerOptions {
  colors?: LogLevelColors;
  defaultLevel?: LogLevel;
  labels?: LogLevelLabels;
  maxLevel?: LogLevel;
  stderr?: NodeJS.WriteStream;
  stdout?: NodeJS.WriteStream;
}

export default function createLogger({
  colors = {},
  defaultLevel,
  labels = {},
  maxLevel,
  stderr = process.stderr,
  stdout = process.stdout,
}: LoggerOptions = {}): Logger {
  function logger(message: string, ...args: any[]) {
    const self = logger as Logger;

    if (defaultLevel && self[defaultLevel]) {
      self[defaultLevel](message, ...args);
    } else {
      self.log(message, ...args);
    }
  }

  LOG_LEVELS.forEach(level => {
    const color = colors[level] || LOG_LEVEL_COLORS[level];
    const label = labels[level] || level;
    const prefix = color ? color(`[${label}]`) : label;
    const stream = level === 'debug' || level === 'error' || level === 'warn' ? stderr : stdout;

    Object.defineProperty(logger, level, {
      value: function log(message: string, ...args: any[]) {
        const output = util.format(message, ...args);

        if (isAllowedLogLevel(level, maxLevel)) {
          stream.write(level === 'log' ? output : `${prefix} ${output}`);
        }
      },
    });
  });

  return logger as Logger;
}
