import chalk from 'chalk';
import CIReporter from '../../src/reporters/CIReporter';
import { createTestRoutine, createTestConsole } from '../helpers';
import Task from '../../src/Task';

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

  const task = new Task('Hello', () => {});
  const routine = createTestRoutine();

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
    it('displays the title', () => {
      reporter.handleTask(task);

      expect(outSpy).toHaveBeenCalledWith('[0] Running task: Hello\n');
    });
  });

  describe('handleTaskPass()', () => {
    it('displays the title', () => {
      reporter.handleTaskPass(task);

      expect(outSpy).toHaveBeenCalledWith(chalk.green('[0] Passed\n'));
    });
  });

  describe('handleTaskFail()', () => {
    it('displays the title', () => {
      reporter.handleTaskFail(task, new Error('Oops'));

      expect(errSpy).toHaveBeenCalledWith(chalk.red('[0] Failed: Oops\n'));
    });
  });

  describe('handleRoutine()', () => {
    it('displays the title', () => {
      reporter.handleRoutine(routine);

      expect(outSpy).toHaveBeenCalledWith('[key] Running routine: Title\n');
    });
  });

  describe('handleRoutinePass()', () => {
    it('displays the title', () => {
      reporter.handleRoutinePass(routine);

      expect(outSpy).toHaveBeenCalledWith(chalk.green('[key] Passed\n'));
    });
  });

  describe('handleRoutineFail()', () => {
    it('displays the title', () => {
      reporter.handleRoutineFail(routine, new Error('Oops'));

      expect(errSpy).toHaveBeenCalledWith(chalk.red('[key] Failed: Oops\n'));
    });
  });

  describe('handleStop()', () => {
    it('displays the time', () => {
      reporter.handleStop();

      expect(outSpy).toHaveBeenCalledWith(expect.stringContaining('Ran in'));
    });
  });
});
