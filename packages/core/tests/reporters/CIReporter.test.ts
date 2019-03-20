import chalk from 'chalk';
import { mockTool, mockConsole } from '../../src/testUtils';
import CIReporter from '../../src/reporters/CIReporter';

describe('CIReporter', () => {
  let reporter: CIReporter;
  let outSpy: jest.Mock;
  let errSpy: jest.Mock;

  beforeEach(() => {
    const tool = mockTool();

    reporter = new CIReporter();
    reporter.console = mockConsole(tool);
    reporter.tool = tool;

    outSpy = reporter.console.out as jest.Mock;
    errSpy = reporter.console.err as jest.Mock;
  });

  describe('bootstrap()', () => {
    it('binds events', () => {
      const spy = jest.spyOn(reporter.console, 'on');

      reporter.bootstrap();

      expect(spy).toHaveBeenCalledWith('stop', expect.anything());
      expect(spy).toHaveBeenCalledWith('task', expect.anything());
      expect(spy).toHaveBeenCalledWith('routine', expect.anything());
      expect(spy).toHaveBeenCalledWith('routine.skip', expect.anything());
      expect(spy).toHaveBeenCalledWith('routine.pass', expect.anything());
      expect(spy).toHaveBeenCalledWith('routine.fail', expect.anything());
    });
  });

  describe('handleTask()', () => {
    it('increments count', () => {
      expect(reporter.taskCount).toBe(0);

      reporter.handleTask();

      expect(reporter.taskCount).toBe(1);
    });

    it('logs a period', () => {
      reporter.handleTask();

      expect(outSpy).toHaveBeenCalledWith(chalk.gray('.'));
    });
  });

  describe('handleRoutine()', () => {
    it('increments count', () => {
      expect(reporter.routineCount).toBe(0);

      reporter.handleRoutine();

      expect(reporter.routineCount).toBe(1);
    });

    it('logs a period', () => {
      reporter.handleRoutine();

      expect(outSpy).toHaveBeenCalledWith('.');
    });
  });

  describe('handleRoutineSkip()', () => {
    it('logs a period', () => {
      reporter.handleRoutineSkip();

      expect(outSpy).toHaveBeenCalledWith(chalk.yellow('.'));
    });
  });

  describe('handleRoutinePass()', () => {
    it('logs a period', () => {
      reporter.handleRoutinePass();

      expect(outSpy).toHaveBeenCalledWith(chalk.green('.'));
    });
  });

  describe('handleRoutineFail()', () => {
    it('logs a period', () => {
      reporter.handleRoutineFail();

      expect(errSpy).toHaveBeenCalledWith(chalk.red('.'));
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
