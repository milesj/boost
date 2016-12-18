/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type { Result, ResultPromise } from './types';

/**
 * Execute processes in sequential order with the output of each
 * task being passed to the next one in the chain. Utilize the
 * `accumulator` function to execute the list of processes.
 */
export default function executeSequentially<T>(
  processes: T[],
  initialValue: Result<*>,
  accumulator: (value: Result<*>, process: T) => ResultPromise<*>,
): ResultPromise<*> {
  return processes.reduce((promise: ResultPromise<*>, process: T) => (
    promise.then((value: Result<*>) => accumulator(value, process))
  ), Promise.resolve(initialValue));
}
