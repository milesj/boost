import SerialExecutor from '../../src/executors/Serial';
import Task from '../../src/Task';
import { createTestTool, createTestRoutine } from '../helpers';

describe('SerialExecutor', () => {
  let executor;

  beforeEach(() => {
    executor = new SerialExecutor(createTestTool(), {});
  });

  it('triggers tasks in sequence', async () => {
    const foo = new Task('foo', (context, value) => value + 123);
    const bar = new Task('bar', (context, value) => value + 123);
    const baz = new Task('baz', (context, value) => value + 123);

    const results = await executor.run([foo, bar, baz], 0);

    expect(results).toBe(369);
  });

  it('triggers `executeRoutine` and `executeTask` with the correct values', async () => {
    const task = new Task('foo', (context, value) => value);
    const taskSpy = jest.fn((t, value) => value);
    const routine = createTestRoutine(executor.tool);
    const routineSpy = jest.fn((r, value) => value);

    executor.executeTask = taskSpy;
    executor.executeRoutine = routineSpy;

    const results = await executor.run([task, routine], 'foo');

    expect(taskSpy).toHaveBeenCalledWith(task, 'foo', false);
    expect(routineSpy).toHaveBeenCalledWith(routine, 'foo', false);
  });

  it('returns initial value if no processes', async () => {
    expect(await await executor.run([], 123)).toBe(123);
  });

  it('passes strings down the chain in order', async () => {
    const foo = new Task('foo', (context, value) => `${value}foo`);
    const bar = new Task('bar', (context, value) => `${value}bar`);
    const baz = new Task('baz', (context, value) => `${value}baz`);

    expect(await executor.run([foo, bar, baz], '')).toBe('foobarbaz');
  });

  it('passes promises down the chain in order', async () => {
    const foo = new Task('foo', (context, value) => Promise.resolve([...value, 'foo']));
    const bar = new Task('bar', (context, value) => Promise.resolve(['bar', ...value]));
    const baz = new Task('baz', (context, value) => Promise.resolve(value.concat(['baz'])));

    expect(await executor.run([foo, bar, baz], '')).toEqual(['bar', 'foo', 'baz']);
  });

  it('aborts early if an error occurs', async () => {
    let count = 0;

    function incCount(context, value) {
      count += 1;

      return value;
    }

    const foo = new Task('foo', incCount);
    const bar = new Task('bar', () => {
      throw new Error('Abort');
    });
    const baz = new Task('baz', incCount);

    try {
      await executor.run([foo, bar, baz], 0);
    } catch (error) {
      expect(error).toEqual(new Error('Abort'));
    }

    expect(count).toBe(1);
  });

  it('handles buffers', async () => {
    const foo = new Task('foo', (context, buffer) => {
      buffer.write('foo', 0, 3);

      return buffer;
    });
    const bar = new Task('bar', (context, buffer) => {
      buffer.write('bar', 3, 3);

      return buffer;
    });
    const baz = new Task('baz', (context, buffer) => {
      buffer.write('baz', 6, 3);

      return buffer;
    });

    const result = await executor.run([foo, bar, baz], Buffer.alloc(9));

    expect(result.toString('utf8')).toBe('foobarbaz');
  });
});
