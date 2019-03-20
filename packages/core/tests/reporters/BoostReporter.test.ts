/* eslint-disable prefer-template */

import chalk from 'chalk';
import { mockTool, mockConsole, mockRoutine } from '../../src/testUtils';
import BoostReporter from '../../src/reporters/BoostReporter';
import Pipeline from '../../src/Pipeline';
import Routine from '../../src/Routine';
import Task from '../../src/Task';
import Tool from '../../src/Tool';
import Context from '../../src/Context';
import {
  STATUS_RUNNING,
  STATUS_SKIPPED,
  STATUS_FAILED,
  STATUS_PENDING,
  STATUS_PASSED,
} from '../../src/constants';

const oldDateNow = Date.now;

describe('BoostReporter', () => {
  let reporter: BoostReporter;
  let tool: Tool<any, any>;
  let parent: Routine<any, any>;
  let child1: Routine<any, any>;
  let child2: Routine<any, any>;

  beforeEach(() => {
    tool = mockTool();

    reporter = new BoostReporter();
    reporter.console = mockConsole(tool);
    reporter.tool = tool;

    parent = mockRoutine(tool, 'parent', 'Parent');
    parent.metadata.depth = 0;
    parent.status = STATUS_RUNNING;

    child1 = mockRoutine(tool, 'child1', 'Child #1');
    child1.status = STATUS_RUNNING;

    child2 = mockRoutine(tool, 'child2', 'Child #2');
    child2.status = STATUS_SKIPPED;

    new Pipeline(tool, new Context()).pipe(parent);
    parent.pipe(child1).pipe(child2);

    Date.now = () => 0;
  });

  afterEach(() => {
    Date.now = oldDateNow;
  });

  describe('bootstrap()', () => {
    it('binds events', () => {
      const spy = jest.spyOn(reporter.console, 'on');

      reporter.bootstrap();

      expect(spy).toHaveBeenCalledWith('routine', expect.anything());
    });
  });

  describe('handleRoutine()', () => {
    it('enqueues an output if depth is 0', () => {
      const routine = mockRoutine(tool);

      expect(reporter.console.outputQueue).toEqual([]);

      reporter.handleRoutine(routine);

      expect(reporter.console.outputQueue).not.toEqual([]);
    });

    it('doesnt enqueue an output if depth is greater than 0', () => {
      const routine = mockRoutine(tool);
      routine.metadata.depth = 1;

      expect(reporter.console.outputQueue).toEqual([]);

      reporter.handleRoutine(routine);

      expect(reporter.console.outputQueue).toEqual([]);
    });

    it('marks as final when `skip` event is emitted', () => {
      reporter.handleRoutine(parent);

      parent.emit('skip');

      expect(reporter.console.outputQueue[0].isFinal()).toBe(true);
    });

    it('marks as final when `pass` event is emitted', () => {
      reporter.handleRoutine(parent);

      parent.emit('pass');

      expect(reporter.console.outputQueue[0].isFinal()).toBe(true);
    });

    it('marks as final when `fail` event is emitted', () => {
      reporter.handleRoutine(parent);

      parent.emit('fail');

      expect(reporter.console.outputQueue[0].isFinal()).toBe(true);
    });

    it('renders lines via output renderer', () => {
      const spy = jest.spyOn(reporter, 'renderLines');

      reporter.handleRoutine(parent);

      reporter.console.outputQueue[0].render();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getRoutineLineParts()', () => {
    it('handles skipped', () => {
      expect(reporter.getRoutineLineParts(child2)).toEqual({
        prefix: '        ' + chalk.yellow.bold('CHILD2'),
        suffix: chalk.yellow('skipped'),
        title: 'Child #2',
      });
    });

    it('handles failed', () => {
      child2.status = STATUS_FAILED;

      expect(reporter.getRoutineLineParts(child2)).toEqual({
        prefix: '        ' + chalk.red.bold('CHILD2'),
        suffix: chalk.red('failed'),
        title: 'Child #2',
      });
    });

    it('handles passed', () => {
      child2.status = STATUS_PASSED;

      expect(reporter.getRoutineLineParts(child2)).toEqual({
        prefix: '        ' + chalk.green.bold('CHILD2'),
        suffix: '',
        title: 'Child #2',
      });
    });

    describe('compact output', () => {
      beforeEach(() => {
        reporter.tool.config.output = 1;
      });

      it('returns parent parts', () => {
        expect(reporter.getRoutineLineParts(parent)).toEqual({
          prefix: chalk.gray.bold('PARENT'),
          suffix: '',
          title: 'Parent',
        });
      });

      it('returns child parts', () => {
        expect(reporter.getRoutineLineParts(child1)).toEqual({
          prefix: '  ' + chalk.gray.bold('CHILD1'),
          suffix: '',
          title: 'Child #1',
        });
      });
    });

    describe('normal output', () => {
      beforeEach(() => {
        reporter.tool.config.output = 2;
      });

      it('returns parent parts', () => {
        expect(reporter.getRoutineLineParts(parent)).toEqual({
          prefix: chalk.gray('[1/1]') + ' ' + chalk.gray.bold('PARENT'),
          suffix: '0s',
          title: 'Parent',
        });
      });

      it('returns child parts', () => {
        expect(reporter.getRoutineLineParts(child1)).toEqual({
          prefix: '        ' + chalk.gray.bold('CHILD1'),
          suffix: '0s',
          title: 'Child #1',
        });
      });
    });

    describe('verbose output', () => {
      beforeEach(() => {
        reporter.tool.config.output = 3;
      });

      it('returns parent parts', () => {
        expect(reporter.getRoutineLineParts(parent)).toEqual({
          prefix: chalk.gray('[1/1]') + ' ' + chalk.gray.bold('PARENT'),
          suffix: '0s',
          title: 'Parent',
        });
      });

      it('returns child parts', () => {
        expect(reporter.getRoutineLineParts(child1)).toEqual({
          prefix: '        ' + chalk.gray.bold('CHILD1'),
          suffix: '0s',
          title: 'Child #1',
        });
      });
    });
  });

  describe('getStepProgress()', () => {
    it('returns an empty string if no parent', () => {
      expect(reporter.getStepProgress(new Task('Title', () => {}))).toBe('');
    });
  });

  describe('getTaskLine()', () => {
    let task: Task<any>;

    beforeEach(() => {
      task = parent.task('Task', () => {});
    });

    it('returns status text over title', () => {
      task.statusText = 'Running...';

      expect(reporter.getTaskLine(task)).toBe('Running...');
    });

    describe('compact output', () => {
      beforeEach(() => {
        reporter.tool.config.output = 1;
      });

      it('returns the title', () => {
        expect(reporter.getTaskLine(task)).toBe('Task');
      });
    });

    describe('normal output', () => {
      beforeEach(() => {
        reporter.tool.config.output = 2;
      });

      it('returns the title and progress', () => {
        expect(reporter.getTaskLine(task)).toBe('Task [1/1]');
      });
    });

    describe('verbose output', () => {
      beforeEach(() => {
        reporter.tool.config.output = 3;
      });

      it('returns the title and progress', () => {
        expect(reporter.getTaskLine(task)).toBe('Task [1/1]');
      });
    });
  });

  describe('renderLines()', () => {
    it('returns a routine', () => {
      expect(reporter.renderLines(child1)).toBe(
        `        ${chalk.gray.bold('CHILD1')} Child #1 ${chalk.gray('(0s)')}\n`,
      );
    });

    it('includes running tasks', () => {
      child1.task('Task #1', () => {});
      const task2 = child1.task('Task #2', () => {});
      const task3 = child1.task('Task #3', () => {});
      task2.status = STATUS_RUNNING;
      task3.status = STATUS_RUNNING;

      expect(reporter.renderLines(child1)).toBe(
        `        ${chalk.gray.bold('CHILD1')} Child #1 ${chalk.gray('(0s)')}\n` +
          `          ${chalk.gray('Task #2 [2/3]')}\n` +
          `          ${chalk.gray('Task #3 [3/3]')}\n`,
      );
    });

    it('includes sub-routines', () => {
      expect(reporter.renderLines(parent)).toBe(
        `${chalk.gray('[1/1]')} ${chalk.gray.bold('PARENT')} Parent ${chalk.gray('(0s)')}\n` +
          `        ${chalk.gray.bold('CHILD1')} Child #1 ${chalk.gray('(0s)')}\n` +
          `        ${chalk.yellow.bold('CHILD2')} Child #2 ${chalk.gray(
            `(${chalk.yellow('skipped')})`,
          )}\n`,
      );
    });

    it('sorts sub-routines by start time', () => {
      child1.metadata.startTime = 100;
      child2.metadata.startTime = 10;
      child2.status = STATUS_RUNNING;

      expect(reporter.renderLines(parent)).toBe(
        `${chalk.gray('[1/1]')} ${chalk.gray.bold('PARENT')} Parent ${chalk.gray('(0s)')}\n` +
          `        ${chalk.gray.bold('CHILD2')} Child #2 ${chalk.gray(`(-10ms)`)}\n` +
          `        ${chalk.gray.bold('CHILD1')} Child #1 ${chalk.gray('(-100ms)')}\n`,
      );
    });

    it('filters pending sub-routines', () => {
      child2.status = STATUS_PENDING;

      expect(reporter.renderLines(parent)).toBe(
        `${chalk.gray('[1/1]')} ${chalk.gray.bold('PARENT')} Parent ${chalk.gray('(0s)')}\n` +
          `        ${chalk.gray.bold('CHILD1')} Child #1 ${chalk.gray('(0s)')}\n`,
      );
    });

    it('doesnt include sub-routines if parent is pending', () => {
      parent.status = STATUS_PENDING;

      expect(reporter.renderLines(parent)).toBe(
        `${chalk.gray('[1/1]')} ${chalk.gray.bold('PARENT')} Parent\n`,
      );
    });

    it('doesnt include sub-routines if parent is complete and output level is not verbose', () => {
      parent.status = STATUS_PASSED;
      reporter.tool.config.output = 1;

      expect(reporter.renderLines(parent)).toBe(`${chalk.green.bold('PARENT')} Parent\n`);
    });
  });
});
