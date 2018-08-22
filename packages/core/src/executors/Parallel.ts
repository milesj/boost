/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Context from '../Context';
import Executor from '../Executor';
import Task from '../Task';

export default class ParallelExecutor<Tx extends Context> extends Executor<Tx> {
  /**
   * Execute tasks in parallel.
   */
  run<T>(tasks: Task<Tx>[], value?: T): Promise<any[]> {
    this.debug('Parallelizing %d tasks', tasks.length);

    return Promise.all(tasks.map(task => this.execute(task, value, true)));
  }
}
