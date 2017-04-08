import Promise from 'bluebird';
import Task from '../src/Task';
import TaskResult from '../src/TaskResult';
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

  describe('toResult()', () => {
    it('returns a result descriptor of the task', () => {
      expect(task.toResult()).toEqual(new TaskResult('title', PENDING));
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
