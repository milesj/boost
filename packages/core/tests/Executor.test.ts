import { mockDebugger } from '@boost/debug/lib/testing';
import { mockTool, mockRoutine } from '../src/testUtils';
import Executor from '../src/Executor';
import Task from '../src/Task';
import Tool from '../src/Tool';
import Routine from '../src/Routine';
import { STATUS_PASSED, STATUS_FAILED } from '../src/constants';

describe('Executor', () => {
  let tool: Tool<any, any>;
  let executor: Executor<any>;

  class TestExecture extends Executor<any, any> {
    run() {
      return Promise.resolve();
    }
  }

  beforeEach(() => {
    tool = mockTool();

    executor = new TestExecture(tool, {});
    executor.debug = mockDebugger();
  });

  describe('aggregateResponse()', () => {
    it('partitions errors and non-errors', () => {
      expect(executor.aggregateResponse([123, new Error(), 'foo', true])).toEqual({
        errors: [new Error()],
        results: [123, 'foo', true],
      });
    });
  });

  describe('executeRoutine()', () => {
    let routine: Routine<any, any>;

    beforeEach(() => {
      routine = mockRoutine(tool);
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
    let task: Task<any>;

    beforeEach(() => {
      task = new Task('title', (con, value) => Promise.resolve(value * 3));
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
  });

  describe('runRoutines()', () => {
    const routines = [mockRoutine(tool), mockRoutine(tool), mockRoutine(tool)];

    beforeEach(() => {
      jest.spyOn(executor, 'run').mockImplementation();
    });

    it('calls `executeRoutine` with routines', async () => {
      await executor.runRoutines(routines, 123);

      expect(executor.run).toHaveBeenCalledWith(executor.executeRoutine, routines, 123);
    });

    it('emits `onRoutines` event', async () => {
      const spy = jest.fn();

      executor.tool.console.onRoutines.listen(spy);

      await executor.runRoutines(routines, 123);

      expect(spy).toHaveBeenCalledWith(routines, 123, false);
    });

    it('emits `onRoutines` event when parallel', async () => {
      const spy = jest.fn();

      executor.tool.console.onRoutines.listen(spy);
      executor.parallel = true;

      await executor.runRoutines(routines, 123);

      expect(spy).toHaveBeenCalledWith(routines, 123, true);
    });
  });

  describe('runTasks()', () => {
    const tasks = [
      new Task('title', () => 123),
      new Task('title', () => 456),
      new Task('title', () => 789),
    ];

    beforeEach(() => {
      jest.spyOn(executor, 'run').mockImplementation();
    });

    it('calls `executeTask` with routines', async () => {
      await executor.runTasks(tasks, 123);

      expect(executor.run).toHaveBeenCalledWith(executor.executeTask, tasks, 123);
    });

    it('emits `onTasks` event', async () => {
      const spy = jest.fn();

      executor.tool.console.onTasks.listen(spy);

      await executor.runTasks(tasks, 123);

      expect(spy).toHaveBeenCalledWith(tasks, 123, false);
    });

    it('emits `onTasks` event when parallel', async () => {
      const spy = jest.fn();

      executor.tool.console.onTasks.listen(spy);
      executor.parallel = true;

      await executor.runTasks(tasks, 123);

      expect(spy).toHaveBeenCalledWith(tasks, 123, true);
    });
  });
});
