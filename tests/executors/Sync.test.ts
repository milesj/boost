import SyncExecutor from '../../src/executors/Sync';
import Task from '../../src/Task';
import { createTestTool, createTestRoutine } from '../helpers';

describe('SyncExecutor', () => {
  let executor: SyncExecutor;

  beforeEach(() => {
    executor = new SyncExecutor(createTestTool(), {});
  });

  it('triggers tasks in parallel', async () => {
    const foo = new Task('foo', () => 123);
    const bar = new Task('bar', () => {
      throw new Error('Oops');
    });
    const baz = new Task('baz', () => 789);

    const results = await executor.run([foo, bar, baz]);

    expect(results).toEqual({
      errors: [new Error('Oops')],
      results: [123, 789],
    });
  });

  it('triggers `executeRoutine` and `executeTask` with the correct values', async () => {
    const task = new Task('foo', value => value);
    const taskSpy = jest.fn(() => Promise.resolve());
    const routine = createTestRoutine(executor.tool);
    const routineSpy = jest.fn(() => Promise.resolve());

    executor.executeTask = taskSpy;
    executor.executeRoutine = routineSpy;

    await executor.run([task, routine], 'foo');

    expect(taskSpy).toHaveBeenCalledWith(task, 'foo', true);
    expect(routineSpy).toHaveBeenCalledWith(routine, 'foo', true);
  });
});
