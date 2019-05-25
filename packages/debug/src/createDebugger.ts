import chalk from 'chalk';
import debug from 'debug';
import { Debugger } from './types';

export default function createDebugger(namespace: string | string[]): Debugger {
  const appNamespace = process.env.BOOST_DEBUG_APP_NAMESPACE;
  const namespaces = Array.isArray(namespace) ? namespace : [namespace];

  if (appNamespace) {
    namespaces.unshift(appNamespace);
  }

  const logger = debug(namespaces.join(':')) as Debugger;

  logger.enable = () => {
    debug.enable(logger.namespace);
  };

  logger.invariant = (condition, message, pass, fail) => {
    logger('%s: %s', message, condition ? chalk.green(pass) : chalk.red(fail));
  };

  logger.verbose = (message, ...args) => {
    if (process.env.BOOST_DEBUG_VERBOSE) {
      logger(message, ...args);
    }
  };

  return logger;
}
