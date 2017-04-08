/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import chalk from 'chalk';
import spinner from 'elegant-spinner';
import figures from 'figures';
import logUpdate from 'log-update';
import TaskResult from './TaskResult';
import { PENDING, RUNNING, SKIPPED, PASSED, FAILED } from './constants';

import type { LogUpdate } from 'log-update'; // eslint-disable-line
import type { Status, ResultsLoader } from './types';

export default class Renderer {
  instance: number = 0;
  load: ResultsLoader;
  log: LogUpdate;
  spinner: () => string;

  constructor(loader: ResultsLoader) {
    this.load = loader;
    this.log = logUpdate;
    this.spinner = spinner();
  }

  /**
   * Render the output by looping over all results in the tree.
   */
  render() {
    const output = [];
    const results = this.load();

    results.forEach((result: TaskResult) => {
      output.push(...this.renderResult(result, 0));
    });

    return output.join('\n');
  }

  /**
   * Render a single result including it's title and status.
   * If sub-tasks or routines exist, render them recursively.
   */
  renderResult(result: TaskResult, level: number = 0): string[] {
    const output = [];

    // Generate the message row
    let message = `${'    '.repeat(level)}${this.renderStatus(result.status)} ${result.title}`;

    if (result.isSkipped()) {
      message += ` ${chalk.yellow('[skipped]')}`;

    } else if (result.hasFailed()) {
      message += ` ${chalk.red('[failed]')}`;
    }

    output.push(message);

    // Show only one task at a time
    let pendingTask;
    let runningTask;
    let failedTask;

    result.tasks.some((task: TaskResult) => {
      if (task.isPending()) {
        pendingTask = task;

      } else if (task.isRunning()) {
        runningTask = task;

      } else if (task.hasFailed()) {
        failedTask = task;
        return true;
      }

      return false;
    });

    const activeTask = failedTask || runningTask || pendingTask;

    if (activeTask) {
      output.push(...this.renderResult(activeTask, level + 1));
    }

    // Show all subroutines
    result.routines.forEach((routine: TaskResult) => {
      output.push(...this.renderResult(routine, level + 1));
    });

    return output;
  }

  /**
   * Render a status symbol for a result.
   */
  renderStatus(status: Status): string {
    switch (status) {
      case PENDING:
        return chalk.gray(figures.circle);
      case RUNNING:
        return chalk.gray(this.spinner());
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
      this.instance = setInterval(() => this.update(), 100);
    }
  }

  /**
   * Stop rendering and finalize the output.
   */
  stop() {
    if (this.instance) {
      clearInterval(this.instance);
      this.instance = 0;
    }

    this.update();
    this.log.done();
  }

  /**
   * Force a render and update the current output.
   */
  update() {
    this.log(this.render());
  }
}
