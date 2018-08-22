/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Context from '../Context';
import Executor, { AggregatedResponse } from '../Executor';
import Task from '../Task';

export default class SyncExecutor<Tx extends Context> extends Executor<Tx> {
  /**
   * Execute tasks in parallel with a value being passed to each task.
   * Tasks will synchronize regardless of race conditions and errors.
   */
  run<T>(tasks: Task<Tx>[], value?: T): Promise<AggregatedResponse> {
    this.debug('Synchronizing %d tasks', tasks.length);

    return Promise.all(
      tasks.map(task => this.execute(task, value, true).catch(error => error)),
    ).then(responses => Promise.resolve(this.aggregateResponse(responses)));
  }
}
