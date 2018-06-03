/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Executor from '../Executor';
import { TaskInterface } from '../Task';

export default class SerialExecutor extends Executor {
  /**
   * Execute tasks in sequential order with the output of each
   * task being passed to the next promise in the chain.
   */
  run<T>(tasks: TaskInterface[], value?: T): Promise<any> {
    this.debug('Serializing %d tasks', tasks.length);

    return tasks.reduce(
      (promise, task) => promise.then(val => this.execute(task, val)),
      Promise.resolve(value),
    );
  }
}
