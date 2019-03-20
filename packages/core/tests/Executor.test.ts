import { mockTool, mockRoutine, mockDebugger } from '../src/testUtils';
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

    it('emits console events when skipped', async () => {
      const spy = jest.fn();

      executor.tool.console.emit = spy;

      routine.skip();

      await executor.executeRoutine(routine, 123);

      expect(spy).toHaveBeenCalledWith('routine', [routine, 123, false]);
      expect(spy).toHaveBeenCalledWith('routine.skip', [routine, 123, false]);
    });

    it('emits console events if a success', async () => {
      const spy = jest.fn();

      executor.tool.console.emit = spy;

      await executor.executeRoutine(routine, 123);

      expect(spy).toHaveBeenCalledWith('routine', [routine, 123, false]);
      expect(spy).toHaveBeenCalledWith('routine.pass', [routine, 123, false]);
    });

    it('emits console events if a failure', async () => {
      const spy = jest.fn();

      executor.tool.console.emit = spy;

      // @ts-ignore
      routine.action = () => {
        throw new Error('Oops');
      };

      try {
        await executor.executeRoutine(routine, 123);
      } catch (error) {
        expect(error).toEqual(new Error('Oops'));
      }

      expect(spy).toHaveBeenCalledWith('routine', [routine, 123, false]);
      expect(spy).toHaveBeenCalledWith('routine.fail', [routine, new Error('Oops'), false]);
    });

    it('emits console events with parallel flag', async () => {
      const spy = jest.fn();

      executor.tool.console.emit = spy;
      executor.parallel = true;

      await executor.executeRoutine(routine, 123);

      expect(spy).toHaveBeenCalledWith('routine', [routine, 123, true]);
      expect(spy).toHaveBeenCalledWith('routine.pass', [routine, 123, true]);
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

    it('emits console events when skipped', async () => {
      const spy = jest.fn();

      executor.tool.console.emit = spy;

      task.skip();

      await executor.executeTask(task, 123);

      expect(spy).toHaveBeenCalledWith('task', [task, 123, false]);
      expect(spy).toHaveBeenCalledWith('task.skip', [task, 123, false]);
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
      executor.parallel = true;

      await executor.executeTask(task, 123);

      expect(spy).toHaveBeenCalledWith('task', [task, 123, true]);
      expect(spy).toHaveBeenCalledWith('task.pass', [task, 369, true]);
    });
  });

  describe('runRoutines()', () => {
    const routines = [mockRoutine(tool), mockRoutine(tool), mockRoutine(tool)];

    beforeEach(() => {
      executor.run = jest.fn();
    });

    it('calls `executeRoutine` with routines', async () => {
      await executor.runRoutines(routines, 123);

      expect(executor.run).toHaveBeenCalledWith(executor.executeRoutine, routines, 123);
    });

    it('emits `routines` event', async () => {
      const spy = jest.fn();

      executor.tool.console.emit = spy;

      await executor.runRoutines(routines, 123);

      expect(spy).toHaveBeenCalledWith('routines', [routines, 123]);
    });

    it('emits `routines.parallel` event when parallel', async () => {
      const spy = jest.fn();

      executor.tool.console.emit = spy;
      executor.parallel = true;

      await executor.runRoutines(routines, 123);

      expect(spy).toHaveBeenCalledWith('routines.parallel', [routines, 123]);
    });
  });

  describe('runTasks()', () => {
    const tasks = [
      new Task('title', () => 123),
      new Task('title', () => 456),
      new Task('title', () => 789),
    ];

    beforeEach(() => {
      executor.run = jest.fn();
    });

    it('calls `executeTask` with routines', async () => {
      await executor.runTasks(tasks, 123);

      expect(executor.run).toHaveBeenCalledWith(executor.executeTask, tasks, 123);
    });

    it('emits `routines` event', async () => {
      const spy = jest.fn();

      executor.tool.console.emit = spy;

      await executor.runTasks(tasks, 123);

      expect(spy).toHaveBeenCalledWith('tasks', [tasks, 123]);
    });

    it('emits `routines.parallel` event when parallel', async () => {
      const spy = jest.fn();

      executor.tool.console.emit = spy;
      executor.parallel = true;

      await executor.runTasks(tasks, 123);

      expect(spy).toHaveBeenCalledWith('tasks.parallel', [tasks, 123]);
    });
  });
});
