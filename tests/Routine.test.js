/* eslint-disable no-param-reassign */

import Promise from 'bluebird';
import Routine from '../src/Routine';
import Task from '../src/Task';
import Tool from '../src/Tool';
import { STATUS_PASSED, STATUS_FAILED, DEFAULT_TOOL_CONFIG } from '../src/constants';

describe('Routine', () => {
  let routine;
  let tool;

  beforeEach(() => {
    tool = new Tool({
      appName: 'boost',
    });
    tool.config = {
      ...DEFAULT_TOOL_CONFIG,
      baz: {
        compress: true,
        outDir: './out/',
      },
      foo: {
        command: 'yarn run build',
      },
    };

    routine = new Routine('key', 'title');
    routine.configure(tool, {});
  });

  class FailureSubRoutine extends Routine {
    execute() {
      throw new Error('Failure');
    }
  }

  class ContextSubRoutine extends Routine {
    constructor(...args) {
      super(...args);

      this.tool = tool;

      this
        .task('foo', this.foo)
        .task('bar', this.bar)
        .task('baz', this.baz);
    }

    execute(value, context) {
      context.count *= this.config.multiplier;
      context[this.key] = true;

      return value;
    }

    foo(value, context) {
      context.foo = 123;

      return value;
    }

    bar(value, context) {
      context.bar = 456;

      return value;
    }

    baz(value, context) {
      context.baz = 789;

      return value;
    }
  }

  describe('constructor()', () => {
    it('throws an error if no key is provided', () => {
      expect(() => new Routine('', 'title')).toThrowError('Routine key must be a valid unique string.');
    });

    it('throws an error if key is not a string', () => {
      expect(() => new Routine(123, 'title')).toThrowError('Routine key must be a valid unique string.');
    });

    it('throws an error if key is reserved', () => {
      expect(() => new Routine('extends', 'title')).toThrowError('Invalid routine key "extends". This key is reserved.');
    });

    it('inherits default config', () => {
      routine = new Routine('key', 'title', { foo: 123 });

      expect(routine.config).toEqual({ foo: 123 });
    });
  });

  describe('configure()', () => {
    it('triggers bootstrap', () => {
      let config = {};

      class BootstrapRoutine extends Routine {
        bootstrap() {
          ({ config } = this.tool);
        }
      }

      routine = new BootstrapRoutine('bootstrap', 'title');
      routine.configure(tool, { foo: 'bar' });

      expect(config).toEqual(tool.config);
    });
  });

  describe('executeTask()', () => {
    let task;

    beforeEach(() => {
      task = new Task('title', value => value * 3);
    });

    it('returns a promise', () => {
      expect(routine.executeTask(123, task)).toBeInstanceOf(Promise);
    });

    it('renders the console', async () => {
      const spy = jest.spyOn(routine.tool, 'render');

      await routine.executeTask(123, task);

      expect(spy).toBeCalled();
    });

    it('passes the value down the promise', async () => {
      expect(await routine.executeTask(123, task)).toBe(369);
    });

    it('updates status if a success', async () => {
      await routine.executeTask(123, task);

      expect(task.status).toBe(STATUS_PASSED);
    });

    it('updates status if a failure', async () => {
      task = new Task('title', () => {
        throw new Error('Oops');
      });

      try {
        await routine.executeTask(123, task);
      } catch (error) {
        expect(error).toEqual(new Error('Oops'));
      }

      expect(task.status).toBe(STATUS_FAILED);
    });
  });

  describe('parallelizeSubroutines()', () => {
    it('returns a resolved promise if no subroutines exist', async () => {
      expect(await routine.parallelizeSubroutines('abc')).toEqual([]);
    });

    it('captures and rethrows errors that occur down the chain', async () => {
      routine.pipe(new FailureSubRoutine('failure', 'title'));

      try {
        await routine.parallelizeSubroutines('abc');
      } catch (error) {
        expect(error).toEqual(new Error('Failure'));
      }
    });

    it('passes context through routines when ran', async () => {
      const context = {
        count: 3,
        parallel: 'routine',
      };

      routine.pipe(
        new ContextSubRoutine('foo', 'title', { multiplier: 2 }),
        new ContextSubRoutine('bar', 'title', { multiplier: 3 }),
        new ContextSubRoutine('baz', 'title', { multiplier: 2 }),
      );
      routine.action = value => routine.parallelizeSubroutines(value);

      await routine.run(null, context);

      expect(context).toEqual({
        bar: true,
        baz: true,
        count: 36,
        foo: true,
        parallel: 'routine',
      });
      expect(routine.context).toBe(context);
    });
  });

  describe('parallelizeTasks()', () => {
    class FailureTaskRoutine extends Routine {
      constructor(...args) {
        super(...args);

        this.tool = tool;
      }

      foo(value) {
        return `${value}-foo`;
      }

      bar() {
        throw new Error('Failure');
      }
    }

    it('returns a resolved promise if no tasks exist', async () => {
      expect(await routine.parallelizeTasks('abc')).toEqual([]);
    });

    it('captures and rethrows errors that occur down the chain', async () => {
      routine = new FailureTaskRoutine('failure', 'title');
      routine.task('foo', routine.foo);
      routine.task('bar', routine.bar);

      try {
        await routine.parallelizeTasks('abc');
      } catch (error) {
        expect(error).toEqual(new Error('Failure'));
      }
    });

    it('supports normal functions', async () => {
      routine.task('upper', value => value.toUpperCase());
      routine.task('dupe', value => `${value}${value}`);

      expect(await routine.parallelizeTasks('abc')).toEqual([
        'ABC',
        'abcabc',
      ]);
    });

    it('passes context through tasks when ran', async () => {
      const context = { parallel: 'task' };

      routine = new ContextSubRoutine('context', 'title');
      routine.action = value => routine.parallelizeTasks(value);

      await routine.run(null, context);

      expect(context).toEqual({
        bar: 456,
        baz: 789,
        foo: 123,
        parallel: 'task',
      });
      expect(routine.context).toBe(context);
    });
  });

  describe('pipe()', () => {
    it('throws an error if a non-Routine is passed', () => {
      expect(() => routine.pipe('foo')).toThrowError('a');
    });

    it('sets subroutines in order', () => {
      const foo = new Routine('foo', 'title');
      const bar = new Routine('bar', 'title');
      const baz = new Routine('baz', 'title');

      routine.pipe(foo).pipe(bar).pipe(baz);

      expect(routine.subroutines).toEqual([foo, bar, baz]);
    });

    it('sets subroutines via rest arguments', () => {
      const foo = new Routine('foo', 'title');
      const bar = new Routine('bar', 'title');
      const baz = new Routine('baz', 'title');

      routine.pipe(foo, bar, baz);

      expect(routine.subroutines).toEqual([foo, bar, baz]);
    });

    it('passes global configuration to all subroutines', () => {
      routine.config = routine.tool.config;

      const foo = new Routine('foo', 'title');
      const bar = new Routine('bar', 'title');
      const baz = new Routine('baz', 'title');

      routine.pipe(foo, bar, baz);

      expect(foo.global).toEqual(routine.global);
      expect(bar.global).toEqual(routine.global);
      expect(baz.global).toEqual(routine.global);
    });

    it('passes nested configuration to subroutines of the same key', () => {
      routine.config = {
        baz: {
          compress: true,
          outDir: './out/',
        },
        foo: {
          command: 'yarn run build',
        },
      };

      const foo = new Routine('foo', 'title');
      const bar = new Routine('bar', 'title');
      const baz = new Routine('baz', 'title');

      routine.pipe(foo).pipe(bar).pipe(baz);

      expect(foo.config).toEqual({
        command: 'yarn run build',
      });

      expect(baz.config).toEqual({
        compress: true,
        outDir: './out/',
      });
    });

    it('passes deeply nested configuration', () => {
      routine.config = {
        foo: {
          bar: {
            baz: {
              deep: true,
            },
          },
        },
      };

      const foo = new Routine('foo', 'title');
      const bar = new Routine('bar', 'title');
      const baz = new Routine('baz', 'title');

      routine.pipe(foo);
      foo.pipe(bar);
      bar.pipe(baz);

      expect(foo.config).toEqual({
        bar: {
          baz: {
            deep: true,
          },
        },
      });

      expect(baz.config).toEqual({
        deep: true,
      });
    });

    it('deep merges configuration', () => {
      routine.config = {
        foo: {
          command: 'yarn run build',
          options: {
            babel: true,
          },
        },
      };

      const foo = new Routine('foo', 'title', {
        command: '',
        options: {
          babel: false,
          es2015: true,
        },
      });

      routine.pipe(foo);

      expect(foo.config).toEqual({
        command: 'yarn run build',
        options: {
          babel: true,
          es2015: true,
        },
      });
    });

    it('ignores configuration that is not an object', () => {
      routine.config = {
        foo: 123,
      };

      const foo = new Routine('foo', 'title');

      routine.pipe(foo);

      expect(foo.config).toEqual({});
    });

    it('inherits console from parent routine', () => {
      const foo = new Routine('foo', 'title');

      routine.pipe(foo);

      expect(foo.console).toBe(routine.console);
    });
  });

  describe('run()', () => {
    it('returns a promise', () => {
      expect(routine.run(123)).toBeInstanceOf(Promise);
    });

    it('passes the value down the promise', async () => {
      expect(await routine.run(123)).toBe(123);
    });

    it('triggers group start and stop', async () => {
      const startSpy = jest.spyOn(routine.tool, 'startDebugGroup');
      const stopSpy = jest.spyOn(routine.tool, 'stopDebugGroup');
      const renderSpy = jest.spyOn(routine.tool, 'render');

      await routine.run(123);

      expect(startSpy).toBeCalledWith('key');
      expect(stopSpy).toBeCalled();
      expect(renderSpy).toBeCalled();
    });

    it('triggers group stop if an error occurs', async () => {
      const stopSpy = jest.spyOn(routine.tool, 'stopDebugGroup');
      const renderSpy = jest.spyOn(routine.tool, 'render');

      try {
        await routine.pipe(new FailureSubRoutine('failure', 'title')).run(123);
      } catch (error) {
        expect(error).toEqual(new Error('Failure'));
      }

      expect(stopSpy).toBeCalled();
      expect(renderSpy).toBeCalled();
    });

    it('updates status if a success', async () => {
      await routine.run(123);

      expect(routine.status).toBe(STATUS_PASSED);
    });

    it('updates status if a failure', async () => {
      routine.action = () => {
        throw new Error('Failure');
      };

      try {
        await routine.run(123);
      } catch (error) {
        expect(error).toEqual(new Error('Failure'));
      }

      expect(routine.status).toBe(STATUS_FAILED);
    });
  });

  describe('serialize()', () => {
    it('returns initial value if no processes', async () => {
      expect(await routine.serialize(123, [])).toBe(123);
    });

    it('passes strings down the chain in order', async () => {
      expect(await routine.serialize('', ['foo', 'bar', 'baz'], (prev, next) => prev + next)).toBe('foobarbaz');
    });

    it('passes numbers down the chain in order', async () => {
      expect(await routine.serialize(0, [1, 2, 3], (prev, next) => prev + (next * 2))).toBe(12);
    });

    it('passes promises down the chain in order', async () => {
      expect(await routine.serialize([], [
        value => Promise.resolve([...value, 'foo']),
        value => Promise.resolve(['bar', ...value]),
        value => Promise.resolve(value.concat(['baz'])),
      ], (value, func) => func(value))).toEqual([
        'bar',
        'foo',
        'baz',
      ]);
    });

    it('aborts early if an error occurs', async () => {
      let count = 0;

      function incCount(value) {
        count += 1;

        return value;
      }

      try {
        await routine.serialize([], [
          incCount,
          incCount,
          () => Promise.reject(new Error('Abort')),
          incCount,
          incCount,
        ], (value, func) => func(value));
      } catch (error) {
        expect(error).toEqual(new Error('Abort'));
      }

      expect(count).toBe(2);
    });

    it('handles buffers', async () => {
      const result = await routine.serialize(Buffer.alloc(9), [
        (buffer) => {
          buffer.write('foo', 0, 3);

          return buffer;
        },
        (buffer) => {
          buffer.write('bar', 3, 3);

          return buffer;
        },
        (buffer) => {
          buffer.write('baz', 6, 3);

          return buffer;
        },
      ], (buffer, func) => func(buffer));

      expect(result.toString('utf8')).toBe('foobarbaz');
    });
  });

  describe('serializeSubroutines()', () => {
    class SerializeSubsRoutine extends Routine {
      constructor(...args) {
        super(...args);

        this.tool = tool;
      }

      execute(value) {
        return Promise.resolve({
          count: value.count * this.config.multiplier,
          key: value.key + this.key,
        });
      }
    }

    it('returns initial value if no tasks', async () => {
      routine = new SerializeSubsRoutine('key', 'title');

      expect(await routine.serializeSubroutines(123)).toBe(123);
    });

    it('executes all chained subroutines in sequential order', async () => {
      const foo = new SerializeSubsRoutine('foo', 'title', { multiplier: 2 });
      const bar = new SerializeSubsRoutine('bar', 'title', { multiplier: 3 });
      const baz = new SerializeSubsRoutine('baz', 'title', { multiplier: 1 });

      routine.pipe(foo, bar, baz);

      expect(await routine.serializeSubroutines({ count: 6, key: '' })).toEqual({
        count: 36,
        key: 'foobarbaz',
      });
    });

    it('passes context through routines when ran', async () => {
      const context = {
        count: 3,
        serial: 'routine',
      };

      routine.pipe(
        new ContextSubRoutine('foo', 'title', { multiplier: 2 }),
        new ContextSubRoutine('bar', 'title', { multiplier: 3 }),
        new ContextSubRoutine('baz', 'title', { multiplier: 2 }),
      );
      routine.action = value => routine.serializeSubroutines(value);

      await routine.run(null, context);

      expect(context).toEqual({
        bar: true,
        baz: true,
        count: 36,
        foo: true,
        serial: 'routine',
      });
      expect(routine.context).toBe(context);
    });
  });

  describe('serializeTasks()', () => {
    class SerializeTasksRoutine extends Routine {
      constructor(...args) {
        super(...args);

        this.tool = tool;
      }

      duplicate(value) {
        return `${value}${value}`;
      }

      upperCase(value) {
        return value.toUpperCase();
      }
    }

    it('returns initial value if no tasks', async () => {
      routine = new SerializeTasksRoutine('key', 'title');

      expect(await routine.serializeTasks(123)).toBe(123);
    });

    it('executes all passed tasks in sequential order', async () => {
      routine = new SerializeTasksRoutine('key', 'title');
      routine.task('upper', routine.upperCase);
      routine.task('dupe', routine.duplicate);

      expect(await routine.serializeTasks('foo')).toBe('FOOFOO');
    });

    it('supports normal functions', async () => {
      routine.task('upper', value => value.toUpperCase());
      routine.task('dupe', value => `${value}${value}`);

      expect(await routine.serializeTasks('foo')).toBe('FOOFOO');
    });

    it('passes context through tasks when ran', async () => {
      const context = { serial: 'task' };

      routine = new ContextSubRoutine('context', 'title');
      routine.action = value => routine.serializeTasks(value);

      await routine.run(null, context);

      expect(context).toEqual({
        bar: 456,
        baz: 789,
        foo: 123,
        serial: 'task',
      });
      expect(routine.context).toBe(context);
    });
  });

  describe('task()', () => {
    it('errors if not a function', () => {
      expect(() => {
        routine.task('foo', 'bar');
      }).toThrowError('Tasks require an executable function.');
    });

    it('maps `Task` objects', () => {
      expect(routine.subtasks).toHaveLength(0);

      routine.task('foo', value => value);
      routine.task('bar', value => value);

      expect(routine.subtasks).toHaveLength(2);
      expect(routine.subtasks[0]).toBeInstanceOf(Task);
      expect(routine.subtasks[1]).toBeInstanceOf(Task);
    });

    it('binds the action function to the routine', async () => {
      let config;

      routine.task('foo', function foo() {
        ({ config } = this);
      });

      await routine.executeTask(null, routine.subtasks[0]);

      expect(config).toEqual(routine.config);
    });

    it('defines the config for the task', () => {
      routine.task('foo', value => value, { foo: 'bar' });

      expect(routine.subtasks[0].config).toEqual({ foo: 'bar' });
    });
  });
});
