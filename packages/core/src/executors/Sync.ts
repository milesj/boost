/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Executor, { AggregatedResponse } from '../Executor';
import { TaskInterface } from '../Task';

export default class SyncExecutor extends Executor {
  /**
   * Execute tasks in parallel with a value being passed to each task.
   * Tasks will synchronize regardless of race conditions and errors.
   */
  run<T>(tasks: TaskInterface[], value?: T): Promise<AggregatedResponse> {
    this.debug('Synchronizing %d tasks', tasks.length);

    return Promise.all(
      tasks.map(task => this.execute(task, value, true).catch(error => error)),
    ).then(responses => Promise.resolve(this.aggregateResponse(responses)));
  }
}
