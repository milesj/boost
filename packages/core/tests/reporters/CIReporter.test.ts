import chalk from 'chalk';
import CIReporter from '../../src/reporters/CIReporter';
import { createTestConsole } from '../helpers';

describe('CIReporter', () => {
  let reporter: CIReporter;
  let outSpy: jest.Mock;
  let errSpy: jest.Mock;

  beforeEach(() => {
    reporter = new CIReporter();
    reporter.console = createTestConsole();

    outSpy = reporter.console.out as jest.Mock;
    errSpy = reporter.console.err as jest.Mock;
  });

  describe('bootstrap()', () => {
    it('binds events', () => {
      const spy = jest.spyOn(reporter.console, 'on');

      reporter.bootstrap();

      expect(spy).toHaveBeenCalledWith('stop', expect.anything());
      expect(spy).toHaveBeenCalledWith('task', expect.anything());
      expect(spy).toHaveBeenCalledWith('task.pass', expect.anything());
      expect(spy).toHaveBeenCalledWith('task.fail', expect.anything());
      expect(spy).toHaveBeenCalledWith('routine', expect.anything());
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
  });

  describe('handleTaskPass()', () => {
    it('logs a dash', () => {
      reporter.handleTaskPass();

      expect(outSpy).toHaveBeenCalledWith(chalk.green('-'));
    });
  });

  describe('handleTaskFail()', () => {
    it('logs a dash', () => {
      reporter.handleTaskFail();

      expect(errSpy).toHaveBeenCalledWith(chalk.red('-'));
    });
  });

  describe('handleRoutine()', () => {
    it('increments count', () => {
      expect(reporter.routineCount).toBe(0);

      reporter.handleRoutine();

      expect(reporter.routineCount).toBe(1);
    });

    it('logs a plus', () => {
      reporter.handleRoutine();

      expect(outSpy).toHaveBeenCalledWith('+');
    });
  });

  describe('handleRoutinePass()', () => {
    it('logs a plus', () => {
      reporter.handleRoutinePass();

      expect(outSpy).toHaveBeenCalledWith(chalk.green('+'));
    });
  });

  describe('handleRoutineFail()', () => {
    it('logs a plus', () => {
      reporter.handleRoutineFail();

      expect(errSpy).toHaveBeenCalledWith(chalk.red('+'));
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
