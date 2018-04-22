/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import rl from 'readline';
import chalk from 'chalk';
import { ConsoleInterface } from './Console';
import Reporter, { ReporterOptions } from './Reporter';
import Routine, { RoutineInterface } from './Routine';
import Task, { TaskInterface } from './Task';

export interface Line {
  depth: number;
  task: TaskInterface;
}

export default class DefaultReporter extends Reporter<Line, ReporterOptions> {
  depth: number = 0;

  keyLengths: { [depth: number]: number } = {};

  bootstrap(cli: ConsoleInterface) {
    super.bootstrap(cli);

    cli.on('start', this.handleStart);
    cli.on('task', this.handleTask);
    cli.on('task.pass', this.handleTaskComplete);
    cli.on('task.fail', this.handleTaskComplete);
    cli.on('routine', this.handleRoutine);
    cli.on('routine.pass', this.handleRoutineComplete);
    cli.on('routine.fail', this.handleRoutineComplete);
  }

  /**
   * Calculate the max string length for routine key's at every depth.
   */
  calculateKeyLengths(routines: RoutineInterface[], depth: number = 0) {
    this.keyLengths[depth] = routines.reduce((sum: number, routine: RoutineInterface) => {
      if (routine.subroutines.length > 0) {
        this.calculateKeyLengths(routine.subroutines, depth + 1);
      }

      return Math.max(routine.key.length, sum);
    }, 0);
  }

  /**
   * Calculate the current number of tasks that have completed.
   */
  calculateTaskCompletion(tasks: TaskInterface[]): number {
    return tasks.reduce((sum, task) => (task.hasPassed() || task.isSkipped() ? sum + 1 : sum), 0);
  }

  /**
   * Return the task title with additional metadata.
   */
  getLineTitle(task: TaskInterface): string {
    const { subtasks } = task;
    let line = task.statusText || task.title;

    if (task.isSkipped()) {
      line += chalk.yellow(' [skipped]');
    } else if (task.hasFailed()) {
      line += chalk.red(' [failed]');
    } else if (subtasks.length > 0) {
      line += chalk.gray(` [${this.calculateTaskCompletion(subtasks)}/${subtasks.length}]`);
    }

    return line;
  }

  /**
   * Return a specific color for each task status.
   */
  getStatusColor(task: TaskInterface): string {
    if (task.isSkipped()) {
      return 'yellow';
    } else if (task.hasPassed()) {
      return 'green';
    } else if (task.hasFailed()) {
      return 'red';
    }

    return 'white';
  }

  handleStart = (event: any, routines: RoutineInterface[]) => {
    this.calculateKeyLengths(routines);
  };

  handleTask = (event: any, task: TaskInterface) => {
    this.addLine({
      depth: this.depth - 1,
      task,
    });
    this.debounceRender();
  };

  handleTaskComplete = (event: any, task: TaskInterface) => {
    this.removeLine(line => line.task === task);
    this.debounceRender();
  };

  handleRoutine = (event: any, routine: RoutineInterface) => {
    this.addLine({
      depth: this.depth,
      task: routine,
    });
    this.debounceRender();

    this.depth += 1;
  };

  handleRoutineComplete = (event: any, routine: RoutineInterface) => {
    this.depth -= 1;

    if (this.depth > 0) {
      this.removeLine(line => line.task === routine);
    }

    this.debounceRender();
  };

  render() {
    this.lines.forEach(line => {
      if (line.task instanceof Routine) {
        this.renderRoutineLine(line.task, line.depth);
      } else {
        this.renderTaskLine(line.task, line.depth);
      }
    });
  }

  renderTaskLine(task: TaskInterface, depth: number) {
    const indent = this.indent(this.keyLengths[depth] + 2);

    this.log(chalk.gray(`${indent} ${this.getLineTitle(task)}`), 1);
  }

  renderRoutineLine(routine: RoutineInterface, depth: number) {
    const key = routine.key.toUpperCase().padEnd(this.keyLengths[depth]);
    const status = chalk.reset.bold.black.bgKeyword(this.getStatusColor(routine))(` ${key} `);

    this.log(`${status} ${this.getLineTitle(routine)}`, 1);
  }
}
