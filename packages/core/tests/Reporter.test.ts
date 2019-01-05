import chalk from 'chalk';
import Reporter from '../src/Reporter';
import Task from '../src/Task';
import { STATUS_PASSED, STATUS_FAILED } from '../src/constants';
import { createTestConsole, createTestTool, createTestRoutine } from './helpers';

describe('Reporter', () => {
  let reporter: Reporter<any>;

  beforeEach(() => {
    reporter = new Reporter();
    // @ts-ignore Allow protected access
    reporter.console = createTestConsole();
    reporter.tool = createTestTool();
  });

  describe('bootstrap()', () => {
    it('sets start and stop events', () => {
      // @ts-ignore Allow protected access
      const spy = jest.spyOn(reporter.console, 'on');

      reporter.bootstrap();

      expect(spy).toHaveBeenCalledWith('start', expect.anything());
      expect(spy).toHaveBeenCalledWith('stop', expect.anything());
    });
  });

  describe('calculateTaskCompletion()', () => {
    it('returns a total', () => {
      const task1 = new Task('one', () => {});
      const task2 = new Task('two', () => {});
      const task3 = new Task('three', () => {});

      task2.status = STATUS_PASSED;

      expect(reporter.calculateTaskCompletion([task1, task2, task3])).toBe(1);

      task1.status = STATUS_PASSED;

      expect(reporter.calculateTaskCompletion([task1, task2, task3])).toBe(2);
    });

    it('includes skipped', () => {
      const task1 = new Task('one', () => {});
      const task2 = new Task('two', () => {});
      const task3 = new Task('three', () => {}).skip();

      task2.status = STATUS_PASSED;

      expect(reporter.calculateTaskCompletion([task1, task2, task3])).toBe(2);
    });

    it('supports routines', () => {
      const task1 = createTestRoutine(null, 'one');
      const task2 = createTestRoutine(null, 'two');
      const task3 = createTestRoutine(null, 'three').skip();

      task2.status = STATUS_PASSED;

      expect(reporter.calculateTaskCompletion([task1, task2, task3])).toBe(2);
    });
  });

  describe('displayError()', () => {
    it('writes to stderr', () => {
      reporter.displayError(new Error('Oops'));

      // @ts-ignore Allow protected access
      expect(reporter.console.err).toHaveBeenCalledTimes(3);
    });
  });

  describe('getColorPalette()', () => {
    const oldLevel = chalk.level;
    const basePalette = {
      default: 'white',
      failure: 'red',
      pending: 'gray',
      success: 'green',
      warning: 'yellow',
    };

    afterEach(() => {
      chalk.level = oldLevel;
    });

    it('returns base palette if chalk level < 2', () => {
      chalk.level = 1;

      expect(reporter.getColorPalette()).toEqual(basePalette);
    });

    it('returns base palette if chalk level >= 2 and theme is default', () => {
      chalk.level = 2;
      reporter.tool.config.theme = 'default';

      expect(reporter.getColorPalette()).toEqual(basePalette);
    });

    it('errors if theme does not exist', () => {
      chalk.level = 2;
      reporter.tool.config.theme = 'custom';

      expect(() => reporter.getColorPalette()).toThrowErrorMatchingSnapshot();
    });

    it('returns theme palette', () => {
      chalk.level = 2;
      reporter.tool.config.theme = 'solarized';

      expect(reporter.getColorPalette()).toEqual({
        default: '#eee8d5',
        failure: '#dc322f',
        pending: '#93a1a1',
        success: '#859900',
        warning: '#b58900',
      });
    });
  });

  describe('getColorType()', () => {
    it('returns yellow for skipped', () => {
      const task = new Task('task').skip();

      expect(reporter.getColorType(task)).toBe('warning');
    });

    it('returns green for passed', () => {
      const task = new Task('task');

      task.status = STATUS_PASSED;

      expect(reporter.getColorType(task)).toBe('success');
    });

    it('returns red for failed', () => {
      const task = new Task('task');

      task.status = STATUS_FAILED;

      expect(reporter.getColorType(task)).toBe('failure');
    });

    it('returns gray otherwise', () => {
      const task = new Task('task', () => {});

      expect(reporter.getColorType(task)).toBe('pending');
    });
  });

  describe('getElapsedTime()', () => {
    it('returns numbers in seconds', () => {
      expect(reporter.getElapsedTime(1000, 5000)).toBe('4.00s');
    });

    it('colors red if higher than slow threshold', () => {
      expect(reporter.getElapsedTime(1000, 15000)).toBe(chalk.red('14.00s'));
    });

    it('doesnt color if highlight is false', () => {
      expect(reporter.getElapsedTime(1000, 15000, false)).toBe('14.00s');
    });
  });

  describe('handleBaseStart()', () => {
    const oldCI = process.env.CI;

    beforeEach(() => {
      process.env.CI = '';
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
      process.env.CI = oldCI;
    });

    it('sets start time', () => {
      reporter.handleBaseStart();

      expect(reporter.startTime).not.toBe(0);
    });
  });

  describe('handleBaseStop()', () => {
    it('sets stop time', () => {
      reporter.handleBaseStop();

      expect(reporter.stopTime).not.toBe(0);
    });
  });

  describe('indent()', () => {
    it('indents based on length', () => {
      expect(reporter.indent()).toBe('');
      expect(reporter.indent(1)).toBe(' ');
      expect(reporter.indent(3)).toBe('   ');
    });

    it('handles negative numbers and 0', () => {
      expect(reporter.indent(0)).toBe('');
      expect(reporter.indent(-1)).toBe('');
      expect(reporter.indent(-3)).toBe('');
    });
  });

  describe('isCompactOutput()', () => {
    it('returns true if output is 1', () => {
      expect(reporter.isCompactOutput()).toBe(false);

      reporter.tool.config.output = 1;

      expect(reporter.isCompactOutput()).toBe(true);
    });
  });

  describe('isNormalOutput()', () => {
    it('returns true if output is 2', () => {
      // Default is 2
      reporter.tool.config.output = 1;

      expect(reporter.isNormalOutput()).toBe(false);

      reporter.tool.config.output = 2;

      expect(reporter.isNormalOutput()).toBe(true);
    });
  });

  describe('isVerboseOutput()', () => {
    it('returns true if output is 3', () => {
      expect(reporter.isVerboseOutput()).toBe(false);

      reporter.tool.config.output = 3;

      expect(reporter.isVerboseOutput()).toBe(true);
    });
  });

  describe('isSilent()', () => {
    it('returns value from config', () => {
      expect(reporter.isSilent()).toBe(false);

      reporter.tool.config.silent = true;

      expect(reporter.isSilent()).toBe(true);
    });
  });

  describe('style()', () => {
    it('colors default', () => {
      expect(reporter.style('foo')).toBe(chalk.white('foo'));
    });

    it('colors pending', () => {
      expect(reporter.style('foo', 'pending')).toBe(chalk.gray('foo'));
    });

    it('colors failure', () => {
      expect(reporter.style('foo', 'failure')).toBe(chalk.red('foo'));
    });

    it('colors success', () => {
      expect(reporter.style('foo', 'success')).toBe(chalk.green('foo'));
    });

    it('colors warning', () => {
      expect(reporter.style('foo', 'warning')).toBe(chalk.yellow('foo'));
    });

    it('can apply modifiers', () => {
      expect(reporter.style('foo', 'pending', ['bold', 'dim', 'italic'])).toBe(
        chalk.gray.bold.dim.italic('foo'),
      );
    });
  });
});
