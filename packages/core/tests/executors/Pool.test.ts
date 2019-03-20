import { mockTool } from '../../src/tests';
import PoolExecutor from '../../src/executors/Pool';
import Task from '../../src/Task';
import Context from '../../src/Context';

describe('PoolExecutor', () => {
  let executor: PoolExecutor<any>;

  beforeEach(() => {
    executor = new PoolExecutor(mockTool(), new Context(), {
      timeout: 1000,
    });
  });

  afterEach(() => {
    // Resolve any pending promises
    if (executor.resolver) {
      executor.resolver({
        results: [],
        errors: [],
      });
    }
  });

  it('triggers tasks in parallel', async () => {
    const foo = new Task('foo', () => 123);
    const bar = new Task('bar', () => {
      throw new Error('Oops');
    });
    const baz = new Task('baz', () => 789);

    const results = await executor.runTasks([foo, bar, baz]);

    expect(executor.queue).toHaveLength(0);
    expect(executor.running).toHaveLength(0);
    expect(results).toEqual({
      errors: [new Error('Oops')],
      results: [123, 789],
    });
  });

  it('returns response if no tasks', async () => {
    const results = await executor.runTasks([]);

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

    const results = await executor.runTasks([foo, bar, baz]);

    expect(results).toEqual({
      errors: [],
      results: [789, 456, 123],
    });
  });

  it('maxes at concurrency limit', async () => {
    jest.useRealTimers();

    executor.options.concurrency = 1;
    executor.nextItem = () => {}; // Stop it exhausting

    const foo = new Task('foo', () => 123);
    const bar = new Task('bar', () => 456);
    const baz = new Task('baz', () => 789);

    await executor.runTasks([foo, bar, baz]);

    expect(executor.queue).toHaveLength(2);
    expect(executor.running).toHaveLength(0);

    jest.useFakeTimers();
  });

  it('cycles 1 by 1', async () => {
    executor.options.concurrency = 1;

    const foo = new Task('foo', () => 123);
    const bar = new Task('bar', () => 456);
    const baz = new Task('baz', () => 789);

    const results = await executor.runTasks([foo, bar, baz]);

    expect(executor.queue).toHaveLength(0);
    expect(executor.running).toHaveLength(0);
    expect(results).toEqual({
      errors: [],
      results: [123, 456, 789],
    });
  });

  it('doesnt fail when an empty queue tries to run', async () => {
    const result = await executor.runItem();

    expect(result).toBeUndefined();
  });
});
