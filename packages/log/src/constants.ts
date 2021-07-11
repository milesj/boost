import chalk from 'chalk';
import { msg } from './translate';
import { LogLevel, LogLevelLabels } from './types';

// In order of priority!
export const LOG_LEVELS: LogLevel[] = ['log', 'trace', 'debug', 'info', 'warn', 'error'];

export const DEFAULT_LABELS: LogLevelLabels = {
	debug: chalk.gray(msg('log:levelDebug')),
	error: chalk.red(msg('log:levelError')),
	info: chalk.cyan(msg('log:levelInfo')),
	log: chalk.yellow(msg('log:levelLog')),
	trace: chalk.magenta(msg('log:levelTrace')),
	warn: chalk.yellow(msg('log:levelWarn')),
};

export const MAX_LOG_SIZE = 10_485_760;
