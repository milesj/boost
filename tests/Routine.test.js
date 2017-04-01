import Routine from '../src/Routine';
import {
  ParralelSubsRoutine,
  ParralelTasksRoutine,
  SerializeSubsRoutine,
  SerializeTasksRoutine,
} from './stubs';

describe('Routine', () => {
  let routine;

  beforeEach(() => {
    routine = new Routine('base');
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
          command: 'npm run build',
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
          command: 'npm run build',
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
        command: 'npm run build',
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
          command: 'npm run build',
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
        command: 'npm run build',
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
  });

  describe('parallelizeSubroutines()', () => {
    it('returns a resolved promise if no subroutines exist', () => {
      routine.parallelizeSubroutines('abc')
        .then((value) => {
          console.log(1);
          expect(value).toEqual([]);
        });
    });

    it('captures and rethrows errors that occur down the chain', () => {
      const qux = new ParralelSubsRoutine('qux');

      routine.pipe(qux);
      routine.parallelizeSubroutines('abc')
        .catch((error) => {
          console.log(2);
          expect(error).toEqual(new Error('Failure'));
        });
    });
  });

  describe('parallelizeTasks()', () => {
    it('returns a resolved promise if no tasks exist', () => {
      routine.parallelizeTasks('abc', [])
        .then((value) => {
          console.log(3);
          expect(value).toEqual([]);
        });
    });

    it('captures and rethrows errors that occur down the chain', () => {
      routine = new ParralelTasksRoutine('base');
      routine.parallelizeTasks('abc', [routine.qux])
        .catch((error) => {
          console.log(4);
          expect(error).toEqual(new Error('Failure'));
        });
    });
  });

  describe('serializeSubroutines()', () => {
    it('returns initial value if no tasks', () => {
      routine = new SerializeSubsRoutine('base');
      routine.serializeSubroutines(123)
        .then((value) => {
          console.log(5);
          expect(value).toBe(123);
        });
    });

    it('executes all chained subroutines in sequential order', () => {
      const foo = new SerializeSubsRoutine('foo', { multiplier: 2 });
      const bar = new SerializeSubsRoutine('bar', { multiplier: 3 });
      const baz = new SerializeSubsRoutine('baz', { multiplier: 1 });

      routine.pipe(foo, bar, baz);
      routine.serializeSubroutines({ count: 6, key: '' })
        .then((value) => {
          console.log(6);
          expect(value).toEqual({
            count: 36,
            key: 'foobarbaz',
          });
        });
    });
  });

  describe('serializeTasks()', () => {
    it('returns initial value if no tasks', () => {
      routine = new SerializeTasksRoutine('base');
      routine.serializeTasks(123, [])
        .then((value) => {
          console.log(7);
          expect(value).toBe(123);
        });
    });

    it('executes all passed tasks in sequential order', () => {
      routine = new SerializeTasksRoutine('base');
      routine.serializeTasks('foo', [
        routine.duplicate,
        routine.upperCase,
        routine.lowerFirst,
      ]).then((value) => {
        console.log(8);
        expect(value).toBe('fOOFOO');
      });
    });
  });
});
