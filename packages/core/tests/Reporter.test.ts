import chalk from 'chalk';
import ansiEscapes from 'ansi-escapes';
import { mockConsole, mockTool, mockRoutine } from '@boost/test-utils';
import Reporter, { testOnlyResetRestoreCursor } from '../src/Reporter';
import ProgressOutput from '../src/outputs/ProgressOutput';
import Output from '../src/Output';
import Task from '../src/Task';
import Tool from '../src/Tool';
import { STATUS_PASSED, STATUS_FAILED } from '../src/constants';

describe('Reporter', () => {
  let reporter: Reporter<any>;
  let tool: Tool<any, any>;

  beforeEach(() => {
    tool = mockTool();

    reporter = new Reporter();
    reporter.console = mockConsole(tool);
    reporter.tool = tool;

    testOnlyResetRestoreCursor();
  });

  describe('bootstrap()', () => {
    it('sets start and stop events', () => {
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
      const task1 = mockRoutine(tool, 'one');
      const task2 = mockRoutine(tool, 'two');
      const task3 = mockRoutine(tool, 'three').skip();

      task2.status = STATUS_PASSED;

      expect(reporter.calculateTaskCompletion([task1, task2, task3])).toBe(2);
    });
  });

  describe('createConcurrentOutput()', () => {
    it('returns an `Output` instance marked as concurrent', () => {
      const output = reporter.createConcurrentOutput(() => 'foo');

      expect(output).toBeInstanceOf(Output);
      expect(output.isConcurrent()).toBe(true);
    });
  });

  describe('createOutput()', () => {
    it('returns an `Output` instance', () => {
      expect(reporter.createOutput(() => 'foo')).toBeInstanceOf(Output);
    });
  });

  describe('createProgressOutput()', () => {
    it('returns a `ProgressOutput` instance', () => {
      const output = reporter.createProgressOutput(() => ({
        current: 0,
        total: 100,
      }));

      expect(output).toBeInstanceOf(ProgressOutput);
    });
  });

  describe('displayError()', () => {
    it('writes to stderr', () => {
      const error = new Error('Oops');

      reporter.displayError(error);

      expect(reporter.console.err).toHaveBeenCalledWith(`\n${chalk.red.bold('Oops')}\n`);
      expect(reporter.console.err).toHaveBeenCalledWith(
        chalk.gray(error.stack!.replace('Error: Oops\n', '')),
        1,
      );
    });

    it('handles multiline messages', () => {
      const error = new Error('Oops\nBroken');

      reporter.displayError(error);

      expect(reporter.console.err).toHaveBeenCalledWith(`\n${chalk.red.bold('Oops\nBroken')}\n`);
      expect(reporter.console.err).toHaveBeenCalledWith(
        chalk.gray(error.stack!.replace('Error: Oops\nBroken\n', '')),
        1,
      );
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
      const task = new Task('task', () => {}).skip();

      expect(reporter.getColorType(task)).toBe('warning');
    });

    it('returns green for passed', () => {
      const task = new Task('task', () => {});

      task.status = STATUS_PASSED;

      expect(reporter.getColorType(task)).toBe('success');
    });

    it('returns red for failed', () => {
      const task = new Task('task', () => {});

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
      expect(reporter.getElapsedTime(1000, 5000)).toBe('4.0s');
    });

    it('colors red if higher than slow threshold', () => {
      expect(reporter.getElapsedTime(1000, 15000)).toBe(chalk.red('14.0s'));
    });

    it('doesnt color if highlight is false', () => {
      expect(reporter.getElapsedTime(1000, 15000, false)).toBe('14.0s');
    });
  });

  describe('getOutputLevel()', () => {
    it('returns value from config', () => {
      expect(reporter.getOutputLevel()).toBe(2);

      reporter.tool.config.output = 1;

      expect(reporter.getOutputLevel()).toBe(1);
    });
  });

  describe('getRootParent()', () => {
    it('returns the root parent of a routine tree', () => {
      const a = mockRoutine(tool);
      const b = mockRoutine(tool);
      const c = mockRoutine(tool);

      a.pipe(b.pipe(c));

      expect(reporter.getRootParent(c)).toBe(a);
      expect(reporter.getRootParent(b)).toBe(a);
      expect(reporter.getRootParent(a)).toBe(a);
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

  describe('hasColorSupport()', () => {
    const oldSupportLevel = chalk.supportsColor.level;

    afterEach(() => {
      chalk.supportsColor.level = oldSupportLevel;
    });

    it('returns false if support is below the requested level', () => {
      chalk.supportsColor.level = 2;

      expect(reporter.hasColorSupport(3)).toBe(false);
    });

    it('returns true if support is equal or above the requested level', () => {
      // @ts-ignore
      chalk.supportsColor.level = 2;

      expect(reporter.hasColorSupport(1)).toBe(true);
      expect(reporter.hasColorSupport(2)).toBe(true);
    });
  });

  describe('hideCursor()', () => {
    it('writes ansi escape code', () => {
      reporter.hideCursor();

      expect(reporter.console.out).toHaveBeenCalledWith(ansiEscapes.cursorHide);
    });

    it('sets restore listener', () => {
      const spy = jest.spyOn(process, 'on');

      reporter.hideCursor();

      expect(spy).toHaveBeenCalled();

      spy.mockRestore();
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

  describe('isSilent()', () => {
    it('returns value from config', () => {
      expect(reporter.isSilent()).toBe(false);

      reporter.tool.config.silent = true;

      expect(reporter.isSilent()).toBe(true);
    });
  });

  describe('resetCursor()', () => {
    it('writes ansi escape code', () => {
      reporter.resetCursor();

      expect(reporter.console.out).toHaveBeenCalledWith(
        ansiEscapes.cursorTo(0, reporter.size().rows),
      );
    });
  });

  describe('showCursor()', () => {
    it('writes ansi escape code', () => {
      reporter.showCursor();

      expect(reporter.console.out).toHaveBeenCalledWith(ansiEscapes.cursorShow);
    });
  });

  describe('size()', () => {
    it('returns columns and rows', () => {
      const size = reporter.size();

      expect(size.columns).toBeDefined();
      expect(size.rows).toBeDefined();
    });
  });

  describe('sortTasksByStartTime()', () => {
    it('sorts by start time', () => {
      const foo = mockRoutine(tool);
      const bar = mockRoutine(tool);
      const baz = mockRoutine(tool);

      foo.metadata.startTime = 100;
      bar.metadata.startTime = 150;
      baz.metadata.startTime = 50;

      const list = [foo, bar, baz];

      expect(reporter.sortTasksByStartTime(list)).toEqual([baz, foo, bar]);
      expect(list).toEqual([foo, bar, baz]);
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

  describe('strip()', () => {
    it('stips ANSI escape codes', () => {
      expect(reporter.strip(chalk.red('foo'))).toBe('foo');
    });
  });

  describe('truncate()', () => {
    it('truncates with ANSI escape codes', () => {
      expect(reporter.truncate(chalk.red('foobar'), 3)).not.toBe(chalk.red('foobar'));
    });
  });

  describe('wrap()', () => {
    it('wraps with ANSI escape codes', () => {
      expect(reporter.wrap(chalk.red('foobar'), 3)).toBe(chalk.red('foo\nbar'));
    });
  });
});
