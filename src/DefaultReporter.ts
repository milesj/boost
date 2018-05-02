/**
 * @copyright   2017-2018, Miles Johnson
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

  keyLength: number = 0;

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
  calculateKeyLength(routines: RoutineInterface[], depth: number = 0): number {
    return routines.reduce(
      (sum: number, routine: RoutineInterface) =>
        Math.max(
          sum,
          routine.key.length + depth,
          this.calculateKeyLength(routine.subroutines, depth + 1),
        ),
      0,
    );
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
  getLineTitle(task: TaskInterface | RoutineInterface, usedColumns: number = 0): string {
    const { verbose } = this.options;
    // @ts-ignore
    const { subtasks = [], subroutines = [] } = task;
    const title = task.statusText ? chalk.gray(task.statusText) : task.title;
    const status = [];

    if (task.isSkipped()) {
      status.push(chalk.yellow('skipped'));
    } else if (task.hasFailed()) {
      status.push(chalk.red('failed'));
    } else if (subtasks.length > 0) {
      status.push(`${this.calculateTaskCompletion(subtasks)}/${subtasks.length}`);
    } else if (subroutines.length > 0) {
      status.push(`${this.calculateTaskCompletion(subroutines)}/${subroutines.length}`);
    }

    if (task.hasPassed() && verbose >= 2) {
      status.push(this.getElapsedTime(task.startTime, task.stopTime));
    }

    // eslint-disable-next-line no-magic-numbers
    const columns = process.stdout.columns || 80;
    const fullStatus =
      status.length > 0 && verbose >= 1 ? chalk.gray(` [${status.join(', ')}]`) : '';

    return cliTruncate(title, columns - usedColumns - fullStatus.length) + fullStatus;
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

    return 'gray';
  }

  handleStart = (routines: RoutineInterface[]) => {
    this.keyLength = this.calculateKeyLength(routines);
  };

  handleCommand = () => {
    this.debounceRender();
  };

  handleTask = (task: TaskInterface) => {
    this.addLine({
      depth: this.depth - 1,
      task,
    });
    this.debounceRender();
  };

  handleTaskComplete = (task: TaskInterface) => {
    this.removeLine(line => line.task === task);
    this.debounceRender();
  };

  handleRoutine = (routine: RoutineInterface) => {
    this.addLine({
      depth: this.depth,
      task: routine,
    });
    this.debounceRender();

    this.depth += 1;
  };

  handleRoutineComplete = (routine: RoutineInterface) => {
    this.depth -= 1;

    if (this.depth > 0 && this.options.verbose < 3) {
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
    const indent = depth * 2 + this.keyLength + 2;

    this.log(chalk.gray(`${this.indent(indent)} ${this.getLineTitle(task, indent + 1)}`), 1);
  }

  renderRoutineLine(routine: RoutineInterface, depth: number) {
    const indent = depth * 2;
    const key = this.indent(depth) + routine.key.toUpperCase().padEnd(this.keyLength - depth);
    let output = '';

    // Status
    output += chalk.supportsColor
      ? chalk.reset.bold.black.bgKeyword(this.getStatusColor(routine))(` ${key} `)
      : `[${key}]`;
    output += ' ';

    // Tree
    if (depth > 0) {
      output += this.indent(indent - 2);
      output += chalk.gray('└');
      output += ' ';
    }

    // Title
    output += this.getLineTitle(routine, indent + key.length + 3);

    this.log(output, 1);
  }
}
