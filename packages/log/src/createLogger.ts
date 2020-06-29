import { LOG_LEVELS } from './constants';
import { LoggerOptions, LoggerFunction } from './types';
import Logger from './Logger';

export default function createLogger(options: LoggerOptions): LoggerFunction {
  const logger = new Logger(options);

  function logFunc(message: string, ...args: unknown[]) {
    logger.log({ message }, ...args);
  }

  LOG_LEVELS.forEach((level) => {
    Object.defineProperty(logFunc, level, {
      value: function logWriter(message: string, ...args: unknown[]) {
        logger.log({ level, message }, ...args);
      },
    });
  });

  Object.defineProperty(logFunc, 'disable', {
    value: () => logger.disable(),
  });

  Object.defineProperty(logFunc, 'enable', {
    value: () => logger.enable(),
  });

  return logFunc as LoggerFunction;
}
