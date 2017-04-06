import Promise from 'bluebird';
import Task from '../src/Task';
import { PENDING, SKIPPED, PASSED, FAILED } from '../src/constants';

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

    it('errors if no action', () => {
      expect(() => new Task('title')).toThrowError('Tasks require an executable function.');
    });

    it('errors if action is not a function', () => {
      expect(() => new Task('title', 123)).toThrowError('Tasks require an executable function.');
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
  });

  describe('skip()', () => {
    it('marks a task as SKIPPED', () => {
      expect(task.isSkipped()).toBe(false);

      task.skip();

      expect(task.isSkipped()).toBe(true);
    });

    it('evaluates a condition to determine whether to skip', () => {
      expect(task.isSkipped()).toBe(false);

      task.skip(1 === 2);

      expect(task.isSkipped()).toBe(false);
    });
  });

  describe('toTree()', () => {
    it('returns an object descriptor of the task', () => {
      expect(task.toTree()).toEqual({
        time: expect.any(Number),
        title: 'title',
        status: PENDING,
      });
    });
  });

  describe('wrapPromise()', () => {
    it('wraps the value in a promise', () => {
      expect(task.wrapPromise(123)).toBeInstanceOf(Promise);
    });

    it('wraps native promise in a bluebird promise', () => {
      expect(task.wrapPromise(global.Promise.resolve(123))).toBeInstanceOf(Promise);
    });

    it('returns the promise as is', () => {
      expect(task.wrapPromise(Promise.resolve(123))).toBeInstanceOf(Promise);
    });
  });
});
