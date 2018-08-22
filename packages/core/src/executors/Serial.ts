/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Context from '../Context';
import Executor from '../Executor';
import Task from '../Task';

export default class SerialExecutor<Ctx extends Context> extends Executor<Ctx> {
  /**
   * Execute tasks in sequential order with the output of each
   * task being passed to the next promise in the chain.
   */
  run<T>(tasks: Task<Ctx>[], value?: T): Promise<any> {
    this.debug('Serializing %d tasks', tasks.length);

    return tasks.reduce(
      (promise, task) => promise.then(val => this.execute(task, val)),
      Promise.resolve(value),
    );
  }
}
