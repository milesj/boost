import Promise from 'bluebird';
import Task from '../src/Task';
import { PENDING, RUNNING, SKIPPED, PASSED, FAILED } from '../src/constants';

describe('Task', () => {
  let task;

  beforeEach(() => {
    task = new Task('title', value => value * 2);
  });

  describe('constructor()', () => {
    it('errors if no title', () => {
      expect(() => new Task('')).toThrowError('Tasks require a title.');
    });

    it('errors if title is not a string', () => {
      expect(() => new Task(123)).toThrowError('Tasks require a title.');
    });

    it('errors if action is not a function', () => {
      expect(() => new Task('title', 123)).toThrowError('Tasks require an executable function.');
    });

    it('doesnt error if action is null', () => {
      expect(() => new Task('title')).not.toThrow();
    });

    it('marks the task as skipped if no action', () => {
      task = new Task('title');

      expect(task.isSkipped()).toBe(true);
    });

    it('inherits default config', () => {
      task = new Task('title', value => value, { foo: 'bar' });

      expect(task.config).toEqual({ foo: 'bar' });
    });
  });

  describe('hasFailed()', () => {
    it('returns a boolean for FAILED status state', () => {
      expect(task.hasFailed()).toBe(false);

      task.status = FAILED;

      expect(task.hasFailed()).toBe(true);
    });
  });

  describe('hasPassed()', () => {
    it('returns a boolean for PASSED status state', () => {
      expect(task.hasPassed()).toBe(false);

      task.status = PASSED;

      expect(task.hasPassed()).toBe(true);
    });
  });

  describe('isPending()', () => {
    it('returns a boolean for PENDING status state', () => {
      expect(task.isPending()).toBe(true);

      task.status = PASSED;

      expect(task.isPending()).toBe(false);
    });
  });

  describe('isRunning()', () => {
    it('returns a boolean for RUNNING status state', () => {
      expect(task.isRunning()).toBe(false);

      task.status = RUNNING;

      expect(task.isRunning()).toBe(true);
    });
  });

  describe('isSkipped()', () => {
    it('returns a boolean for SKIPPED status state', () => {
      expect(task.isSkipped()).toBe(false);

      task.status = SKIPPED;

      expect(task.isSkipped()).toBe(true);
    });
  });

  describe('run()', () => {
    it('resolves a value with the action', async () => {
      try {
        expect(await task.run(123)).toBe(246);
        expect(task.status).toBe(PASSED);
      } catch (error) {
        expect(true).toBe(false); // Would fail
      }
    });

    it('resolves a value if the task should be skipped', async () => {
      try {
        task.status = SKIPPED;

        expect(await task.run(123)).toBe(123);
      } catch (error) {
        expect(true).toBe(false); // Would fail
      }
    });

    it('rejects the value if the action throws an error', async () => {
      try {
        task.action = () => {
          throw new Error('Oops');
        };

        await task.run(123);

        expect(true).toBe(false); // Would fail
      } catch (error) {
        expect(error).toEqual(new Error('Oops'));
        expect(task.status).toBe(FAILED);
      }
    });

    it('passes the value through when no action exists', async () => {
      task.action = null;

      expect(await task.run(123)).toBe(123);
    });

    it('passes a context to the action', async () => {
      const context = { count: 1 };

      /* eslint-disable no-param-reassign */
      task.action = (value, con) => {
        con.count += 1;
        con.foo = 'bar';
      };
      /* eslint-enable */

      await task.run(123, context);

      expect(context).toEqual({
        count: 2,
        foo: 'bar',
      });
    });
  });

  describe('skip()', () => {
    it('marks a task as SKIPPED', () => {
      expect(task.status).toBe(PENDING);

      task.skip();

      expect(task.status).toBe(SKIPPED);
    });

    it('evaluates a condition to determine whether to skip', () => {
      expect(task.status).toBe(PENDING);

      task.skip(1 === 2);

      expect(task.status).toBe(PENDING);
    });
  });

  describe('spinner()', () => {
    it('increases frames each call', () => {
      expect(task.spinner()).toBe('⠙');
      expect(task.spinner()).toBe('⠹');
      expect(task.spinner()).toBe('⠸');
      expect(task.spinner()).toBe('⠼');
    });
  });

  describe('wrap()', () => {
    it('wraps the value in a promise', () => {
      expect(task.wrap(123)).toBeInstanceOf(Promise);
    });

    it('wraps native promise in a bluebird promise', () => {
      expect(task.wrap(global.Promise.resolve(123))).toBeInstanceOf(Promise);
    });

    it('returns the promise as is', () => {
      expect(task.wrap(Promise.resolve(123))).toBeInstanceOf(Promise);
    });
  });
});
