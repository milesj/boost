import chalk from 'chalk';
import Renderer from '../src/Renderer';
import { createTaskWithStatus } from './helpers';
import { PENDING, RUNNING, SKIPPED, PASSED, FAILED } from '../src/constants';

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
      const git = createTaskWithStatus('Git', RUNNING);
      git.subtasks = [
        createTaskWithStatus('Checking current branch', PASSED),
        createTaskWithStatus('Checking for local changes', PASSED),
        createTaskWithStatus('Checking for remote changes', RUNNING),
      ];

      const statusChecks = createTaskWithStatus('Status checks', PASSED);
      statusChecks.subtasks = [
        createTaskWithStatus('Checking for vulnerable dependencies', PENDING),
      ];
      statusChecks.subroutines = [git];

      renderer.loadTasks = () => ([statusChecks]);

      expect(renderer.render()).toBe(`${chalk.green('✔')} Status checks
    ${chalk.gray('⠙')} Git
        ${chalk.gray('⠙')} Checking for remote changes ${chalk.gray('[2/3]')}`);
    });
  });

  describe('renderTask()', () => {
    it('creates a PENDING message', () => {
      expect(renderer.renderTask(createTaskWithStatus('Title', PENDING))).toEqual([
        `${chalk.gray('●')} Title`,
      ]);
    });

    it('creates a RUNNING message', () => {
      expect(renderer.renderTask(createTaskWithStatus('Title', RUNNING))).toEqual([
        `${chalk.gray('⠙')} Title`,
      ]);
    });

    it('creates a SKIPPED message', () => {
      expect(renderer.renderTask(createTaskWithStatus('Title', SKIPPED))).toEqual([
        `${chalk.yellow('◌')} Title ${chalk.yellow('[skipped]')}`,
      ]);
    });

    it('creates a PASSED message', () => {
      expect(renderer.renderTask(createTaskWithStatus('Title', PASSED))).toEqual([
        `${chalk.green('✔')} Title`,
      ]);
    });

    it('creates a FAILED message', () => {
      expect(renderer.renderTask(createTaskWithStatus('Title', FAILED))).toEqual([
        `${chalk.red('✖')} Title ${chalk.red('[failed]')}`,
      ]);
    });

    it('indents the message', () => {
      expect(renderer.renderTask(createTaskWithStatus('Title', ''), 2)).toEqual([
        '         Title',
      ]);
    });

    describe('with tasks', () => {
      it('displays PENDING tasks', () => {
        const result = createTaskWithStatus('Title', RUNNING);
        result.subtasks = [
          createTaskWithStatus('Sub-task #1', PENDING),
          createTaskWithStatus('Sub-task #2', PENDING),
          createTaskWithStatus('Sub-task #3', PENDING),
        ];

        expect(renderer.renderTask(result)).toEqual([
          `${chalk.gray('⠙')} Title`,
          `    ${chalk.gray('●')} Sub-task #1 ${chalk.gray('[0/3]')}`,
        ]);
      });

      it('displays RUNNING tasks over PENDING tasks', () => {
        const result = createTaskWithStatus('Title', RUNNING);
        result.subtasks = [
          createTaskWithStatus('Sub-task #1', PENDING),
          createTaskWithStatus('Sub-task #2', PENDING),
          createTaskWithStatus('Sub-task #3', RUNNING),
        ];

        expect(renderer.renderTask(result)).toEqual([
          `${chalk.gray('⠙')} Title`,
          `    ${chalk.gray('⠙')} Sub-task #3 ${chalk.gray('[0/3]')}`,
        ]);
      });

      it('displays FAILED tasks over all others', () => {
        const result = createTaskWithStatus('Title', RUNNING);
        result.subtasks = [
          createTaskWithStatus('Sub-task #1', PASSED),
          createTaskWithStatus('Sub-task #2', FAILED),
          createTaskWithStatus('Sub-task #3', RUNNING),
          createTaskWithStatus('Sub-task #4', FAILED),
          createTaskWithStatus('Sub-task #5', PENDING),
          createTaskWithStatus('Sub-task #6', SKIPPED),
        ];

        expect(renderer.renderTask(result)).toEqual([
          `${chalk.gray('⠙')} Title`,
          `    ${chalk.red('✖')} Sub-task #2 ${chalk.red('[failed]')}`,
        ]);
      });

      it('does not display SKIPPED or PASSED tasks', () => {
        const result = createTaskWithStatus('Title', RUNNING);
        result.subtasks = [
          createTaskWithStatus('Sub-task #1', PASSED),
          createTaskWithStatus('Sub-task #2', SKIPPED),
          createTaskWithStatus('Sub-task #3', SKIPPED),
        ];

        expect(renderer.renderTask(result)).toEqual([
          `${chalk.gray('⠙')} Title`,
        ]);
      });

      it('does not display tasks if parent isnt RUNNING', () => {
        const result = createTaskWithStatus('Title', PASSED);
        result.subtasks = [
          createTaskWithStatus('Sub-task #1', PENDING),
          createTaskWithStatus('Sub-task #2', RUNNING),
          createTaskWithStatus('Sub-task #3', PASSED),
        ];

        expect(renderer.renderTask(result)).toEqual([
          `${chalk.green('✔')} Title`,
        ]);
      });

      it('increases count for PASSED tasks', () => {
        const result = createTaskWithStatus('Title', RUNNING);
        result.subtasks = [
          createTaskWithStatus('Sub-task #1', PASSED),
          createTaskWithStatus('Sub-task #2', PENDING),
          createTaskWithStatus('Sub-task #3', PASSED),
        ];

        expect(renderer.renderTask(result)).toEqual([
          `${chalk.gray('⠙')} Title`,
          `    ${chalk.gray('●')} Sub-task #2 ${chalk.gray('[2/3]')}`,
        ]);
      });
    });

    describe('with subroutines', () => {
      it('displays all sub-routines', () => {
        const result = createTaskWithStatus('Title', RUNNING);
        result.subroutines = [
          createTaskWithStatus('Sub-routine #1', PENDING),
          createTaskWithStatus('Sub-routine #2', PENDING),
          createTaskWithStatus('Sub-routine #3', PENDING),
        ];

        expect(renderer.renderTask(result)).toEqual([
          `${chalk.gray('⠙')} Title`,
          `    ${chalk.gray('●')} Sub-routine #1`,
          `    ${chalk.gray('●')} Sub-routine #2`,
          `    ${chalk.gray('●')} Sub-routine #3`,
        ]);
      });

      it('displays different statuses', () => {
        const result = createTaskWithStatus('Title', RUNNING);
        result.subroutines = [
          createTaskWithStatus('Sub-routine #1', RUNNING),
          createTaskWithStatus('Sub-routine #2', FAILED),
          createTaskWithStatus('Sub-routine #3', PASSED),
        ];

        expect(renderer.renderTask(result)).toEqual([
          `${chalk.gray('⠙')} Title`,
          `    ${chalk.gray('⠙')} Sub-routine #1`,
          `    ${chalk.red('✖')} Sub-routine #2 ${chalk.red('[failed]')}`,
          `    ${chalk.green('✔')} Sub-routine #3`,
        ]);
      });

      it('displays tasks above sub-routines', () => {
        const result = createTaskWithStatus('Title', RUNNING);
        result.subtasks = [
          createTaskWithStatus('Sub-task #1', PENDING),
          createTaskWithStatus('Sub-task #2', PENDING),
          createTaskWithStatus('Sub-task #3', RUNNING),
        ];
        result.subroutines = [
          createTaskWithStatus('Sub-routine #1', RUNNING),
          createTaskWithStatus('Sub-routine #2', SKIPPED),
          createTaskWithStatus('Sub-routine #3', PASSED),
        ];

        expect(renderer.renderTask(result)).toEqual([
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
      expect(renderer.renderStatus(createTaskWithStatus('title', PENDING))).toBe(chalk.gray('●'));
    });

    it('renders a spinner for RUNNING', () => {
      expect(renderer.renderStatus(createTaskWithStatus('title', RUNNING))).toBe(chalk.gray('⠙'));
    });

    it('renders a dotted circle for SKIPPED', () => {
      expect(renderer.renderStatus(createTaskWithStatus('title', SKIPPED))).toBe(chalk.yellow('◌'));
    });

    it('renders a tick for PASSED', () => {
      expect(renderer.renderStatus(createTaskWithStatus('title', PASSED))).toBe(chalk.green('✔'));
    });

    it('renders a cross for FAILED', () => {
      expect(renderer.renderStatus(createTaskWithStatus('title', FAILED))).toBe(chalk.red('✖'));
    });
  });
});
