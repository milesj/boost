/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import rl from 'readline';
import chalk from 'chalk';
import { ConsoleInterface } from './Console';
import Reporter from './Reporter';
import Routine, { RoutineInterface } from './Routine';
import Task, { TaskInterface } from './Task';

export default class DefaultReporter extends Reporter {
  depth: number = 0;

  lines: (TaskInterface | RoutineInterface)[] = [];

  keyLengths: { [depth: number]: number } = {};

  bootstrap(cli: ConsoleInterface) {
    super.bootstrap(cli);

    cli.on('start', this.handleStart);
    cli.on('stop', this.handleStop);
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

  handleStop = (event: any, error: Error) => {
    if (error) {
      this.renderError(error);
    }
  };

  /**
   * When a task is running, render the title as the last line.
   */
  handleTask = (event: any, task: TaskInterface) => {
    // First task for the current routine
    if (this.lines[0] instanceof Routine) {
      this.lines.unshift(task);

      // Replace the previous task with a new task
    } else {
      this.lines[0] = task;
      this.clearLastLine();
    }

    // Re-render the routine to update passed count
    this.clearLastLine();
    this.renderRoutineLine(this.lines[1] as RoutineInterface, this.depth - 1);

    // Render the current task
    this.renderTaskLine(task);
  };

  /**
   * When a task is complete, remove the task output and re-render the routine.
   */
  handleTaskComplete = (event: any, task: TaskInterface) => {
    // Remove previous lines
    this.lines.shift();
    this.clearLastLine(); // Task
    this.clearLastLine(); // Routine

    // Re-render the routine
    this.renderRoutineLine(this.lines[0] as RoutineInterface, this.depth);
  };

  /**
   * When a routine begins, output the status, title, and number of tasks that have ran.
   */
  handleRoutine = (event: any, routine: RoutineInterface) => {
    this.renderRoutineLine(routine, this.depth);
    this.lines.unshift(routine);
    this.depth += 1;
  };

  /**
   * When a routine is complete, update the status and task ran count.
   */
  handleRoutineComplete = (event: any, routine: RoutineInterface) => {
    this.depth -= 1;

    // Clear sub-routines after they have ran
    routine.subroutines.forEach(() => {
      this.clearLastLine();
    });

    // Re-render the routine line
    this.clearLastLine();
    this.renderRoutineLine(routine, this.depth);
  };

  renderTaskLine(task: TaskInterface) {
    console.log(chalk.gray(this.getLineTitle(task)));
  }

  renderRoutineLine(routine: RoutineInterface, depth: number) {
    const key = routine.key.toUpperCase().padEnd(this.keyLengths[depth]);
    const status = chalk.reset.bold.black.bgKeyword(this.getStatusColor(routine))(` ${key} `);

    console.log(`${this.indent(depth)}${status} ${this.getLineTitle(routine)}`);
  }
}
