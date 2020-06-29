import { isObject } from '@boost/common';
import Logger from './Logger';
import { LOG_LEVELS } from './constants';
import { LoggerOptions, LoggerFunction, LogLevel } from './types';

function pipeLog(logger: Logger, level?: LogLevel) {
  return (...args: unknown[]) => {
    let metadata = {};
    let message = '';

    if (isObject(args[0])) {
      metadata = (args as object[]).shift()!;
    }

    message = (args as string[]).shift()!;

    logger.log({
      args,
      level,
      message,
      metadata,
    });
  };
}

export default function createLogger(options: LoggerOptions): LoggerFunction {
  const logger = new Logger(options);
  const log = pipeLog(logger);

  LOG_LEVELS.forEach((level) => {
    Object.defineProperty(log, level, {
      value: pipeLog(logger, level),
    });
  });

  Object.defineProperty(log, 'disable', {
    value: () => logger.disable(),
  });

  Object.defineProperty(log, 'enable', {
    value: () => logger.enable(),
  });

  return log as LoggerFunction;
}
