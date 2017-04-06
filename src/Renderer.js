/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import chalk from 'chalk';
import spinner from 'elegant-spinner';
import figures from 'figures';
import logUpdate from 'log-update';
import { PENDING, RUNNING, SKIPPED, PASSED, FAILED } from './constants';

import type { Status, TreeNode, TreeLoader } from './types';

export default class Renderer {
  instance: number = 0;
  loader: TreeLoader;
  spinner: () => string;

  constructor(loader: TreeLoader) {
    this.loader = loader;
    this.spinner = spinner();
  }

  /**
   * Render the output by looping over all nodes in the tree.
   */
  render() {
    const output = [];
    const nodes = this.loader();

    nodes.forEach((node: TreeNode) => {
      output.push(...this.renderNode(node, 0));
    });

    return output.join('\n');
  }

  /**
   * Render a single node including it's title and status.
   * If sub-tasks or routines exist, render them recursively.
   */
  renderNode(node: TreeNode, level: number = 0): string[] {
    const output = [];

    // Generate the message row
    let message = `${'    '.repeat(level)}${this.renderStatus(node.status)} ${node.title}`;

    if (node.status === SKIPPED) {
      message += ` ${chalk.yellow('[skipped]')}`;
    } else if (node.status === FAILED) {
      message += ` ${chalk.red('[failed]')}`;
    }

    output.push(message);

    // Show only one task at a time
    if (node.tasks && node.tasks.length) {
      let pendingTask;
      let runningTask;
      let failedTask;

      node.tasks.some((task: TreeNode) => {
        switch (task.status) {
          case PENDING:
            pendingTask = task;
            return false;

          case RUNNING:
            runningTask = task;
            return false;

          // Always show the failed task
          case FAILED:
            failedTask = task;
            return true;

          default:
            return false;
        }
      });

      const task = failedTask || runningTask || pendingTask;

      if (task) {
        output.push(...this.renderNode(task, level + 1));
      }
    }

    // Show all subroutines
    if (node.routines && node.routines.length) {
      node.routines.forEach((routine: TreeNode) => {
        output.push(...this.renderNode(routine, level + 1));
      });
    }

    return output;
  }

  /**
   * Render a status symbol for a node.
   */
  renderStatus(status: Status): string {
    switch (status) {
      case PENDING:
        return chalk.gray(figures.circle);
      case RUNNING:
        return this.spinner();
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
    logUpdate.clear();
  }

  /**
   * Start the rendering process.
   */
  start() {
    if (!this.instance) {
      this.instance = setInterval(() => {
        logUpdate(this.render());
      }, 100);
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

    logUpdate(this.render());
    logUpdate.done();
  }
}
