import { expect } from 'chai';
import Routine from '../src/Routine';
import {
  ParralelSubsRoutine,
  ParralelTasksRoutine,
  SerializeSubsRoutine,
  SerializeTasksRoutine,
} from './mocks';

describe('Routine', () => {
  let routine;

  beforeEach(() => {
    routine = new Routine('base');
  });

  describe('constructor()', () => {
    it('throws an error if no name is provided', () => {
      expect(() => new Routine()).to.throw(TypeError);
    });

    it('throws an error if name is not a string', () => {
      expect(() => new Routine(123)).to.throw(TypeError);
    });

    it('inherits default config', () => {
      routine = new Routine('base', { foo: 123 });

      expect(routine.config).to.deep.equal({ foo: 123 });
    });
  });

  describe('chain()', () => {
    it('throws an error if a non-Routine is passed', () => {
      expect(() => routine.chain('foo')).to.throw(TypeError);
    });

    it('sets subroutines in order', () => {
      const foo = new Routine('foo');
      const bar = new Routine('bar');
      const baz = new Routine('baz');

      routine.chain(foo).chain(bar).chain(baz);

      expect(routine.subroutines).to.deep.equal([foo, bar, baz]);
    });

    it('sets subroutines via rest arguments', () => {
      const foo = new Routine('foo');
      const bar = new Routine('bar');
      const baz = new Routine('baz');

      routine.chain(foo, bar, baz);

      expect(routine.subroutines).to.deep.equal([foo, bar, baz]);
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

      routine.chain(foo).chain(bar).chain(baz);

      expect(foo.config).to.deep.equal({
        command: 'npm run build',
      });

      expect(baz.config).to.deep.equal({
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

      routine.chain(foo);
      foo.chain(bar);
      bar.chain(baz);

      expect(foo.config).to.deep.equal({
        bar: {
          baz: {
            deep: true,
          },
        },
      });

      expect(baz.config).to.deep.equal({
        deep: true,
      });
    });

    it('ignores configuration that is not an object', () => {
      routine.config = {
        foo: 123,
      };

      const foo = new Routine('foo');

      routine.chain(foo);

      expect(foo.config).to.deep.equal({});
    });
  });

  describe('parallelizeSubroutines()', () => {
    it('returns a resolved promise if no subroutines exist', () => {
      return routine.parallelizeSubroutines('abc')
        .then((value) => {
          expect(value).to.deep.equal([]);
        });
    });

    it('captures and rethrows errors that occur down the chain', () => {
      const qux = new ParralelSubsRoutine('qux');

      routine.chain(qux);

      return routine.parallelizeSubroutines('abc')
        .catch((error) => {
          expect(error).to.deep.equal(new Error('Failure'));
        });
    });

    it('executes all subroutines in parallel', () => {
      const foo = new ParralelSubsRoutine('foo');
      const bar = new ParralelSubsRoutine('bar');
      const baz = new ParralelSubsRoutine('baz');

      routine.chain(foo).chain(bar).chain(baz);

      return routine.parallelizeSubroutines(123)
        .then((values) => {
          expect(values.every(v => v.start === values[0].start)).to.equal(true);
          expect(values.some(v => v.end !== values[0].end)).to.equal(true);
        });
    });
  });

  describe('parallelizeTasks()', () => {
    it('returns a resolved promise if no tasks exist', () => {
      return routine.parallelizeTasks('abc', [])
        .then((value) => {
          expect(value).to.deep.equal([]);
        });
    });

    it('captures and rethrows errors that occur down the chain', () => {
      routine = new ParralelTasksRoutine('base');

      return routine.parallelizeTasks('abc', [routine.qux])
        .catch((error) => {
          expect(error).to.deep.equal(new Error('Failure'));
        });
    });

    it('executes all tasks in parallel', () => {
      routine = new ParralelTasksRoutine('base');

      return routine.parallelizeTasks(123, [
        routine.foo,
        routine.bar,
        routine.baz,
      ]).then((values) => {
        expect(values.every(v => v.start === values[0].start)).to.equal(true);
        expect(values.some(v => v.end !== values[0].end)).to.equal(true);
      });
    });
  });

  describe('serializeSubroutines()', () => {
    it('returns initial value if no tasks', () => {
      routine = new SerializeSubsRoutine('base');

      return routine.serializeSubroutines(123)
        .then((value) => {
          expect(value).to.equal(123);
        });
    });

    it('executes all chained subroutines in sequential order', () => {
      const foo = new SerializeSubsRoutine('foo', { multiplier: 2 });
      const bar = new SerializeSubsRoutine('bar', { multiplier: 3 });
      const baz = new SerializeSubsRoutine('baz', { multiplier: 1 });

      routine.chain(foo, bar, baz);

      return routine.serializeSubroutines({ count: 6, key: '' })
        .then((value) => {
          expect(value).to.deep.equal({
            count: 36,
            key: 'foobarbaz',
          });
        });
    });
  });

  describe('serializeTasks()', () => {
    it('returns initial value if no tasks', () => {
      routine = new SerializeTasksRoutine('base');

      return routine.serializeTasks(123, [])
        .then((value) => {
          expect(value).to.equal(123);
        });
    });

    it('executes all passed tasks in sequential order', () => {
      routine = new SerializeTasksRoutine('base');

      return routine.serializeTasks('foo', [
        routine.duplicate,
        routine.upperCase,
        routine.lowerFirst,
      ]).then((value) => {
        expect(value).to.equal('fOOFOO');
      });
    });
  });
});
