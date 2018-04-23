/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import rl from 'readline';
import chalk from 'chalk';
import cliTruncate from 'cli-truncate';
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
    cli.on('command.data', this.handleCommand);
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
  getLineTitle(task: TaskInterface | RoutineInterface, spacing: number = 0): string {
    // @ts-ignore
    const { subtasks = [], subroutines = [] } = task;
    const title = task.statusText || task.title;
    let status = '';

    if (task.isSkipped()) {
      status += chalk.yellow(' [skipped]');
    } else if (task.hasFailed()) {
      status += chalk.red(' [failed]');
    } else if (subtasks.length > 0) {
      status += chalk.gray(` [${this.calculateTaskCompletion(subtasks)}/${subtasks.length}]`);
    } else if (subroutines.length > 0) {
      status += chalk.gray(` [${this.calculateTaskCompletion(subroutines)}/${subroutines.length}]`);
    }

    return cliTruncate(title, (process.stdout.columns || 0) - spacing - status.length) + status;
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

  handleCommand = () => {
    this.debounceRender();
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

    if (this.depth > 0 && !this.options.verbose) {
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
    const indent = depth * 2 + this.keyLengths[depth] + 2;

    this.log(chalk.gray(`${this.indent(indent)} ${this.getLineTitle(task, indent + 1)}`), 1);
  }

  renderRoutineLine(routine: RoutineInterface, depth: number) {
    const indent = depth * 2;
    const key = routine.key.toUpperCase().padEnd(this.keyLengths[depth]);
    let output = '';

    if (depth > 0) {
      output += this.indent(indent - 2);
      output += chalk.gray('└');
      output += ' ';
    }

    output += chalk.reset.bold.black.bgKeyword(this.getStatusColor(routine))(` ${key} `);
    output += ' ';
    output += this.getLineTitle(routine, indent + key.length + 3);

    this.log(output, 1);
  }
}
