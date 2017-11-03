/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import chalk from 'chalk';
import figures from 'figures';
import Task from './Task';
import {
  STATUS_PENDING,
  STATUS_RUNNING,
  STATUS_SKIPPED,
  STATUS_PASSED,
  STATUS_FAILED,
} from './constants';

export default class Renderer {
  /**
   * Create an indentation based on the defined length.
   */
  indent(length: number): string {
    return '    '.repeat(length);
  }

  /**
   * Render the output by looping over all tasks in the tree.
   */
  render(tasks: Task[] = []): string {
    const output = [];

    tasks.forEach((task) => {
      output.push(...this.renderTask(task, 0));
    });

    return output.join('\n');
  }

  /**
   * Render a single task including its title and status.
   * If sub-tasks or sub-routines exist, render them recursively.
   */
  renderTask(task: Task, level?: number = 0, suffix?: string = ''): string[] {
    const output = [];

    // Generate the message row
    let message = `${this.indent(level)}${this.renderStatus(task)} ${task.title}`;

    if (task.isSkipped()) {
      message += ` ${chalk.yellow('[skipped]')}`;

    } else if (task.hasFailed()) {
      message += ` ${chalk.red('[failed]')}`;

    } else if (suffix) {
      message += ` ${suffix}`;
    }

    output.push(message);

    // Show only one sub-task at a time
    if (task.subtasks.length > 0) {
      let pendingTask;
      let runningTask;
      let failedTask;
      let passed = 0;

      task.subtasks.forEach((subTask) => {
        if (subTask.isPending() && !pendingTask) {
          pendingTask = subTask;

        } else if (subTask.isRunning() && !runningTask) {
          runningTask = subTask;

        } else if (subTask.hasFailed() && !failedTask) {
          failedTask = subTask;

        } else if (subTask.hasPassed()) {
          passed += 1;
        }
      });

      const activeTask = failedTask || runningTask || pendingTask;
      const taskSuffix = chalk.gray(`[${passed}/${task.subtasks.length}]`);

      // Only show if the parent is running or a task failed
      if (activeTask && (task.isRunning() || failedTask)) {
        output.push(...this.renderTask(activeTask, level + 1, taskSuffix));
      }
    }

    // Show all sub-routines
    if (task.subroutines.length > 0) {
      task.subroutines.forEach((routine) => {
        output.push(...this.renderTask(routine, level + 1));
      });
    }

    return output;
  }

  /**
   * Render a status symbol for a task.
   */
  renderStatus(task: Task): string {
    switch (task.status) {
      case STATUS_PENDING:
        return chalk.gray(figures.bullet);
      case STATUS_RUNNING:
        return chalk.gray(task.spinner());
      case STATUS_SKIPPED:
        return chalk.yellow(figures.circleDotted);
      case STATUS_PASSED:
        return chalk.green(figures.tick);
      case STATUS_FAILED:
        return chalk.red(figures.cross);
      default:
        return '';
    }
  }
}
