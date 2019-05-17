import util from 'util';
import chalk from 'chalk';
import { Logger, LogLevel } from './types';

function logFactory(stream: NodeJS.WriteStream, level: LogLevel, prefix?: string) {
  return function log(message: string, ...args: any[]) {
    const output = util.format(message, ...args);

    stream.write(prefix ? `${prefix} ${output}` : output);
  };
}

export interface LoggerOptions {
  stderr?: NodeJS.WriteStream;
  stdout?: NodeJS.WriteStream;
}

export default function createLogger({
  stderr = process.stderr,
  stdout = process.stdout,
}: LoggerOptions): Logger {
  function logger(message: string, ...args: any[]) {
    const level = process.env.BOOST_LOG_DEFAULT_LEVEL as LogLevel | undefined;

    if (logger[level]) {
      logger[level](message, ...args);
    } else {
      logger.log(message, ...args);
    }
  }

  logger.debug = logFactory(stdout, 'debug', chalk.gray('[debug]'));
  logger.error = logFactory(stderr, 'error', chalk.red('[error]'));
  logger.log = logFactory(stdout, 'log');
  logger.info = logFactory(stdout, 'info', chalk.cyan('[info]'));
  logger.trace = logFactory(stdout, 'trace', chalk.green('[trace]'));
  logger.warn = logFactory(stdout, 'info', chalk.yellow('[info]'));

  return logger;
}
