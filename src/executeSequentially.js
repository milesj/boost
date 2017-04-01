/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type { ResultPromise } from './types';

/**
 * Execute processes in sequential order with the output of each
 * task being passed to the next promise in the chain. Utilize the
 * `accumulator` function to execute the list of processes.
 */
export default function executeSequentially<T>(
  initialValue: T,
  items: T[],
  accumulator: (value: T, item: T) => ResultPromise<T>,
): ResultPromise<T> {
  return items.reduce((promise: ResultPromise<T>, item: T) => (
    promise.then((value: T) => accumulator(value, item))
  ), Promise.resolve(initialValue));
}
