import Task from '../src/Task';
import {
  STATUS_PENDING,
  STATUS_RUNNING,
  STATUS_SKIPPED,
  STATUS_PASSED,
  STATUS_FAILED,
} from '../src/constants';

describe('Task', () => {
  let task: Task<any>;

  beforeEach(() => {
    task = new Task('title', (context, value) => value * 2);
  });

  describe('constructor()', () => {
    it('errors if no title', () => {
      expect(() => new Task('', () => {})).toThrowErrorMatchingSnapshot();
    });

    it('errors if title is not a string', () => {
      // @ts-ignore
      expect(() => new Task(123, () => {})).toThrowErrorMatchingSnapshot();
    });

    it('errors if action is not a function', () => {
      // @ts-ignore
      expect(() => new Task('title', 123)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('hasFailed()', () => {
    it('returns a boolean for STATUS_FAILED status state', () => {
      expect(task.hasFailed()).toBe(false);

      task.status = STATUS_FAILED;

      expect(task.hasFailed()).toBe(true);
    });
  });

  describe('hasPassed()', () => {
    it('returns a boolean for STATUS_PASSED status state', () => {
      expect(task.hasPassed()).toBe(false);

      task.status = STATUS_PASSED;

      expect(task.hasPassed()).toBe(true);
    });
  });

  describe('isComplete()', () => {
    it('returns true when passed', () => {
      expect(task.isComplete()).toBe(false);

      task.status = STATUS_PASSED;

      expect(task.isComplete()).toBe(true);
    });

    it('returns true when failed', () => {
      expect(task.isComplete()).toBe(false);

      task.status = STATUS_FAILED;

      expect(task.isComplete()).toBe(true);
    });

    it('returns true when skipped', () => {
      expect(task.isComplete()).toBe(false);

      task.status = STATUS_SKIPPED;

      expect(task.isComplete()).toBe(true);
    });

    it('returns false when pending', () => {
      expect(task.isComplete()).toBe(false);

      task.status = STATUS_PENDING;

      expect(task.isComplete()).toBe(false);
    });

    it('returns false when running', () => {
      expect(task.isComplete()).toBe(false);

      task.status = STATUS_RUNNING;

      expect(task.isComplete()).toBe(false);
    });
  });

  describe('isPending()', () => {
    it('returns a boolean for STATUS_PENDING status state', () => {
      expect(task.isPending()).toBe(true);

      task.status = STATUS_PASSED;

      expect(task.isPending()).toBe(false);
    });
  });

  describe('isRunning()', () => {
    it('returns a boolean for STATUS_RUNNING status state', () => {
      expect(task.isRunning()).toBe(false);

      task.status = STATUS_RUNNING;

      expect(task.isRunning()).toBe(true);
    });
  });

  describe('isSkipped()', () => {
    it('returns a boolean for STATUS_SKIPPED status state', () => {
      expect(task.isSkipped()).toBe(false);

      task.status = STATUS_SKIPPED;

      expect(task.isSkipped()).toBe(true);
    });
  });

  describe('run()', () => {
    it('stores action result as output', async () => {
      const value = await task.run({}, 123);

      expect(value).toBe(246);
      expect(task.output).toBe(value);
    });

    it('resolves a value with the action', async () => {
      try {
        expect(await task.run({}, 123)).toBe(246);
        expect(task.status).toBe(STATUS_PASSED);
      } catch (error) {
        expect(true).toBe(false); // Would fail
      }
    });

    it('resolves a value if the task should be skipped', async () => {
      try {
        task.status = STATUS_SKIPPED;

        expect(await task.run({}, 123)).toBe(123);
      } catch (error) {
        expect(true).toBe(false); // Would fail
      }
    });

    it('rejects the value if the action throws an error', async () => {
      try {
        task.action = () => {
          throw new Error('Oops');
        };

        await task.run({}, 123);

        expect(true).toBe(false); // Would fail
      } catch (error) {
        expect(error).toEqual(new Error('Oops'));
        expect(task.status).toBe(STATUS_FAILED);
      }
    });

    it('passes a context to the action', async () => {
      const context = { count: 1 };

      /* eslint-disable no-param-reassign */
      task.action = (ctx, value) => {
        ctx.count += 1;
        ctx.foo = 'bar';
      };
      /* eslint-enable */

      await task.run(context, 123);

      expect(context).toEqual({
        count: 2,
        foo: 'bar',
      });
    });

    it('sets times on success', async () => {
      await task.run({}, 123);

      expect(task.metadata.startTime).not.toBe(0);
      expect(task.metadata.stopTime).not.toBe(0);
    });

    it('sets times on failure', async () => {
      try {
        task.action = () => {
          throw new Error('Oops');
        };

        await task.run({}, 123);
      } catch (error) {
        // Skip
      }

      expect(task.metadata.startTime).not.toBe(0);
      expect(task.metadata.stopTime).not.toBe(0);
    });

    it('passes task as 3rd argument to action', async () => {
      const spy = jest.fn();

      task.action = spy;

      await task.run({}, 123);

      expect(spy).toHaveBeenCalledWith({}, 123, task);
    });

    it('emits `skip` event when skipped', async () => {
      const spy = jest.fn();

      task.on('skip', spy);

      await task.skip().run({}, 123);

      expect(spy).toHaveBeenCalledWith(123);
    });

    it('emits `run` event when running', async () => {
      const spy = jest.fn();

      task.on('run', spy);

      await task.run({}, 123);

      expect(spy).toHaveBeenCalledWith(123);
    });

    it('emits `pass` event on success', async () => {
      const spy = jest.fn();

      task.on('pass', spy);

      await task.run({}, 123);

      expect(spy).toHaveBeenCalledWith(246);
    });

    it('emits `fail` event on error', async () => {
      const spy = jest.fn();

      task.on('fail', spy);

      try {
        task.action = () => {
          throw new Error('Oops');
        };

        await task.run({}, 123);
      } catch (error) {
        expect(spy).toHaveBeenCalledWith(error);
      }
    });
  });

  describe('setContext()', () => {
    it('sets the context', () => {
      task.setContext({ foo: 'bar' });

      expect(task.context).toEqual({ foo: 'bar' });
    });
  });

  describe('skip()', () => {
    it('marks a task as STATUS_SKIPPED', () => {
      expect(task.status).toBe(STATUS_PENDING);

      task.skip();

      expect(task.status).toBe(STATUS_SKIPPED);
    });

    it('evaluates a condition to determine whether to skip', () => {
      expect(task.status).toBe(STATUS_PENDING);

      // @ts-ignore
      task.skip(1 === 2);

      expect(task.status).toBe(STATUS_PENDING);
    });
  });
});
