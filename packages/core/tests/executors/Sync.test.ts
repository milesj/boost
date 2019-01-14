import { mockTool } from '@boost/test-utils';
import SyncExecutor from '../../src/executors/Sync';
import Task from '../../src/Task';

describe('SyncExecutor', () => {
  let executor: SyncExecutor<any>;

  beforeEach(() => {
    executor = new SyncExecutor(mockTool(), {});
  });

  it('triggers tasks in parallel', async () => {
    const foo = new Task('foo', () => 123);
    const bar = new Task('bar', () => {
      throw new Error('Oops');
    });
    const baz = new Task('baz', () => 789);

    const results = await executor.runTasks([foo, bar, baz]);

    expect(results).toEqual({
      errors: [new Error('Oops')],
      results: [123, 789],
    });
  });
});
