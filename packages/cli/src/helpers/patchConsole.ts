/* eslint-disable no-console, no-param-reassign, import/no-extraneous-dependencies */

import { PassThrough } from 'stream';
import LogBuffer from '../LogBuffer';

type ConsoleMethod = keyof typeof console;

const CONSOLE_METHODS: ConsoleMethod[] = [
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

/**
 * Wrap the global `console` to write to our logger and inherit formatting
 * functionality. This is kind of crazy, I know.
 */
export default function patchConsole(outBuffer: LogBuffer, errBuffer: LogBuffer): () => void {
  const unwrappers: (() => void)[] = [];

  const patchedConsole = new console.Console(
    new PassThrough({
      write: (data) => {
        outBuffer.write(String(data));
      },
    }),
    new PassThrough({
      write: (data) => {
        errBuffer.write(String(data));
      },
    }),
  );

  const wrap = (
    api: Record<ConsoleMethod, unknown>,
    method: ConsoleMethod,
    patchMethod?: ConsoleMethod,
  ) => {
    const original = api[method];

    api[method] = (...args: unknown[]) => patchedConsole[patchMethod || method](...args);

    return () => {
      api[method] = original;
    };
  };

  CONSOLE_METHODS.forEach((method) => {
    unwrappers.push(wrap(console, method));
  });

  // Wrap the `debug` stream since it writes to `process.stderr` directly
  // https://www.npmjs.com/package/debug#output-streams
  if (process.env.DEBUG) {
    // eslint-disable-next-line
    unwrappers.push(wrap(require('debug'), 'log', 'error'));
  }

  return () => {
    unwrappers.forEach((unwrap) => {
      unwrap();
    });
  };
}
