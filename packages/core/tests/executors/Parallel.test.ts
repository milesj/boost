import ParallelExecutor from '../../src/executors/Parallel';
import Task from '../../src/Task';
import { createTestTool, createTestRoutine } from '../helpers';

describe('ParallelExecutor', () => {
  let executor: ParallelExecutor<any>;

  beforeEach(() => {
    executor = new ParallelExecutor(createTestTool(), {});
  });

  it('triggers tasks in parallel', async () => {
    const foo = new Task('foo', () => 123);
    const bar = new Task('bar', () => 456);
    const baz = new Task('baz', () => 789);

    const results = await executor.run([foo, bar, baz]);

    expect(results).toEqual([123, 456, 789]);
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
