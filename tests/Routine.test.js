/* eslint-disable no-param-reassign */

import Routine from '../src/Routine';
import Task from '../src/Task';
import Tool from '../src/Tool';
import { STATUS_PASSED, STATUS_FAILED, DEFAULT_TOOL_CONFIG } from '../src/constants';

describe('Routine', () => {
  let routine;
  let tool;

  beforeEach(() => {
    tool = new Tool({
      appName: 'test-boost',
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
    tool.initialized = true; // Avoid loaders

    routine = new Routine('key', 'title');
    routine.configure({
      config: {},
      context: {},
      tool,
    });
    routine.debug = () => {};
  });

  class FailureRoutine extends Routine {
    constructor(...args) {
      super(...args);

      this.debug = () => {};
    }

    execute() {
      throw new Error('Failure');
    }
  }

  class ContextRoutine extends Routine {
    constructor(...args) {
      super(...args);

      this.tool = tool;
      this.debug = () => {};

      this.task('foo', this.foo);
      this.task('bar', this.bar);
      this.task('baz', this.baz);
    }

    execute(context, value) {
      context.count *= this.options.multiplier;
      context[this.key] = true;

      return this.options.return ? this.key : value;
    }

    foo(context, value) {
      context.foo = 123;

      return value;
    }

    bar(context, value) {
      context.bar = 456;

      return value;
    }

    baz(context, value) {
      context.baz = 789;

      return value;
    }
  }

  it('flags an exit when an exit event occurs', () => {
    expect(routine.exit).toBe(false);

    tool.emit('exit');

    expect(routine.exit).toBe(true);
  });

  describe('constructor()', () => {
    it('throws an error if no key is provided', () => {
      expect(() => new Routine('', 'title')).toThrowError(
        'Routine key must be a valid unique string.',
      );
    });

    it('throws an error if key is not a string', () => {
      expect(() => new Routine(123, 'title')).toThrowError(
        'Routine key must be a valid unique string.',
      );
    });

    it('inherits default options', () => {
      routine = new Routine('key', 'title', { foo: 123 });

      expect(routine.options).toEqual({ foo: 123 });
    });
  });

  describe('configure()', () => {
    it('triggers bootstrap', () => {
      let config = {};

      class BootstrapRoutine extends Routine {
        constructor(...args) {
          super(...args);

          this.debug = () => {};
        }

        bootstrap() {
          ({ config } = this.tool);
        }
      }

      routine = new BootstrapRoutine('bootstrap', 'title');
      routine.configure({
        config: { foo: 'bar' },
        context: {},
        tool,
      });

      expect(config).toEqual(tool.config);
    });
  });

  describe('executeCommand()', () => {
    it('runs a local command and captures output', async () => {
      expect((await routine.executeCommand('yarn', ['-v'])).stdout).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('runs a local command synchronously', async () => {
      expect((await routine.executeCommand('yarn', ['-v'], { sync: true })).stdout).toMatch(
        /^\d+\.\d+\.\d+$/,
      );
    });

    it('calls callback with stream', async () => {
      const spy = jest.fn();

      await routine.executeCommand('yarn', ['-v'], { wrap: spy });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('executeTask()', () => {
    let task;

    beforeEach(() => {
      task = new Task('title', (con, value) => value * 3);
    });

    it('returns a promise', () => {
      expect(routine.executeTask(task, 123)).toBeInstanceOf(Promise);
    });

    it('passes the value down the promise', async () => {
      expect(await routine.executeTask(task, 123)).toBe(369);
    });

    it('updates status if a success', async () => {
      await routine.executeTask(task, 123);

      expect(task.status).toBe(STATUS_PASSED);
    });

    it('updates status if a failure', async () => {
      task = new Task('title', () => {
        throw new Error('Oops');
      });

      try {
        await routine.executeTask(task, 123);
      } catch (error) {
        expect(error).toEqual(new Error('Oops'));
      }

      expect(task.status).toBe(STATUS_FAILED);
    });

    it('emits console events if a success', async () => {
      const spy = jest.fn();

      routine.tool.console.emit = spy;

      await routine.executeTask(task, 123);

      expect(spy).toHaveBeenCalledWith('task', [task, routine, 123, false]);
      expect(spy).toHaveBeenCalledWith('task.pass', [task, routine, 369, false]);
    });

    it('emits console events if a failure', async () => {
      const spy = jest.fn();

      routine.tool.console.emit = spy;

      task = new Task('title', () => {
        throw new Error('Oops');
      });

      try {
        await routine.executeTask(task, 123);
      } catch (error) {
        expect(error).toEqual(new Error('Oops'));
      }

      expect(spy).toHaveBeenCalledWith('task', [task, routine, 123, false]);
      expect(spy).toHaveBeenCalledWith('task.fail', [task, routine, new Error('Oops'), false]);
    });

    it('emits console events with parallel flag', async () => {
      const spy = jest.fn();

      routine.tool.console.emit = spy;

      await routine.executeTask(task, 123, true);

      expect(spy).toHaveBeenCalledWith('task', [task, routine, 123, true]);
      expect(spy).toHaveBeenCalledWith('task.pass', [task, routine, 369, true]);
    });
  });

  describe('parallelizeRoutines()', () => {
    it('returns a resolved promise if no routines exist', async () => {
      expect(await routine.parallelizeRoutines('abc')).toEqual([]);
    });

    it('captures and rethrows errors that occur down the chain', async () => {
      routine.pipe(new FailureRoutine('failure', 'title'));

      try {
        await routine.parallelizeRoutines('abc');
      } catch (error) {
        expect(error).toEqual(new Error('Failure'));
      }
    });

    it('passes context through routines when ran', async () => {
      const context = {
        count: 3,
        parallel: 'routine',
      };

      routine
        .pipe(new ContextRoutine('foo', 'title', { multiplier: 2 }))
        .pipe(new ContextRoutine('bar', 'title', { multiplier: 3 }))
        .pipe(new ContextRoutine('baz', 'title', { multiplier: 2 }));

      routine.action = (con, value) => routine.parallelizeRoutines(value);

      await routine.run(context);

      expect(context).toEqual({
        bar: true,
        baz: true,
        count: 36,
        foo: true,
        parallel: 'routine',
      });
      expect(routine.context).toBe(context);
    });

    it('calls `executeRoutine` with correct args', async () => {
      const spy = jest.fn();
      const sub = new ContextRoutine('foo', 'title', { multiplier: 1 });

      routine.pipe(sub);
      routine.action = (con, value) => routine.parallelizeRoutines(value);
      routine.executeRoutine = spy;

      await routine.run();

      expect(spy).toHaveBeenCalledWith(sub, undefined, true);
    });

    it('can run a specific list of routines', async () => {
      const foo = new Routine('foo', 'title');
      const bar = new Routine('bar', 'title');
      const baz = new Routine('baz', 'title');

      routine
        .pipe(foo)
        .pipe(bar)
        .pipe(baz);

      routine.action = (con, value) => routine.parallelizeRoutines(value, [bar]);

      await routine.run({});

      expect(foo.isPending()).toBe(true);
      expect(bar.isPending()).toBe(false);
      expect(baz.isPending()).toBe(true);
    });
  });

  describe('parallelizeTasks()', () => {
    class FailureTaskRoutine extends Routine {
      constructor(...args) {
        super(...args);

        this.tool = tool;
        this.debug = () => {};
      }

      foo(context, value) {
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
      routine.task('upper', (context, value) => value.toUpperCase());
      routine.task('dupe', (context, value) => `${value}${value}`);

      expect(await routine.parallelizeTasks('abc')).toEqual(['ABC', 'abcabc']);
    });

    it('passes context through tasks when ran', async () => {
      const context = { parallel: 'task' };

      routine = new ContextRoutine('context', 'title');
      routine.action = (con, value) => routine.parallelizeTasks(value);

      await routine.run(context);

      expect(context).toEqual({
        bar: 456,
        baz: 789,
        foo: 123,
        parallel: 'task',
      });
      expect(routine.context).toBe(context);
    });

    it('calls `executeTask` with correct args', async () => {
      const spy = jest.fn();

      routine = new ContextRoutine('context', 'title');
      routine.action = (con, value) => routine.parallelizeTasks(value);
      routine.executeTask = spy;

      await routine.run();

      expect(spy).toHaveBeenCalledWith(routine.tasks[0], undefined, true);
      expect(spy).toHaveBeenCalledWith(routine.tasks[1], undefined, true);
      expect(spy).toHaveBeenCalledWith(routine.tasks[2], undefined, true);
    });

    it('can run a specific list of routines', async () => {
      const foo = routine.task('title', () => {});
      const bar = routine.task('title', () => {});
      const baz = routine.task('title', () => {});

      routine.action = (con, value) => routine.parallelizeTasks(value, [bar]);

      await routine.run({});

      expect(foo.isPending()).toBe(true);
      expect(bar.isPending()).toBe(false);
      expect(baz.isPending()).toBe(true);
    });
  });

  describe('pipe()', () => {
    it('throws an error if a non-Routine is passed', () => {
      expect(() => routine.pipe('foo')).toThrowError('a');
    });

    it('sets routines in order', () => {
      const foo = new Routine('foo', 'title');
      const bar = new Routine('bar', 'title');
      const baz = new Routine('baz', 'title');

      routine
        .pipe(foo)
        .pipe(bar)
        .pipe(baz);

      expect(routine.routines).toEqual([foo, bar, baz]);
    });

    it('inherits console from parent routine', () => {
      const foo = new Routine('foo', 'title');

      routine.pipe(foo);

      expect(foo.console).toBe(routine.console);
    });
  });

  describe('run()', () => {
    it('returns a promise', () => {
      expect(routine.run({}, 123)).toBeInstanceOf(Promise);
    });

    it('errors if an exit occurs', async () => {
      routine.exit = true;

      try {
        await routine.run({}, 123);
      } catch (error) {
        expect(error).toEqual(new Error('Process has been interrupted.'));
      }
    });

    it('passes the value down the promise', async () => {
      expect(await routine.run({}, 123)).toBe(123);
    });

    it('updates status if a success', async () => {
      await routine.run({}, 123);

      expect(routine.status).toBe(STATUS_PASSED);
    });

    it('updates status if a failure', async () => {
      routine.action = () => {
        throw new Error('Failure');
      };

      try {
        await routine.run({}, 123);
      } catch (error) {
        expect(error).toEqual(new Error('Failure'));
      }

      expect(routine.status).toBe(STATUS_FAILED);
    });

    it('emits console events if a success', async () => {
      const spy = jest.fn();

      routine.tool.console.emit = spy;

      await routine.run({}, 123);

      expect(spy).toHaveBeenCalledWith('routine', [routine, 123, false]);
      expect(spy).toHaveBeenCalledWith('routine.pass', [routine, 123, false]);
    });

    it('emits console events if a failure', async () => {
      const spy = jest.fn();

      routine.tool.console.emit = spy;

      routine.action = () => {
        throw new Error('Failure');
      };

      try {
        await routine.run({}, 123);
      } catch (error) {
        expect(error).toEqual(new Error('Failure'));
      }

      expect(spy).toHaveBeenCalledWith('routine', [routine, 123, false]);
      expect(spy).toHaveBeenCalledWith('routine.fail', [routine, new Error('Failure'), false]);
    });

    it('emits console with parallel flags', async () => {
      const spy = jest.fn();

      routine.tool.console.emit = spy;

      await routine.run({}, 123, true);

      expect(spy).toHaveBeenCalledWith('routine', [routine, 123, true]);
      expect(spy).toHaveBeenCalledWith('routine.pass', [routine, 123, true]);
    });

    it('passes task as 3rd argument to action', async () => {
      const spy = jest.fn();

      routine.action = spy;

      await routine.run({}, 123);

      expect(spy).toHaveBeenCalledWith({}, 123, routine);
    });
  });

  describe('serialize()', () => {
    it('returns initial value if no processes', async () => {
      expect(await routine.serialize([], () => {}, 123)).toBe(123);
    });

    it('passes strings down the chain in order', async () => {
      expect(await routine.serialize(['foo', 'bar', 'baz'], (next, prev) => prev + next, '')).toBe(
        'foobarbaz',
      );
    });

    it('passes numbers down the chain in order', async () => {
      expect(await routine.serialize([1, 2, 3], (next, prev) => prev + next * 2, 0)).toBe(12);
    });

    it('passes promises down the chain in order', async () => {
      expect(
        await routine.serialize(
          [
            value => Promise.resolve([...value, 'foo']),
            value => Promise.resolve(['bar', ...value]),
            value => Promise.resolve(value.concat(['baz'])),
          ],
          (func, value) => func(value),
          [],
        ),
      ).toEqual(['bar', 'foo', 'baz']);
    });

    it('aborts early if an error occurs', async () => {
      let count = 0;

      function incCount(value) {
        count += 1;

        return value;
      }

      try {
        await routine.serialize(
          [incCount, incCount, () => Promise.reject(new Error('Abort')), incCount, incCount],
          (func, value) => func(value),
          [],
        );
      } catch (error) {
        expect(error).toEqual(new Error('Abort'));
      }

      expect(count).toBe(2);
    });

    it('handles buffers', async () => {
      const result = await routine.serialize(
        [
          buffer => {
            buffer.write('foo', 0, 3);

            return buffer;
          },
          buffer => {
            buffer.write('bar', 3, 3);

            return buffer;
          },
          buffer => {
            buffer.write('baz', 6, 3);

            return buffer;
          },
        ],
        (func, buffer) => func(buffer),
        Buffer.alloc(9),
      );

      expect(result.toString('utf8')).toBe('foobarbaz');
    });
  });

  describe('serializeRoutines()', () => {
    class SerializeSubsRoutine extends Routine {
      constructor(...args) {
        super(...args);

        this.tool = tool;
        this.debug = () => {};
      }

      execute(context, value) {
        return Promise.resolve({
          count: value.count * this.options.multiplier,
          key: value.key + this.key,
        });
      }
    }

    it('returns initial value if no tasks', async () => {
      routine = new SerializeSubsRoutine('key', 'title');

      expect(await routine.serializeRoutines(123)).toBe(123);
    });

    it('executes all chained routines in sequential order', async () => {
      const foo = new SerializeSubsRoutine('foo', 'title', { multiplier: 2 });
      const bar = new SerializeSubsRoutine('bar', 'title', { multiplier: 3 });
      const baz = new SerializeSubsRoutine('baz', 'title', { multiplier: 1 });

      routine
        .pipe(foo)
        .pipe(bar)
        .pipe(baz);

      expect(await routine.serializeRoutines({ count: 6, key: '' })).toEqual({
        count: 36,
        key: 'foobarbaz',
      });
    });

    it('passes context through routines when ran', async () => {
      const context = {
        count: 3,
        serial: 'routine',
      };

      routine
        .pipe(new ContextRoutine('foo', 'title', { multiplier: 2 }))
        .pipe(new ContextRoutine('bar', 'title', { multiplier: 3 }))
        .pipe(new ContextRoutine('baz', 'title', { multiplier: 2 }));

      routine.action = (con, value) => routine.serializeRoutines(value);

      await routine.run(context);

      expect(context).toEqual({
        bar: true,
        baz: true,
        count: 36,
        foo: true,
        serial: 'routine',
      });
      expect(routine.context).toBe(context);
    });

    it('can run a specific list of routines', async () => {
      const foo = new Routine('foo', 'title');
      const bar = new Routine('bar', 'title');
      const baz = new Routine('baz', 'title');

      routine
        .pipe(foo)
        .pipe(bar)
        .pipe(baz);

      routine.action = (con, value) => routine.serializeRoutines(value, [bar]);

      await routine.run({});

      expect(foo.isPending()).toBe(true);
      expect(bar.isPending()).toBe(false);
      expect(baz.isPending()).toBe(true);
    });
  });

  describe('serializeTasks()', () => {
    class SerializeTasksRoutine extends Routine {
      constructor(...args) {
        super(...args);

        this.tool = tool;
        this.debug = () => {};
      }

      duplicate(context, value) {
        return `${value}${value}`;
      }

      upperCase(context, value) {
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
      routine.task('upper', (context, value) => value.toUpperCase());
      routine.task('dupe', (context, value) => `${value}${value}`);

      expect(await routine.serializeTasks('foo')).toBe('FOOFOO');
    });

    it('passes context through tasks when ran', async () => {
      const context = { serial: 'task' };

      routine = new ContextRoutine('context', 'title');
      routine.action = (con, value) => routine.serializeTasks(value);

      await routine.run(context);

      expect(context).toEqual({
        bar: 456,
        baz: 789,
        foo: 123,
        serial: 'task',
      });
      expect(routine.context).toBe(context);
    });

    it('can run a specific list of routines', async () => {
      const foo = routine.task('title', () => {});
      const bar = routine.task('title', () => {});
      const baz = routine.task('title', () => {});

      routine.action = (con, value) => routine.serializeTasks(value, [bar]);

      await routine.run({});

      expect(foo.isPending()).toBe(true);
      expect(bar.isPending()).toBe(false);
      expect(baz.isPending()).toBe(true);
    });
  });

  describe('synchronize()', () => {
    it('separates errors and results', async () => {
      const response = await routine.synchronize([
        Promise.resolve(123),
        Promise.resolve(456),
        Promise.resolve(new Error('Foo')),
        Promise.resolve(789),
        Promise.resolve(321),
      ]);

      expect(response).toEqual({
        errors: [new Error('Foo')],
        results: [123, 456, 789, 321],
      });
    });
  });

  describe('synchronizeRoutines()', () => {
    it('returns a resolved promise if no routines exist', async () => {
      expect(await routine.synchronizeRoutines('abc')).toEqual({ results: [], errors: [] });
    });

    it('passes context through routines when ran', async () => {
      const context = {
        count: 3,
        parallel: 'routine',
      };

      routine
        .pipe(new ContextRoutine('foo', 'title', { multiplier: 2 }))
        .pipe(new ContextRoutine('bar', 'title', { multiplier: 3 }))
        .pipe(new ContextRoutine('baz', 'title', { multiplier: 2 }));

      routine.action = (con, value) => routine.synchronizeRoutines(value);

      await routine.run(context);

      expect(context).toEqual({
        bar: true,
        baz: true,
        count: 36,
        foo: true,
        parallel: 'routine',
      });
      expect(routine.context).toBe(context);
    });

    it('calls `executeRoutine` with correct args', async () => {
      const spy = jest.fn(() => Promise.resolve());
      const sub = new ContextRoutine('foo', 'title', { multiplier: 1 });

      routine.pipe(sub);
      routine.action = (con, value) => routine.synchronizeRoutines(value);
      routine.executeRoutine = spy;

      await routine.run();

      expect(spy).toHaveBeenCalledWith(sub, undefined, true);
    });

    it('synchronizes promises, collects errors, and lets all promises finish', async () => {
      const context = { count: 1 };

      routine
        .pipe(new ContextRoutine('foo', 'title', { multiplier: 2, return: true }))
        .pipe(new ContextRoutine('bar', 'title', { multiplier: 2, return: true }))
        .pipe(new FailureRoutine('err', 'title'))
        .pipe(new ContextRoutine('baz', 'title', { multiplier: 2, return: true }))
        .pipe(new ContextRoutine('qux', 'title', { multiplier: 2, return: true }));

      routine.action = () => routine.synchronizeRoutines();

      const response = await routine.run(context);

      // eslint-disable-next-line
      expect(context.count).toBe(16);
      expect(response).toEqual({
        errors: [new Error('Failure')],
        results: ['foo', 'bar', 'baz', 'qux'],
      });
    });

    it('can run a specific list of routines', async () => {
      const foo = new Routine('foo', 'title');
      const bar = new Routine('bar', 'title');
      const baz = new Routine('baz', 'title');

      routine
        .pipe(foo)
        .pipe(bar)
        .pipe(baz);

      routine.action = (con, value) => routine.synchronizeRoutines(value, [bar]);

      await routine.run({});

      expect(foo.isPending()).toBe(true);
      expect(bar.isPending()).toBe(false);
      expect(baz.isPending()).toBe(true);
    });
  });

  describe('synchronizeTasks()', () => {
    it('returns a resolved promise if no tasks exist', async () => {
      expect(await routine.synchronizeTasks('abc')).toEqual({ results: [], errors: [] });
    });

    it('supports normal functions', async () => {
      routine.task('upper', (context, value) => value.toUpperCase());
      routine.task('dupe', (context, value) => `${value}${value}`);

      expect(await routine.synchronizeTasks('abc')).toEqual({
        results: ['ABC', 'abcabc'],
        errors: [],
      });
    });

    it('passes context through tasks when ran', async () => {
      const context = { parallel: 'task' };

      routine = new ContextRoutine('context', 'title');
      routine.action = (con, value) => routine.synchronizeTasks(value);

      await routine.run(context);

      expect(context).toEqual({
        bar: 456,
        baz: 789,
        foo: 123,
        parallel: 'task',
      });
      expect(routine.context).toBe(context);
    });

    it('calls `executeTask` with correct args', async () => {
      const spy = jest.fn(() => Promise.resolve());

      routine = new ContextRoutine('context', 'title');
      routine.action = (con, value) => routine.synchronizeTasks(value);
      routine.executeTask = spy;

      await routine.run();

      expect(spy).toHaveBeenCalledWith(routine.tasks[0], undefined, true);
      expect(spy).toHaveBeenCalledWith(routine.tasks[1], undefined, true);
      expect(spy).toHaveBeenCalledWith(routine.tasks[2], undefined, true);
    });

    it('synchronizes promises, collects errors, and lets all promises finish', async () => {
      let count = 0;

      routine.task('foo', () => {
        count += 1;

        return 'foo';
      });
      routine.task('bar', () => {
        count += 1;

        return 'bar';
      });
      routine.task('err', () => new Error('Failure'));
      routine.task('baz', () => {
        count += 1;

        return 'baz';
      });
      routine.task('qux', () => {
        count += 1;

        return 'qux';
      });

      routine.action = () => routine.synchronizeTasks();

      const response = await routine.run();

      expect(count).toBe(4);
      expect(response).toEqual({
        errors: [new Error('Failure')],
        results: ['foo', 'bar', 'baz', 'qux'],
      });
    });

    it('can run a specific list of routines', async () => {
      const foo = routine.task('title', () => {});
      const bar = routine.task('title', () => {});
      const baz = routine.task('title', () => {});

      routine.action = (con, value) => routine.synchronizeTasks(value, [bar]);

      await routine.run({});

      expect(foo.isPending()).toBe(true);
      expect(bar.isPending()).toBe(false);
      expect(baz.isPending()).toBe(true);
    });
  });

  describe('task()', () => {
    it('errors if not a function', () => {
      expect(() => {
        routine.task('foo', 'bar');
      }).toThrowError('Tasks require an executable function.');
    });

    it('maps `Task` objects', () => {
      expect(routine.tasks).toHaveLength(0);

      routine.task('foo', value => value);
      routine.task('bar', value => value);

      expect(routine.tasks).toHaveLength(2);
      expect(routine.tasks[0]).toBeInstanceOf(Task);
      expect(routine.tasks[1]).toBeInstanceOf(Task);
    });

    it('binds the action function to the routine', async () => {
      let config;

      routine.task('foo', function foo() {
        // eslint-disable-next-line babel/no-invalid-this
        ({ config } = this);
      });

      await routine.executeTask(routine.tasks[0]);

      expect(config).toEqual(routine.config);
    });

    it('defines the options for the task', () => {
      routine.task('foo', value => value, { foo: 'bar' });

      expect(routine.tasks[0].options).toEqual({ foo: 'bar' });
    });

    it('returns a `Task` instance', () => {
      const task = routine.task('foo', value => value, { foo: 'bar' });

      expect(task).toBeInstanceOf(Task);
    });
  });
});
