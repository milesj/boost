import Context from '../Context';
import Executor, { ExecuteHandler } from '../Executor';
import Task from '../Task';

export default class ParallelExecutor<Ctx extends Context> extends Executor<Ctx> {
  parallel: boolean = true;

  /**
   * Execute tasks in parallel.
   */
  async run<T>(handler: ExecuteHandler<Ctx>, tasks: Task<Ctx>[], value?: T): Promise<any[]> {
    this.debug('Parallelizing %d tasks', tasks.length);

    return Promise.all(tasks.map(task => handler(task, value)));
  }
}
