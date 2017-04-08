import chalk from 'chalk';
import Renderer from '../src/Renderer';
import TaskResult from '../src/TaskResult';
import { PENDING, RUNNING, SKIPPED, PASSED, FAILED } from '../src/constants';

jest.mock('log-update', () => {
  const logUpdate = jest.fn();
  logUpdate.clear = jest.fn();
  logUpdate.done = jest.fn();

  return logUpdate;
});

describe('Renderer', () => {
  let renderer;

  beforeEach(() => {
    renderer = new Renderer(() => ([]));

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('indent()', () => {
    it('indents with spaces', () => {
      expect(renderer.indent(0)).toBe('');
      expect(renderer.indent(1)).toBe('    ');
      expect(renderer.indent(3)).toBe('            ');
    });
  });

  describe('render()', () => {
    it('renders a results tree in a single output', () => {
      const git = new TaskResult('Git', RUNNING);
      git.tasks = [
        new TaskResult('Checking current branch', PASSED),
        new TaskResult('Checking for local changes', PASSED),
        new TaskResult('Checking for remote changes', RUNNING),
      ];

      const statusChecks = new TaskResult('Status checks', PASSED);
      statusChecks.tasks = [
        new TaskResult('Checking for vulnerable dependencies', PENDING),
      ];
      statusChecks.routines = [git];

      renderer.load = () => ([
        statusChecks,
      ]);

      expect(renderer.render()).toBe(`${chalk.green('✔')} Status checks
    ${chalk.gray('⠙')} Git
        ${chalk.gray('⠙')} Checking for remote changes ${chalk.gray('[2/3]')}`);
    });
  });

  describe('renderResult()', () => {
    it('creates a PENDING message', () => {
      expect(renderer.renderResult(new TaskResult('Title', PENDING))).toEqual([
        `${chalk.gray('●')} Title`,
      ]);
    });

    it('creates a RUNNING message', () => {
      expect(renderer.renderResult(new TaskResult('Title', RUNNING))).toEqual([
        `${chalk.gray('⠙')} Title`,
      ]);
    });

    it('creates a SKIPPED message', () => {
      expect(renderer.renderResult(new TaskResult('Title', SKIPPED))).toEqual([
        `${chalk.yellow('◌')} Title ${chalk.yellow('[skipped]')}`,
      ]);
    });

    it('creates a PASSED message', () => {
      expect(renderer.renderResult(new TaskResult('Title', PASSED))).toEqual([
        `${chalk.green('✔')} Title`,
      ]);
    });

    it('creates a FAILED message', () => {
      expect(renderer.renderResult(new TaskResult('Title', FAILED))).toEqual([
        `${chalk.red('✖')} Title ${chalk.red('[failed]')}`,
      ]);
    });

    it('indents the message', () => {
      expect(renderer.renderResult(new TaskResult('Title', ''), 2)).toEqual([
        '         Title',
      ]);
    });

    describe('with tasks', () => {
      it('displays PENDING tasks', () => {
        const result = new TaskResult('Title', RUNNING);
        result.tasks = [
          new TaskResult('Sub-task #1', PENDING),
          new TaskResult('Sub-task #2', PENDING),
          new TaskResult('Sub-task #3', PENDING),
        ];

        expect(renderer.renderResult(result)).toEqual([
          `${chalk.gray('⠙')} Title`,
          `    ${chalk.gray('●')} Sub-task #1 ${chalk.gray('[0/3]')}`,
        ]);
      });

      it('displays RUNNING tasks over PENDING tasks', () => {
        const result = new TaskResult('Title', RUNNING);
        result.tasks = [
          new TaskResult('Sub-task #1', PENDING),
          new TaskResult('Sub-task #2', PENDING),
          new TaskResult('Sub-task #3', RUNNING),
        ];

        expect(renderer.renderResult(result)).toEqual([
          `${chalk.gray('⠙')} Title`,
          `    ${chalk.gray('⠙')} Sub-task #3 ${chalk.gray('[0/3]')}`,
        ]);
      });

      it('displays FAILED tasks over all others', () => {
        const result = new TaskResult('Title', RUNNING);
        result.tasks = [
          new TaskResult('Sub-task #1', PASSED),
          new TaskResult('Sub-task #2', FAILED),
          new TaskResult('Sub-task #3', RUNNING),
          new TaskResult('Sub-task #4', FAILED),
          new TaskResult('Sub-task #5', PENDING),
          new TaskResult('Sub-task #6', SKIPPED),
        ];

        expect(renderer.renderResult(result)).toEqual([
          `${chalk.gray('⠙')} Title`,
          `    ${chalk.red('✖')} Sub-task #2 ${chalk.red('[failed]')}`,
        ]);
      });

      it('does not display SKIPPED or PASSED tasks', () => {
        const result = new TaskResult('Title', RUNNING);
        result.tasks = [
          new TaskResult('Sub-task #1', PASSED),
          new TaskResult('Sub-task #2', SKIPPED),
          new TaskResult('Sub-task #3', SKIPPED),
        ];

        expect(renderer.renderResult(result)).toEqual([
          `${chalk.gray('⠙')} Title`,
        ]);
      });

      it('does not display tasks if parent isnt RUNNING', () => {
        const result = new TaskResult('Title', PASSED);
        result.tasks = [
          new TaskResult('Sub-task #1', PENDING),
          new TaskResult('Sub-task #2', RUNNING),
          new TaskResult('Sub-task #3', PASSED),
        ];

        expect(renderer.renderResult(result)).toEqual([
          `${chalk.green('✔')} Title`,
        ]);
      });

      it('increases count for PASSED tasks', () => {
        const result = new TaskResult('Title', RUNNING);
        result.tasks = [
          new TaskResult('Sub-task #1', PASSED),
          new TaskResult('Sub-task #2', PENDING),
          new TaskResult('Sub-task #3', PASSED),
        ];

        expect(renderer.renderResult(result)).toEqual([
          `${chalk.gray('⠙')} Title`,
          `    ${chalk.gray('●')} Sub-task #2 ${chalk.gray('[2/3]')}`,
        ]);
      });
    });

    describe('with routines', () => {
      it('displays all sub-routines', () => {
        const result = new TaskResult('Title', RUNNING);
        result.routines = [
          new TaskResult('Sub-routine #1', PENDING),
          new TaskResult('Sub-routine #2', PENDING),
          new TaskResult('Sub-routine #3', PENDING),
        ];

        expect(renderer.renderResult(result)).toEqual([
          `${chalk.gray('⠙')} Title`,
          `    ${chalk.gray('●')} Sub-routine #1`,
          `    ${chalk.gray('●')} Sub-routine #2`,
          `    ${chalk.gray('●')} Sub-routine #3`,
        ]);
      });

      it('displays different statuses', () => {
        const result = new TaskResult('Title', RUNNING);
        result.routines = [
          new TaskResult('Sub-routine #1', RUNNING),
          new TaskResult('Sub-routine #2', FAILED),
          new TaskResult('Sub-routine #3', PASSED),
        ];

        expect(renderer.renderResult(result)).toEqual([
          `${chalk.gray('⠙')} Title`,
          `    ${chalk.gray('⠙')} Sub-routine #1`,
          `    ${chalk.red('✖')} Sub-routine #2 ${chalk.red('[failed]')}`,
          `    ${chalk.green('✔')} Sub-routine #3`,
        ]);
      });

      it('displays tasks above sub-routines', () => {
        const result = new TaskResult('Title', RUNNING);
        result.tasks = [
          new TaskResult('Sub-task #1', PENDING),
          new TaskResult('Sub-task #2', PENDING),
          new TaskResult('Sub-task #3', RUNNING),
        ];
        result.routines = [
          new TaskResult('Sub-routine #1', RUNNING),
          new TaskResult('Sub-routine #2', SKIPPED),
          new TaskResult('Sub-routine #3', PASSED),
        ];

        expect(renderer.renderResult(result)).toEqual([
          `${chalk.gray('⠙')} Title`,
          `    ${chalk.gray('⠙')} Sub-task #3 ${chalk.gray('[0/3]')}`,
          `    ${chalk.gray('⠙')} Sub-routine #1`,
          `    ${chalk.yellow('◌')} Sub-routine #2 ${chalk.yellow('[skipped]')}`,
          `    ${chalk.green('✔')} Sub-routine #3`,
        ]);
      });
    });
  });

  describe('renderStatus()', () => {
    it('renders a bullet for PENDING', () => {
      expect(renderer.renderStatus(new TaskResult('', PENDING))).toBe(chalk.gray('●'));
    });

    it('renders a spinner for RUNNING', () => {
      expect(renderer.renderStatus(new TaskResult('', RUNNING))).toBe(chalk.gray('⠙'));
    });

    it('renders a dotted circle for SKIPPED', () => {
      expect(renderer.renderStatus(new TaskResult('', SKIPPED))).toBe(chalk.yellow('◌'));
    });

    it('renders a tick for PASSED', () => {
      expect(renderer.renderStatus(new TaskResult('', PASSED))).toBe(chalk.green('✔'));
    });

    it('renders a cross for FAILED', () => {
      expect(renderer.renderStatus(new TaskResult('', FAILED))).toBe(chalk.red('✖'));
    });
  });

  describe('reset()', () => {
    it('clears the output', () => {
      renderer.reset();

      expect(renderer.log.clear).toBeCalled();
    });
  });

  describe('start()', () => {
    it('triggers a render', () => {
      const spy = jest.spyOn(renderer, 'render');

      renderer.start();
      jest.runTimersToTime(100);

      expect(spy).toBeCalled();
      expect(renderer.log).toBeCalledWith('');
    });

    it('only triggers one render at a time', () => {
      const spy = jest.spyOn(renderer, 'render');

      renderer.start();
      renderer.start();
      renderer.start();
      jest.runTimersToTime(100);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('stop()', () => {
    beforeEach(() => {
      renderer.start();
    });

    it('triggers a render', () => {
      const spy = jest.spyOn(renderer, 'render');

      renderer.stop();

      expect(spy).toBeCalled();
      expect(renderer.log).toBeCalledWith('');
    });

    it('closes the stream', () => {
      renderer.stop();

      expect(renderer.log.done).toBeCalled();
    });
  });

  describe('update()', () => {
    it('triggers a start of interval not set', () => {
      const spy = jest.spyOn(renderer, 'start');

      renderer.update();

      expect(spy).toBeCalled();
      expect(renderer.log).not.toBeCalled();
    });

    it('triggers a render if interval is running', () => {
      renderer.start();

      const spy = jest.spyOn(renderer, 'start');

      renderer.update();

      expect(spy).not.toBeCalled();
      expect(renderer.log).toBeCalled();
    });
  });
});
