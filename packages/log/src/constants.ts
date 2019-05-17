import chalk from 'chalk';
import { LogLevel, LogLevelColors } from './types';

export const LOG_LEVELS: LogLevel[] = ['log', 'trace', 'debug', 'info', 'warn', 'error'];

export const LOG_LEVEL_COLORS: LogLevelColors = {
  debug: chalk.gray,
  error: chalk.red,
  info: chalk.cyan,
  trace: chalk.magenta,
  warn: chalk.yellow,
};
