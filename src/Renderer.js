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
  silent: boolean,
};

export default class Renderer<Tx: Object> {
  instance: number = 0;

  hasFailed: boolean = false;

  loader: ?TasksLoader<Tx> = null;

  options: RendererOptions;

  constructor(options?: Object = {}) {
    this.options = new Options(options, {
      clearOutput: bool(),
      refreshRate: number(100), // eslint-disable-line no-magic-numbers
      silent: bool(),
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
  render(tasks: Task<*, Tx>[]): string {
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
  renderTask(task: Task<*, Tx>, level?: number = 0, suffix?: string = ''): string[] {
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

    // Show the current status output
    if (task.statusText) {
      output.push(`${this.indent(level + 1)}${chalk.gray(task.statusText)}`);
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
  renderStatus(task: Task<*, Tx>): string {
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
  start(loader: TasksLoader<Tx>) {
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

    // const {
    //   debugs,
    //   errors,
    //   logs,
    //   options,
    // } = this.tool;
    let output = '';

    // Display output by default
    if (!this.options.silent) {
      // if (options.title) {
      //   output += options.title;
      //   output += '\n';
      // }

      output += this.render(this.loader());
    }
    //
    // // Show additional output for the final render
    // if (stop) {
    //   if (debugs.length > 0) {
    //     output += '\n\n';
    //     output += debugs.join('\n');
    //   }
    //
    //   if (this.hasFailed) {
    //     if (errors.length > 0) {
    //       output += '\n\n';
    //       output += errors.join('\n');
    //     }
    //   } else if (logs.length > 0) {
    //     output += '\n\n';
    //     output += logs.join('\n');
    //   }
    // }

    logUpdate(output);
  }
}
