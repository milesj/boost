/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import chalk from 'chalk';
import figures from 'figures';
import logUpdate from 'log-update';
import Options, { bool, number } from 'optimal';
import Task from './Task';
import Tool from './Tool';
import {
  STATUS_PENDING,
  STATUS_RUNNING,
  STATUS_SKIPPED,
  STATUS_PASSED,
  STATUS_FAILED,
} from './constants';

import type { TasksLoader } from './types';

type RendererOptions = {
  clearOutput: boolean,
  refreshRate: number,
};

export default class Renderer {
  instance: number = 0;

  hasFailed: boolean = false;

  loader: ?TasksLoader = null;

  options: RendererOptions;

  tool: Tool<*, *>;

  constructor(options?: Object = {}) {
    this.options = new Options(options, {
      clearOutput: bool(),
      refreshRate: number(100), // eslint-disable-line no-magic-numbers
    }, {
      name: 'Renderer',
    });
  }

  /**
   * Create an indentation based on the defined length.
   */
  indent(length: number): string {
    return '    '.repeat(length);
  }

  /**
   * Render the output by looping over all tasks in the tree.
   */
  render(tasks: Task<*>[]): string {
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
  renderTask(task: Task<*>, level?: number = 0, suffix?: string = ''): string[] {
    const output = [];

    // Generate the message row
    let message = `${this.indent(level)}${this.renderStatus(task)} ${task.title}`;

    if (task.isSkipped()) {
      message += ` ${chalk.yellow('[skipped]')}`;

    } else if (task.hasFailed()) {
      message += ` ${chalk.red('[failed]')}`;
      this.hasFailed = true;

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
          this.hasFailed = true;

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
  renderStatus(task: Task<*>): string {
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

  /**
   * Start the output process once setting the task loader.
   */
  start(loader: TasksLoader) {
    if (this.instance) {
      return;
    } else if (!loader || typeof loader !== 'function') {
      throw new TypeError('A tasks loader is required to render CLI output.');
    }

    this.loader = loader;

    this.instance = setInterval(() => {
      this.update();
    }, this.options.refreshRate);
  }

  /**
   * Stop and or clear the output process.
   */
  stop() {
    // Turn off interval
    clearInterval(this.instance);

    // Render the final output
    if (this.options.clearOutput) {
      logUpdate.clear();
    } else {
      this.update(true);

      logUpdate.done();
    }

    // Dereference our loader
    this.loader = null;
  }

  /**
   * Update and flush the output if the loader is defined.
   */
  update(stop?: boolean = false) {
    if (!this.loader) {
      return;
    }

    let output = this.render(this.loader());

    // Show additional output for the final render
    if (stop) {
      output += '\n\n';
      output += this.tool.debugs.join('\n');

      if (this.hasFailed) {
        output += '\n\n';
        output += this.tool.errors.join('\n');
      } else {
        output += '\n\n';
        output += this.tool.logs.join('\n');
      }
    }

    logUpdate(output);
  }
}
