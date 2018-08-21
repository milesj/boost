import chalk from 'chalk';
import Reporter from '../src/Reporter';
import Task from '../src/Task';
import { STATUS_PASSED, STATUS_FAILED } from '../src/constants';
import { createTestConsole } from './helpers';

describe('Reporter', () => {
  let reporter: Reporter<any, any>;

  beforeEach(() => {
    reporter = new Reporter();
    reporter.console = createTestConsole();
  });

  describe('bootstrap()', () => {
    it('sets start and stop events', () => {
      const spy = jest.spyOn(reporter.console, 'on');

      reporter.bootstrap();

      expect(spy).toHaveBeenCalledWith('start', expect.anything());
      expect(spy).toHaveBeenCalledWith('stop', expect.anything());
    });
  });

  describe('addLine()', () => {
    it('adds a line to the list', () => {
      expect(reporter.lines).toEqual([]);

      reporter.addLine('foo');

      expect(reporter.lines).toEqual(['foo']);
    });
  });

  describe('displayError()', () => {
    it('writes to stderr', () => {
      reporter.displayError(new Error('Oops'));

      expect(reporter.console.write).toHaveBeenCalledTimes(3);
    });
  });

  describe('findLine()', () => {
    it('returns undefined if not found', () => {
      expect(reporter.findLine(line => line === 'foo')).toBeUndefined();
    });

    it('returns the line', () => {
      reporter.lines.push('foo');

      expect(reporter.findLine(line => line === 'foo')).toBe('foo');
    });
  });

  describe('getColorPalette()', () => {
    const oldLevel = chalk.level;
    const basePalette = {
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
      reporter.console.options.theme = 'default';

      expect(reporter.getColorPalette()).toEqual(basePalette);
    });

    it('returns base palette if theme does not exist', () => {
      chalk.level = 2;
      reporter.console.options.theme = 'unknown';

      expect(reporter.getColorPalette()).toEqual(basePalette);
    });

    it('returns theme palette', () => {
      chalk.level = 2;
      reporter.console.options.theme = 'solarized';

      expect(reporter.getColorPalette()).toEqual({
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
  });

  describe('removeLine()', () => {
    it('removes a line', () => {
      reporter.lines.push('foo', 'bar', 'baz');
      reporter.removeLine(line => line === 'foo');

      expect(reporter.lines).toEqual(['bar', 'baz']);
    });
  });

  describe('style()', () => {
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
