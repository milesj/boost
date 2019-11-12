import Context from '../Context';
import Executor, { AggregatedResponse, ExecuteHandler } from '../Executor';
import Task from '../Task';

export default class SyncExecutor<Ctx extends Context> extends Executor<Ctx> {
  parallel: boolean = true;

  /**
   * Execute tasks in parallel with a value being passed to each task.
   * Tasks will synchronize regardless of race conditions and errors.
   */
  async run<T, R = any>(
    handler: ExecuteHandler<Ctx>,
    tasks: Task<Ctx>[],
    value?: T,
  ): Promise<AggregatedResponse<R>> {
    this.debug('Synchronizing %d tasks', tasks.length);

    return Promise.all(
      tasks.map(task => handler(task, value).catch(error => error)),
    ).then(responses => Promise.resolve(this.aggregateResponse(responses)));
  }
}
