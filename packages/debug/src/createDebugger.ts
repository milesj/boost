import chalk from 'chalk';
import debug from 'debug';
import { Debugger } from './types';

export default function createDebugger(namespace: string | string[]): Debugger {
  const globalNamespace = process.env.BOOST_DEBUG_GLOBAL_NAMESPACE;
  const namespaces = Array.isArray(namespace) ? namespace : [namespace];

  if (globalNamespace) {
    namespaces.unshift(globalNamespace);
  }

  const logger = debug(namespaces.join(':')) as Debugger;

  // `debug` doesn't support this on an individual namespace basis,
  // so we have to manually support it using this hacky regex.
  logger.disable = () => {
    process.env.DEBUG = (process.env.DEBUG || '')
      .replace(new RegExp(`${logger.namespace}(:\\*)?`, 'u'), '')
      .replace(/(^,)|(,$)/u, '')
      .replace(',,', ',');
  };

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
