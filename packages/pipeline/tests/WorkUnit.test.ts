import Context from '../src/Context';
import Task from '../src/Task';
import WorkUnit from '../src/WorkUnit';
import { STATUS_RUNNING } from '../src/constants';

describe('Work', () => {
  let context: Context;
  let passWork: WorkUnit<{}, number, number>;
  let failWork: WorkUnit<{}, string, string>;

  class CountContext extends Context {
    count = 0;
  }

  beforeEach(() => {
    context = new Context();
    passWork = new Task('title', (ctx, value) => value * 2);
    failWork = new Task<string, string>('title', () => {
      throw new Error('Oops');
    });
  });

  describe('constructor()', () => {
    it('errors if no title', () => {
      expect(() => new Task('', () => {})).toThrowErrorMatchingSnapshot();
    });

    it('errors if title is not a string', () => {
      expect(
        () =>
          new Task(
            // @ts-expect-error
            123,
            () => {},
          ),
      ).toThrowErrorMatchingSnapshot();
    });

    it('errors if action is not a function', () => {
      expect(
        () =>
          new Task(
            'title',
            // @ts-expect-error
            123,
          ),
      ).toThrowErrorMatchingSnapshot();
    });
  });

  describe('hasFailed()', () => {
    it('returns a boolean for STATUS_FAILED status state', async () => {
      expect(failWork.hasFailed()).toBe(false);

      try {
        await failWork.run(context, '');
      } catch {
        // Ignore
      }

      expect(failWork.hasFailed()).toBe(true);
    });
  });

  describe('hasPassed()', () => {
    it('returns a boolean for STATUS_PASSED status state', async () => {
      expect(passWork.hasPassed()).toBe(false);

      await passWork.run(context, 0);

      expect(passWork.hasPassed()).toBe(true);
    });
  });

  describe('id()', () => {
    it('returns hierarchy ID', () => {
      passWork.depth = 8;
      passWork.index = 3;

      expect(passWork.id).toBe('work[8:3]');
    });
  });

  describe('isComplete()', () => {
    it('returns true when passed', async () => {
      expect(passWork.isComplete()).toBe(false);

      await passWork.run(context, 0);

      expect(passWork.isComplete()).toBe(true);
    });

    it('returns true when failed', async () => {
      expect(failWork.isComplete()).toBe(false);

      try {
        await failWork.run(context, '');
      } catch {
        // Ignore
      }

      expect(failWork.isComplete()).toBe(true);
    });

    it('returns true when skipped', async () => {
      expect(passWork.isComplete()).toBe(false);

      await passWork.skip().run(context, 0);

      expect(passWork.isComplete()).toBe(true);
    });

    it('returns false when pending (default)', () => {
      expect(passWork.isComplete()).toBe(false);
    });

    it('returns false when running', () => {
      expect(passWork.isComplete()).toBe(false);

      // @ts-expect-error
      passWork.status = STATUS_RUNNING;

      expect(passWork.isComplete()).toBe(false);
    });
  });

  describe('isPending()', () => {
    it('returns a boolean for STATUS_PENDING status state (default)', () => {
      expect(passWork.isPending()).toBe(true);
    });
  });

  describe('isRunning()', () => {
    it('returns a boolean for STATUS_RUNNING status state', () => {
      expect(passWork.isRunning()).toBe(false);

      // @ts-expect-error
      passWork.status = STATUS_RUNNING;

      expect(passWork.isRunning()).toBe(true);
    });
  });

  describe('isSkipped()', () => {
    it('returns a boolean for STATUS_SKIPPED status state', () => {
      expect(passWork.isSkipped()).toBe(false);

      passWork.skip();

      expect(passWork.isSkipped()).toBe(true);
    });
  });

  describe('run()', () => {
    it('stores action result as output', async () => {
      const value = await passWork.run(context, 123);

      expect(value).toBe(246);
      expect(passWork.output).toBe(value);
    });

    it('resolves a value with the action', async () => {
      try {
        expect(await passWork.run(context, 123)).toBe(246);
      } catch (error) {
        expect(true).toBe(false);
      }
    });

    it('resolves a value if the task should be skipped', async () => {
      try {
        passWork.skip();

        expect(await passWork.run(context, 123)).toBe(123);
      } catch (error) {
        expect(true).toBe(false);
      }
    });

    it('rejects the value if the action throws an error', async () => {
      try {
        await failWork.run(context, '');

        expect(true).toBe(false);
      } catch (error) {
        expect(error).toEqual(new Error('Oops'));
        expect(failWork.hasFailed()).toBe(true);
      }
    });

    it('passes a context to the action', async () => {
      context = new CountContext();
      passWork = new Task('title', (ctx: CountContext) => {
        ctx.count = 1;

        return ctx.count;
      });

      await passWork.run(context, 123);

      expect(context).toEqual(
        expect.objectContaining({
          count: 1,
        }),
      );
    });

    it('sets times on success', async () => {
      await passWork.run(context, 123);

      expect(passWork.startTime).not.toBe(0);
      expect(passWork.stopTime).not.toBe(0);
    });

    it('sets times on failure', async () => {
      try {
        await failWork.run(context, '');
      } catch (error) {
        // Ignore
      }

      expect(failWork.startTime).not.toBe(0);
      expect(failWork.stopTime).not.toBe(0);
    });

    it('passes work unit as 3rd argument to action', async () => {
      const spy = jest.fn();

      passWork = new Task('title', spy);

      await passWork.run(context, 123);

      expect(spy).toHaveBeenCalledWith({}, 123, passWork);
    });

    it('emits `onSkip` event when skipped', async () => {
      const spy = jest.fn();

      passWork.onSkip.listen(spy);

      await passWork.skip().run(context, 123);

      expect(spy).toHaveBeenCalledWith(123);
    });

    it('emits `onRun` event before running', async () => {
      const spy = jest.fn();

      passWork.onRun.listen(spy);

      await passWork.run(context, 123);

      expect(spy).toHaveBeenCalledWith(123);
    });

    it('emits `onPass` event on success', async () => {
      const spy = jest.fn();

      passWork.onPass.listen(spy);

      await passWork.run(context, 123);

      expect(spy).toHaveBeenCalledWith(246);
    });

    it('emits `onFail` event on error', async () => {
      const spy = jest.fn();

      failWork.onFail.listen(spy);

      try {
        await failWork.run(context, '');
      } catch (error) {
        expect(spy).toHaveBeenCalledWith(error);
      }
    });

    it('can skip if `onRun` listener returns false', async () => {
      const skipSpy = jest.fn();
      const otherSpy = jest.fn();

      passWork.onRun.listen(() => false);
      passWork.onSkip.listen(skipSpy);
      passWork.onPass.listen(otherSpy);
      passWork.onFail.listen(otherSpy);

      await passWork.run(context, 123);

      expect(passWork.isSkipped()).toBe(true);
      expect(skipSpy).toHaveBeenCalledWith(123);
      expect(otherSpy).not.toHaveBeenCalled();
    });
  });

  describe('skip()', () => {
    it('marks a task as skipped', () => {
      expect(passWork.isSkipped()).toBe(false);

      passWork.skip();

      expect(passWork.isSkipped()).toBe(true);
    });

    it('evaluates a condition to determine whether to skip', () => {
      expect(passWork.isSkipped()).toBe(false);

      // @ts-expect-error
      passWork.skip(1 === 2);

      expect(passWork.isSkipped()).toBe(false);
    });
  });
});
