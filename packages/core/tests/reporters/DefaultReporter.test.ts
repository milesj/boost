import chalk from 'chalk';
import DefaultReporter from '../../src/reporters/DefaultReporter';
import Routine from '../../src/Routine';
import Task from '../../src/Task';
import { STATUS_PASSED, STATUS_FAILED } from '../../src/constants';
import { createTestRoutine, createTestConsole, createTestTool } from '../helpers';

const oldNow = Date.now;

describe('DefaultReporter', () => {
  let reporter: DefaultReporter;
  let renderSpy: jest.SpyInstance;

  beforeEach(() => {
    reporter = new DefaultReporter();
    reporter.console = createTestConsole();
    reporter.tool = createTestTool();

    renderSpy = jest.spyOn(reporter.console, 'render');

    Date.now = () => 0;
  });

  afterEach(() => {
    Date.now = oldNow;
  });

  describe('bootstrap()', () => {
    it('binds events', () => {
      const spy = jest.spyOn(reporter.console, 'on');

      reporter.bootstrap();

      expect(spy).toHaveBeenCalledWith('start', expect.anything());
      expect(spy).toHaveBeenCalledWith('task', expect.anything());
      expect(spy).toHaveBeenCalledWith('task.pass', expect.anything());
      expect(spy).toHaveBeenCalledWith('task.fail', expect.anything());
      expect(spy).toHaveBeenCalledWith('routine', expect.anything());
      expect(spy).toHaveBeenCalledWith('routine.pass', expect.anything());
      expect(spy).toHaveBeenCalledWith('routine.fail', expect.anything());
      expect(spy).toHaveBeenCalledWith('command.data', expect.anything());
    });
  });

  describe('calculateKeyLength()', () => {
    it('returns longest length', () => {
      const length = reporter.calculateKeyLength([
        createTestRoutine(null, 'foo'),
        createTestRoutine(null, 'barbar'),
        createTestRoutine(null, 'bazs'),
      ]);

      expect(length).toBe(6);
    });

    it('checks all depths', () => {
      const routine = createTestRoutine(null, 'barbar');
      routine.routines.push(createTestRoutine(null, 'superlongkey'));

      const length = reporter.calculateKeyLength([
        createTestRoutine(null, 'foo'),
        routine,
        createTestRoutine(null),
      ]);

      expect(length).toBe(13);
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

  describe('getLineTitle()', () => {
    describe('task', () => {
      it('returns title', () => {
        const task = new Task('This is a task', () => {});

        expect(reporter.getLineTitle(task)).toBe('This is a task');
      });

      it('returns status text', () => {
        const task = new Task('This is a task', () => {});
        task.statusText = 'Running things…';

        expect(reporter.getLineTitle(task)).toBe(chalk.gray('Running things…'));
      });

      it('truncates title', () => {
        const oldColumns = process.stdout.columns;
        const task = new Task(
          'This is a really really really long task, with a really dumb and stupidly long title',
          () => {},
        );

        process.stdout.columns = 80;

        expect(reporter.getLineTitle(task, 10)).toBe(
          'This is a really really really long task, with a really dumb and stup…',
        );

        process.stdout.columns = oldColumns;
      });

      it('shows skipped if level >= 1', () => {
        reporter.tool.config.output = 1;

        const task = new Task('This is a task', () => {}).skip();

        expect(reporter.getLineTitle(task)).toBe(
          `This is a task${chalk.gray(` [${chalk.yellow('skipped')}]`)}`,
        );
      });

      it('shows failed if level >= 1', () => {
        reporter.tool.config.output = 1;

        const task = new Task('This is a task', () => {});
        task.status = STATUS_FAILED;

        expect(reporter.getLineTitle(task)).toBe(
          `This is a task${chalk.gray(` [${chalk.red('failed')}]`)}`,
        );
      });

      it('shows tasks count if level >= 1', () => {
        reporter.tool.config.output = 1;

        const task = new Task('This is a task', () => {});
        task.tasks.push(new Task('Subtask'));

        expect(reporter.getLineTitle(task)).toBe(`This is a task${chalk.gray(' [1/1]')}`);
      });
    });

    describe('routine', () => {
      it('returns title', () => {
        const task = createTestRoutine(null, 'foo', 'This is a routine');

        expect(reporter.getLineTitle(task)).toBe(`This is a routine${chalk.gray(' [0.00s]')}`);
      });

      it('returns status text', () => {
        const task = createTestRoutine(null, 'foo', 'This is a routine');
        task.statusText = 'Running things…';

        expect(reporter.getLineTitle(task)).toBe(
          chalk.gray('Running things…') + chalk.gray(' [0.00s]'),
        );
      });

      it('truncates title', () => {
        const oldColumns = process.stdout.columns;
        const title =
          'This is a really really really long task, with a really dumb and stupidly long title';
        const task = createTestRoutine(null, 'foo', title);

        process.stdout.columns = 80;

        const line = reporter.getLineTitle(task, 10);

        expect(line).not.toContain(title);
        expect(line).toContain('…');

        process.stdout.columns = oldColumns;
      });

      it('shows skipped if level >= 1', () => {
        reporter.tool.config.output = 1;

        const task = createTestRoutine(null, 'foo', 'This is a routine').skip();

        expect(reporter.getLineTitle(task)).toBe(
          `This is a routine${chalk.gray(` [${chalk.yellow('skipped')}]`)}`,
        );
      });

      it('shows failed if level >= 1', () => {
        reporter.tool.config.output = 1;

        const task = createTestRoutine(null, 'foo', 'This is a routine');
        task.status = STATUS_FAILED;

        expect(reporter.getLineTitle(task)).toBe(
          `This is a routine${chalk.gray(` [${chalk.red('failed')}]`)}`,
        );
      });

      it('shows tasks count if level >= 1', () => {
        reporter.tool.config.output = 1;

        const task = createTestRoutine(null, 'foo', 'This is a routine');
        task.routines.push(createTestRoutine(null, 'bar', 'Routine'));

        expect(reporter.getLineTitle(task)).toBe(`This is a routine${chalk.gray(' [0/1]')}`);
      });

      it('shows elapsed time if level >= 2', () => {
        reporter.tool.config.output = 2;

        const task = createTestRoutine(null, 'foo', 'This is a routine');
        task.status = STATUS_PASSED;
        task.startTime = 1000;
        task.stopTime = 4000;

        expect(reporter.getLineTitle(task)).toBe(`This is a routine${chalk.gray(' [3.00s]')}`);
      });

      it('shows both count and status', () => {
        reporter.tool.config.output = 2;

        const task = createTestRoutine(null, 'foo', 'This is a routine');
        task.routines.push(createTestRoutine(null, 'bar', 'Routine'));
        task.status = STATUS_PASSED;
        task.startTime = 1000;
        task.stopTime = 4000;

        expect(reporter.getLineTitle(task)).toBe(`This is a routine${chalk.gray(' [0/1, 3.00s]')}`);
      });

      it('doesnt show status if level == 0', () => {
        reporter.tool.config.output = 0;

        const task = createTestRoutine(null, 'foo', 'This is a routine');
        task.routines.push(createTestRoutine(null, 'bar', 'Routine'));
        task.status = STATUS_PASSED;
        task.startTime = 1000;
        task.stopTime = 4000;

        expect(reporter.getLineTitle(task)).toBe('This is a routine');
      });
    });
  });

  describe('handleStart()', () => {
    it('sets key length', () => {
      reporter.handleStart([
        createTestRoutine(null, 'foo'),
        createTestRoutine(null, 'barbar'),
        createTestRoutine(null, 'bazs'),
      ]);

      expect(reporter.keyLength).toBe(6);
    });
  });

  describe('handleCommand()', () => {
    it('debounces render', () => {
      reporter.handleCommand();

      expect(renderSpy).toHaveBeenCalled();
    });
  });

  describe('handleTask()', () => {
    it('debounces render', () => {
      reporter.handleTask(new Task('task'), createTestRoutine());

      expect(renderSpy).toHaveBeenCalled();
    });

    it('adds the task to the routine', () => {
      const routine = createTestRoutine(null, 'key');
      const task = new Task('task');

      reporter.lines = [{ depth: 0, routine, tasks: [] }];
      reporter.handleTask(task, routine);

      expect(reporter.lines).toEqual([{ depth: 0, routine, tasks: [task] }]);
    });

    it('doesnt add the task if routine was not found', () => {
      const routine = createTestRoutine(null, 'key');
      const task = new Task('task');

      reporter.lines = [];
      reporter.handleTask(task, routine);

      expect(reporter.lines).toEqual([]);
    });
  });

  describe('handleTaskComplete()', () => {
    it('debounces render', () => {
      reporter.handleTaskComplete(new Task('task'), createTestRoutine());

      expect(renderSpy).toHaveBeenCalled();
    });

    it('removes the task from the routine', () => {
      const routine = createTestRoutine(null, 'key');
      const task = new Task('task');

      reporter.lines = [{ depth: 0, routine, tasks: [task] }];
      reporter.handleTaskComplete(task, routine);

      expect(reporter.lines).toEqual([{ depth: 0, routine, tasks: [] }]);
    });
  });

  describe('handleRoutine()', () => {
    it('debounces render', () => {
      reporter.handleRoutine(createTestRoutine(null, 'key'), '', false);

      expect(renderSpy).toHaveBeenCalled();
    });

    it('adds the routine as a line', () => {
      const routine = createTestRoutine(null, 'key');

      reporter.handleRoutine(routine, '', false);

      expect(reporter.lines).toEqual([{ depth: 0, routine, tasks: [] }]);
    });

    it('increases depth', () => {
      expect(reporter.depth).toBe(0);

      reporter.handleRoutine(createTestRoutine(null, 'key'), '', false);

      expect(reporter.depth).toBe(1);
    });

    it('doesnt increase depth if ran as parallel', () => {
      expect(reporter.depth).toBe(0);

      reporter.handleRoutine(createTestRoutine(null, 'key'), '', true);

      expect(reporter.depth).toBe(0);
    });
  });

  describe('handleRoutineComplete()', () => {
    it('debounces render', () => {
      reporter.handleRoutineComplete(createTestRoutine(null, 'key'), '', false);

      expect(renderSpy).toHaveBeenCalled();
    });

    it('removes routine from lines if depth greater than 0 and level < 3', () => {
      const routine = createTestRoutine(null, 'key');

      reporter.tool.config.output = 2;
      reporter.lines = [{ depth: 0, routine, tasks: [] }];
      reporter.depth = 2;

      reporter.handleRoutineComplete(routine, '', false);

      expect(reporter.lines).toEqual([]);
    });

    it('doesnt remove line if depth becomes 0', () => {
      const routine = createTestRoutine(null, 'key');

      reporter.lines = [{ depth: 0, routine, tasks: [] }];
      reporter.depth = 1;

      reporter.handleRoutineComplete(routine, '', false);

      expect(reporter.lines).toEqual([{ depth: 0, routine, tasks: [] }]);
    });

    it('doesnt remove line if level is 3', () => {
      const routine = createTestRoutine(null, 'key');

      reporter.lines = [{ depth: 0, routine, tasks: [] }];
      reporter.depth = 2;
      reporter.tool.config.output = 3;

      reporter.handleRoutineComplete(routine, '', false);

      expect(reporter.lines).toEqual([{ depth: 0, routine, tasks: [] }]);
    });

    it('decreses depth', () => {
      reporter.depth = 1;

      reporter.handleRoutineComplete(createTestRoutine(null, 'key'), '', false);

      expect(reporter.depth).toBe(0);
    });

    it('doesnt decrese depth if ran as parallel', () => {
      reporter.depth = 1;

      reporter.handleRoutineComplete(createTestRoutine(null, 'key'), '', true);

      expect(reporter.depth).toBe(1);
    });
  });

  describe('handleRender()', () => {
    it('writes to buffer', () => {
      reporter.addLine({
        depth: 0,
        routine: createTestRoutine(null, 'foo', 'This is a routine'),
        tasks: [new Task('This is a task', () => {})],
      });

      reporter.addLine({
        depth: 0,
        routine: createTestRoutine(null, 'bar', 'This is a routine with no tasks'),
        tasks: [],
      });

      reporter.keyLength = 3;
      reporter.handleRender();

      expect(reporter.console.write).toHaveBeenCalledWith(
        `${chalk.gray.bold('FOO')}  This is a routine${chalk.gray(' [0.00s]')}`,
        1,
      );
      expect(reporter.console.write).toHaveBeenCalledWith(
        `${chalk.gray.bold('   ')}  ${chalk.gray('This is a task')}`,
        1,
      );
      expect(reporter.console.write).toHaveBeenCalledWith(
        `${chalk.gray.bold('BAR')}  This is a routine with no tasks${chalk.gray(' [0.00s]')}`,
        1,
      );
    });
  });

  describe('renderLine()', () => {
    describe('routine', () => {
      it('writes to buffer', () => {
        reporter.renderLine(createTestRoutine(null, 'foo', 'This is a routine'), null, 0);

        expect(reporter.console.write).toHaveBeenCalledWith(
          `${chalk.gray.bold('FOO')}  This is a routine${chalk.gray(' [0.00s]')}`,
          1,
        );
      });

      it('pads with key length', () => {
        reporter.keyLength = 5;
        reporter.renderLine(createTestRoutine(null, 'foo', 'This is a routine'), null, 0);

        expect(reporter.console.write).toHaveBeenCalledWith(
          `${chalk.gray.bold('FOO  ')}  This is a routine${chalk.gray(' [0.00s]')}`,
          1,
        );
      });

      it('indents with a higher depth', () => {
        reporter.renderLine(createTestRoutine(null, 'foo', 'This is a routine'), null, 3);

        expect(reporter.console.write).toHaveBeenCalledWith(
          `${chalk.gray.bold('   FOO')}      ${chalk.gray('└')} This is a routine${chalk.gray(
            ' [0.00s]',
          )}`,
          1,
        );
      });
    });

    describe('task', () => {
      let routine: Routine<any>;
      let task: Task<any>;

      beforeEach(() => {
        routine = createTestRoutine(null, 'foo', 'This is a routine');
        task = new Task('This is a task', () => {});
      });

      it('writes to buffer', () => {
        reporter.renderLine(routine, task, 0);

        expect(reporter.console.write).toHaveBeenCalledWith(
          `${chalk.gray.bold('')}  ${chalk.gray('This is a task')}`,
          1,
        );
      });

      it('pads with key length', () => {
        reporter.keyLength = 5;
        reporter.renderLine(routine, task, 0);

        expect(reporter.console.write).toHaveBeenCalledWith(
          `${chalk.gray.bold('     ')}  ${chalk.gray('This is a task')}`,
          1,
        );
      });

      it('indents with a higher depth', () => {
        reporter.renderLine(routine, task, 3);

        expect(reporter.console.write).toHaveBeenCalledWith(
          `${chalk.gray.bold('   ')}        ${chalk.gray('This is a task')}`,
          1,
        );
      });
    });
  });
});
