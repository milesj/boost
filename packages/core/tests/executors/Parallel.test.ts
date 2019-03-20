import { mockTool } from '../../src/testUtils';
import ParallelExecutor from '../../src/executors/Parallel';
import Task from '../../src/Task';
import Context from '../../src/Context';

describe('ParallelExecutor', () => {
  let executor: ParallelExecutor<any>;

  beforeEach(() => {
    executor = new ParallelExecutor(mockTool(), new Context());
  });

  it('triggers tasks in parallel', async () => {
    const foo = new Task('foo', () => 123);
    const bar = new Task('bar', () => 456);
    const baz = new Task('baz', () => 789);

    const results = await executor.runTasks([foo, bar, baz]);

    expect(results).toEqual([123, 456, 789]);
  });
});
