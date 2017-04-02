import Routine from '../src/Routine';

describe('Routine', () => {
  let routine;

  beforeEach(() => {
    routine = new Routine('base');

    // Use a fake object for testing
    routine.console = { console: true };
  });

  describe('constructor()', () => {
    it('throws an error if no name is provided', () => {
      expect(() => new Routine()).toThrowError('Routine name must be a valid string.');
    });

    it('throws an error if name is not a string', () => {
      expect(() => new Routine(123)).toThrowError('Routine name must be a valid string.');
    });

    it('inherits default config', () => {
      routine = new Routine('base', { foo: 123 });

      expect(routine.config).toEqual({ foo: 123 });
    });
  });

  describe('configure()', () => {
    it('triggers setup', () => {
      let config = {};

      class SetupRoutine extends Routine {
        setup() {
          config = this.globalConfig;
        }
      }

      routine = new SetupRoutine('setup');
      routine.configure({}, { foo: 'bar' });

      expect(config).toEqual({ foo: 'bar' });
    });
  });

  describe('execute()', () => {
    it('returns a promise', () => {
      expect(routine.execute(123)).toBeInstanceOf(Promise);
    });

    it('passes the value down the promise', async () => {
      expect(await routine.execute(123)).toBe(123);
    });
  });

  describe('executeSubroutine()', () => {
    class SubRoutine extends Routine {
      execute(value) {
        return value * 2;
      }
    }

    it('returns a promise', () => {
      expect(routine.executeSubroutine(123, new SubRoutine('sub'))).toBeInstanceOf(Promise);
    });

    it('passes the value down the promise', async () => {
      expect(await routine.executeSubroutine(123, new SubRoutine('sub'))).toBe(246);
    });
  });

  describe('executeTask()', () => {
    const task = value => value * 3;

    it('returns a promise', () => {
      expect(routine.executeTask(123, task)).toBeInstanceOf(Promise);
    });

    it('passes the value down the promise', async () => {
      expect(await routine.executeTask(123, task)).toBe(369);
    });
  });

  describe('parallelizeSubroutines()', () => {
    class FailureSubRoutine extends Routine {
      execute() {
        throw new Error('Failure');
      }
    }

    it('returns a resolved promise if no subroutines exist', async () => {
      expect(await routine.parallelizeSubroutines('abc')).toEqual([]);
    });

    it('captures and rethrows errors that occur down the chain', async () => {
      routine.pipe(new FailureSubRoutine('failure'));

      try {
        await routine.parallelizeSubroutines('abc');
      } catch (error) {
        expect(error).toEqual(new Error('Failure'));
      }
    });
  });

  describe('parallelizeTasks()', () => {
    class FailureTaskRoutine extends Routine {
      foo(value) {
        return `${value}-foo`;
      }

      bar() {
        throw new Error('Failure');
      }
    }

    it('returns a resolved promise if no tasks exist', async () => {
      expect(await routine.parallelizeTasks('abc', [])).toEqual([]);
    });

    it('captures and rethrows errors that occur down the chain', async () => {
      routine = new FailureTaskRoutine('failure');

      try {
        await routine.parallelizeTasks('abc', [routine.foo, routine.bar]);
      } catch (error) {
        expect(error).toEqual(new Error('Failure'));
      }
    });

    it('supports normal functions', async () => {
      expect(await routine.parallelizeTasks('abc', [
        value => value.toUpperCase(),
        value => `${value}${value}`,
      ])).toEqual([
        'ABC',
        'abcabc',
      ]);
    });
  });

  describe('pipe()', () => {
    it('throws an error if a non-Routine is passed', () => {
      expect(() => routine.pipe('foo')).toThrowError('a');
    });

    it('sets subroutines in order', () => {
      const foo = new Routine('foo');
      const bar = new Routine('bar');
      const baz = new Routine('baz');

      routine.pipe(foo).pipe(bar).pipe(baz);

      expect(routine.subroutines).toEqual([foo, bar, baz]);
    });

    it('sets subroutines via rest arguments', () => {
      const foo = new Routine('foo');
      const bar = new Routine('bar');
      const baz = new Routine('baz');

      routine.pipe(foo, bar, baz);

      expect(routine.subroutines).toEqual([foo, bar, baz]);
    });

    it('passes global configuration to all subroutines', () => {
      routine.globalConfig = {
        dryRun: true,
        foo: {
          command: 'yarn run build',
        },
        baz: {
          outDir: './out/',
          compress: true,
        },
      };
      routine.config = routine.globalConfig;

      const foo = new Routine('foo');
      const bar = new Routine('bar');
      const baz = new Routine('baz');

      routine.pipe(foo, bar, baz);

      expect(foo.globalConfig).toEqual(routine.globalConfig);
      expect(bar.globalConfig).toEqual(routine.globalConfig);
      expect(baz.globalConfig).toEqual(routine.globalConfig);
    });

    it('passes nested configuration to subroutines of the same name', () => {
      routine.config = {
        foo: {
          command: 'yarn run build',
        },
        baz: {
          outDir: './out/',
          compress: true,
        },
      };

      const foo = new Routine('foo');
      const bar = new Routine('bar');
      const baz = new Routine('baz');

      routine.pipe(foo).pipe(bar).pipe(baz);

      expect(foo.config).toEqual({
        command: 'yarn run build',
      });

      expect(baz.config).toEqual({
        outDir: './out/',
        compress: true,
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

      const foo = new Routine('foo');
      const bar = new Routine('bar');
      const baz = new Routine('baz');

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

      const foo = new Routine('foo', {
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

      const foo = new Routine('foo');

      routine.pipe(foo);

      expect(foo.config).toEqual({});
    });

    it('inherits console from parent routine', () => {
      const foo = new Routine('foo');

      routine.pipe(foo);

      expect(foo.console).toBe(routine.console);
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
      execute(value) {
        return Promise.resolve({
          count: value.count * this.config.multiplier,
          key: value.key + this.name,
        });
      }
    }

    it('returns initial value if no tasks', async () => {
      routine = new SerializeSubsRoutine('base');

      expect(await routine.serializeSubroutines(123)).toBe(123);
    });

    it('executes all chained subroutines in sequential order', async () => {
      const foo = new SerializeSubsRoutine('foo', { multiplier: 2 });
      const bar = new SerializeSubsRoutine('bar', { multiplier: 3 });
      const baz = new SerializeSubsRoutine('baz', { multiplier: 1 });

      routine.pipe(foo, bar, baz);

      expect(await routine.serializeSubroutines({ count: 6, key: '' })).toEqual({
        count: 36,
        key: 'foobarbaz',
      });
    });
  });

  describe('serializeTasks()', () => {
    class SerializeTasksRoutine extends Routine {
      duplicate(value) {
        return `${value}${value}`;
      }

      upperCase(value) {
        return value.toUpperCase();
      }
    }

    it('returns initial value if no tasks', async () => {
      routine = new SerializeTasksRoutine('base');

      expect(await routine.serializeTasks(123, [])).toBe(123);
    });

    it('executes all passed tasks in sequential order', async () => {
      routine = new SerializeTasksRoutine('base');

      expect(await routine.serializeTasks('foo', [
        routine.duplicate,
        routine.upperCase,
      ])).toBe('FOOFOO');
    });

    it('supports normal functions', async () => {
      expect(await routine.serializeTasks('foo', [
        value => `${value}${value}`,
        value => value.toUpperCase(),
      ])).toBe('FOOFOO');
    });
  });
});
