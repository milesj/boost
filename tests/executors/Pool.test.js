import PoolExecutor from '../../src/executors/Pool';
import Task from '../../src/Task';
import { createTestTool, createTestRoutine } from '../helpers';

describe('PoolExecutor', () => {
  let executor;

  beforeEach(() => {
    executor = new PoolExecutor(
      createTestTool(),
      {},
      {
        timeout: 1000,
      },
    );
  });

  it('triggers tasks in parallel', async () => {
    const foo = new Task('foo', () => 123);
    const bar = new Task('bar', () => {
      throw new Error('Oops');
    });
    const baz = new Task('baz', () => 789);

    const results = await executor.run([foo, bar, baz]);

    expect(executor.queue).toHaveLength(0);
    expect(executor.running).toHaveLength(0);
    expect(results).toEqual({
      errors: [new Error('Oops')],
      results: [123, 789],
    });
  });

  it('returns response if no tasks', async () => {
    const results = await executor.run([]);

    expect(results).toEqual({
      errors: [],
      results: [],
    });
  });

  it('handles in reverse if fifo is false', async () => {
    executor.options.fifo = false;

    const foo = new Task('foo', () => 123);
    const bar = new Task('bar', () => 456);
    const baz = new Task('baz', () => 789);

    const results = await executor.run([foo, bar, baz]);

    expect(results).toEqual({
      errors: [],
      results: [789, 456, 123],
    });
  });

  it('maxes at concurrency limit', async () => {
    executor.options.concurrency = 1;
    executor.nextTask = () => {}; // Stop it exhausting

    const foo = new Task('foo', () => 123);
    const bar = new Task('bar', () => 456);
    const baz = new Task('baz', () => 789);

    await executor.run([foo, bar, baz]);

    expect(executor.queue).toHaveLength(2);
    expect(executor.running).toHaveLength(0);
  });

  it('cycles 1 by 1', async () => {
    executor.options.concurrency = 1;

    const foo = new Task('foo', () => 123);
    const bar = new Task('bar', () => 456);
    const baz = new Task('baz', () => 789);

    await executor.run([foo, bar, baz]);

    expect(executor.queue).toHaveLength(0);
    expect(executor.running).toHaveLength(0);
    expect(results).toEqual({
      errors: [],
      results: [123, 456, 789],
    });
  });

  it('triggers `executeRoutine` and `executeTask` with the correct values', async () => {
    const task = new Task('foo', value => value);
    const taskSpy = jest.fn(() => Promise.resolve());
    const routine = createTestRoutine(executor.tool);
    const routineSpy = jest.fn(() => Promise.resolve());

    executor.executeTask = taskSpy;
    executor.executeRoutine = routineSpy;

    const results = await executor.run([task, routine], 'foo');

    expect(taskSpy).toHaveBeenCalledWith(task, 'foo', true);
    expect(routineSpy).toHaveBeenCalledWith(routine, 'foo', true);
  });
});
