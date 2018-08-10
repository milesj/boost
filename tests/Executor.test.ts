import Executor from '../src/Executor';
import Task, { TaskInterface } from '../src/Task';
import Tool from '../src/Tool';
import { RoutineInterface } from '../src/Routine';
import { STATUS_PASSED, STATUS_FAILED } from '../src/constants';
import { createTestTool, createTestRoutine, createTestDebugger } from './helpers';

describe('Executor()', () => {
  let tool: Tool<any, any>;
  let executor: Executor;

  beforeEach(() => {
    tool = createTestTool();

    executor = new Executor(tool, {});
    executor.debug = createTestDebugger();
  });

  describe('aggregateResponse()', () => {
    it('partitions errors and non-errors', () => {
      expect(executor.aggregateResponse([123, new Error(), 'foo', true])).toEqual({
        errors: [new Error()],
        results: [123, 'foo', true],
      });
    });
  });

  describe('execute()', () => {
    it('executes a routine', () => {
      const spy = jest.fn();
      const routine = createTestRoutine(tool);

      executor.executeRoutine = spy;
      executor.execute(routine, 123, true);

      expect(spy).toHaveBeenCalledWith(routine, 123, true);
    });

    it('executes a task', () => {
      const spy = jest.fn();
      const task = new Task('Title', () => {});

      executor.executeTask = spy;
      executor.execute(task, 123, false);

      expect(spy).toHaveBeenCalledWith(task, 123, false);
    });
  });

  describe('executeRoutine()', () => {
    let routine: RoutineInterface;

    beforeEach(() => {
      routine = createTestRoutine(tool);
    });

    it('returns a promise', () => {
      expect(executor.executeRoutine(routine, 123)).toBeInstanceOf(Promise);
    });

    it('passes the value down the promise', async () => {
      expect(await executor.executeRoutine(routine, 123)).toBe(123);
    });

    it('updates status if a success', async () => {
      await executor.executeRoutine(routine, 123);

      expect(routine.status).toBe(STATUS_PASSED);
    });

    it('updates status if a failure', async () => {
      // @ts-ignore
      routine.action = () => {
        throw new Error('Oops');
      };

      try {
        await executor.executeRoutine(routine, 123);
      } catch (error) {
        expect(error).toEqual(new Error('Oops'));
      }

      expect(routine.status).toBe(STATUS_FAILED);
    });
  });

  describe('executeTask()', () => {
    let task: TaskInterface;

    beforeEach(() => {
      task = new Task('title', (con, value) => value * 3);
    });

    it('returns a promise', () => {
      expect(executor.executeTask(task, 123)).toBeInstanceOf(Promise);
    });

    it('passes the value down the promise', async () => {
      expect(await executor.executeTask(task, 123)).toBe(369);
    });

    it('updates status if a success', async () => {
      await executor.executeTask(task, 123);

      expect(task.status).toBe(STATUS_PASSED);
    });

    it('updates status if a failure', async () => {
      task = new Task('title', () => {
        throw new Error('Oops');
      });

      try {
        await executor.executeTask(task, 123);
      } catch (error) {
        expect(error).toEqual(new Error('Oops'));
      }

      expect(task.status).toBe(STATUS_FAILED);
    });

    it('emits console events if a success', async () => {
      const spy = jest.fn();

      executor.tool.console.emit = spy;

      await executor.executeTask(task, 123);

      expect(spy).toHaveBeenCalledWith('task', [task, 123, false]);
      expect(spy).toHaveBeenCalledWith('task.pass', [task, 369, false]);
    });

    it('emits console events if a failure', async () => {
      const spy = jest.fn();

      executor.tool.console.emit = spy;

      task = new Task('title', () => {
        throw new Error('Oops');
      });

      try {
        await executor.executeTask(task, 123);
      } catch (error) {
        expect(error).toEqual(new Error('Oops'));
      }

      expect(spy).toHaveBeenCalledWith('task', [task, 123, false]);
      expect(spy).toHaveBeenCalledWith('task.fail', [task, new Error('Oops'), false]);
    });

    it('emits console events with parallel flag', async () => {
      const spy = jest.fn();

      executor.tool.console.emit = spy;

      await executor.executeTask(task, 123, true);

      expect(spy).toHaveBeenCalledWith('task', [task, 123, true]);
      expect(spy).toHaveBeenCalledWith('task.pass', [task, 369, true]);
    });
  });

  describe('run()', () => {
    it('errors if not defined', () => {
      expect(() => {
        executor.run([]);
      }).toThrowError('run() must be defined.');
    });
  });
});
