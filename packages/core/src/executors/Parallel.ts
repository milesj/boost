/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Executor from '../Executor';
import { TaskInterface } from '../Task';

export default class ParallelExecutor extends Executor {
  /**
   * Execute tasks in parallel.
   */
  run<T>(tasks: TaskInterface[], value?: T): Promise<any[]> {
    this.debug('Parallelizing %d tasks', tasks.length);

    return Promise.all(tasks.map(task => this.execute(task, value, true)));
  }
}
