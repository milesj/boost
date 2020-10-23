/* eslint-disable no-param-reassign, no-console, import/no-extraneous-dependencies */

import { PassThrough } from 'stream';
import util from 'util';
import { Loggable } from '@boost/log';
import LogBuffer from '../LogBuffer';

const CONSOLE_METHODS: (keyof typeof console)[] = [
  'assert',
  'count',
  'debug',
  'dir',
  'dirxml',
  'error',
  'info',
  'log',
  'table',
  'time',
  'timeEnd',
  'timeLog',
  'timeStamp',
  'trace',
  'warn',
];

// Utility method for wrapping and patching an API temporarily
function wrap<T, K extends keyof T>(api: T, method: K, callback: T[K]): () => void {
  const original = api[method];

  api[method] = callback;

  return () => {
    api[method] = original;
  };
}

/**
 * Wrap the global `console` to write to our logger and inherit formatting
 * functionality. This is kind of crazy, I know.
 */
export default function patchConsole(logger: Loggable, errBuffer: LogBuffer): () => void {
  const unwrappers: (() => void)[] = [];

  // Wrap the native `console` and pipe to our logger
  let lastMethod = '';

  const patchedConsole = new console.Console(
    new PassThrough({
      write: (data) => {
        const message = String(data);

        if (lastMethod === 'debug') {
          logger.debug(message);
        } else if (lastMethod === 'info') {
          logger.info(message);
        } else {
          logger.log(message);
        }
      },
    }),
    new PassThrough({
      write: (data) => {
        const message = String(data);

        if (lastMethod === 'trace') {
          logger.trace(message);
        } else if (lastMethod === 'warn') {
          logger.warn(message);
        } else {
          logger.error(message);
        }
      },
    }),
  );

  CONSOLE_METHODS.forEach((method) => {
    unwrappers.push(
      wrap(console, method, (...args: unknown[]) => {
        lastMethod = method;
        patchedConsole[method](...args);
      }),
    );
  });

  // Wrap the `debug` stream since it writes to `process.stderr` directly
  // https://www.npmjs.com/package/debug#output-streams
  if (process.env.DEBUG) {
    // eslint-disable-next-line
    const debug = require('debug');

    unwrappers.push(
      wrap(debug, 'log', (message: string, ...args: unknown[]) => {
        // Do not pass to our logger since it's pre-formatted
        errBuffer.write(util.format(message, ...args));
      }),
    );
  }

  return () => {
    unwrappers.forEach((unwrap) => {
      unwrap();
    });
  };
}
