/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import chalk from 'chalk';
import figures from 'figures';
import logUpdate from 'log-update';
import Task from './Task';
import { PENDING, RUNNING, SKIPPED, PASSED, FAILED } from './constants';

import type { Chalk } from 'chalk'; // eslint-disable-line
import type { LogUpdate } from 'log-update'; // eslint-disable-line
import type { TasksLoader } from './types';

const RENDER_INTERVAL: number = 100;

export default class Renderer {
  chalk: Chalk;
  instance: number = 0;
  load: TasksLoader;
  log: LogUpdate;

  constructor(loader: TasksLoader) {
    this.load = loader;
    this.log = logUpdate;
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
  render() {
    const output = [];
    const tasks = this.load() || [];

    tasks.forEach((task: Task) => {
      output.push(...this.renderTask(task, 0));
    });

    return output.join('\n');
  }

  /**
   * Render a single task including its title and status.
   * If sub-tasks or sub-routines exist, render them recursively.
   */
  renderTask(task: Task, level: number = 0, suffix: string = ''): string[] {
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
    if (task.subtasks.length) {
      let pendingTask;
      let runningTask;
      let failedTask;
      let passed = 0;

      task.subtasks.forEach((subTask: Task) => {
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
    if (task.subroutines.length) {
      task.subroutines.forEach((routine: Task) => {
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
      case PENDING:
        return chalk.gray(figures.bullet);
      case RUNNING:
        return chalk.gray(task.spinner());
      case SKIPPED:
        return chalk.yellow(figures.circleDotted);
      case PASSED:
        return chalk.green(figures.tick);
      case FAILED:
        return chalk.red(figures.cross);
      default:
        return '';
    }
  }

  /**
   * Clear the current output.
   */
  reset() {
    this.log.clear();
  }

  /**
   * Start the rendering process.
   */
  start() {
    if (!this.instance) {
      this.instance = setInterval(() => this.update(), RENDER_INTERVAL);
    }
  }

  /**
   * Stop rendering and finalize the output.
   */
  stop() {
    this.update();

    if (this.instance) {
      clearInterval(this.instance);
      this.instance = 0;
    }

    this.log.done();
  }

  /**
   * Force a render and update the current output.
   */
  update() {
    if (this.instance) {
      this.log(this.render());
    } else {
      this.start();
    }
  }
}
