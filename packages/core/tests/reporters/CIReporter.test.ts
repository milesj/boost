import { mockTool, mockConsole } from '../../src/testUtils';
import CIReporter from '../../src/reporters/CIReporter';

describe('CIReporter', () => {
  let reporter: CIReporter;
  let outSpy: jest.Mock;

  beforeEach(() => {
    const tool = mockTool();

    reporter = new CIReporter();
    reporter.console = mockConsole(tool);
    reporter.tool = tool;

    outSpy = reporter.console.out as jest.Mock;
  });

  describe('bootstrap()', () => {
    it('binds events', () => {
      const startSpy = jest.spyOn(reporter.console.onStart, 'listen');
      const routineSpy = jest.spyOn(reporter.console.onRoutine, 'listen');
      const taskSpy = jest.spyOn(reporter.console.onTask, 'listen');

      reporter.bootstrap();

      expect(startSpy).toHaveBeenCalledWith(expect.anything());
      expect(routineSpy).toHaveBeenCalledWith(expect.anything());
      expect(taskSpy).toHaveBeenCalledWith(expect.anything());
    });
  });

  describe('handleTask()', () => {
    it('increments count', () => {
      expect(reporter.taskCount).toBe(0);

      reporter.handleTask();

      expect(reporter.taskCount).toBe(1);
    });
  });

  describe('handleRoutine()', () => {
    it('increments count', () => {
      expect(reporter.routineCount).toBe(0);

      reporter.handleRoutine();

      expect(reporter.routineCount).toBe(1);
    });
  });

  describe('handleStop()', () => {
    it('displays the time', () => {
      reporter.handleStop();

      expect(outSpy).toHaveBeenCalledWith(
        expect.stringContaining('Ran 0 routine(s) and 0 task(s) in'),
      );
    });
  });
});
