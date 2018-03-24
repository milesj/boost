/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable complexity */

import chalk from 'chalk';
import figures from 'figures';
import logUpdate from 'log-update';
import { Options } from 'optimal';
import Module, { ModuleInterface } from './Module';
import { TaskInterface } from './Task';
import {
  STATUS_PENDING,
  STATUS_RUNNING,
  STATUS_SKIPPED,
  STATUS_PASSED,
  STATUS_FAILED,
} from './constants';
import { ReportLoader } from './types';

export const REFRESH_RATE: number = 100;
export const CURSOR: string = '\x1B[?25h'; // eslint-disable-line unicorn/no-hex-escape

export interface ReporterInterface extends ModuleInterface {
  render(code: number): string;
  start(loader: ReportLoader): this;
  stop(): this;
  update(): this;
}

export default class Reporter<To extends Options> extends Module<To> implements ReporterInterface {
  instance: Timer = 0;

  loader: ReportLoader | null = null;

  /**
   * Create an indentation based on the defined length.
   */
  indent(length: number): string {
    return '  '.repeat(length);
  }

  /**
   * Render the output by looping over all tasks and messages.
   */
  render(code: number = 0): string {
    if (!this.loader) {
      return CURSOR;
    }

    const {
      debug = false,
      debugs = [],
      errors = [],
      footer = '',
      header = '',
      logs = [],
      silent = false,
      tasks = [],
    } = this.loader();
    const output: string[] = [];
    const verbose = !silent;

    if (header && verbose) {
      output.push(header);
    }

    // Tasks first
    if (tasks.length > 0 && verbose) {
      tasks.forEach((task) => {
        output.push(...this.renderTask(task, 0));
      });
    }

    // Debugs second
    if (debugs.length > 0 && debug) {
      output.push('');

      debugs.forEach((log) => {
        output.push(this.renderMessage(log));
      });
    }

    // Messages last
    const messages = (code === 0) ? logs : errors;

    if (messages.length > 0) {
      if (messages[0] !== '') {
        output.push('');
      }

      messages.forEach((log) => {
        output.push(this.renderMessage(log));
      });

      if (messages[messages.length - 1] !== '') {
        output.push('');
      }
    }

    if (footer && verbose) {
      output.push(footer);
    }

    // Show terminal cursor
    output.push(CURSOR);

    return output.join('\n').trim();
  }

  /**
   * Render a debug, log, or error message.
   */
  renderMessage(message: string): string {
    return message;
  }

  /**
   * Render a single task including its title and status.
   * If sub-tasks or sub-routines exist, render them recursively.
   */
  renderTask(task: TaskInterface, level: number = 0, suffix: string = ''): string[] {
    const output: string[] = [];

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
      let pendingTask: TaskInterface | null = null;
      let runningTask: TaskInterface | null = null;
      let failedTask: TaskInterface | null = null;
      let passed = 0;

      task.subtasks.forEach((subTask) => {
        if (subTask.isPending() && !pendingTask) {
          pendingTask = subTask;

        } else if (subTask.isRunning() && !runningTask) {
          runningTask = subTask;

        } else if (subTask.hasFailed() && !failedTask) {
          failedTask = subTask;

        } else if (subTask.hasPassed() || subTask.isSkipped()) {
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
      output.push(`${this.indent(level + 2)}${chalk.gray(task.statusText)}`);
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
  renderStatus(task: TaskInterface): string {
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
  start(loader: ReportLoader): this {
    if (this.instance) {
      clearInterval(this.instance);
    }

    if (!loader || typeof loader !== 'function') {
      throw new TypeError('A loader is required to render console output.');
    }

    this.loader = loader;

    /* istanbul ignore next */
    this.instance = setInterval(() => { this.update(); }, REFRESH_RATE);

    return this;
  }

  /**
   * Stop and clear the output process.
   */
  stop(): this {
    clearInterval(this.instance);

    logUpdate.clear();

    return this;
  }

  /**
   * Update and flush the output.
   */
  update(): this {
    const output = this.render();

    if (output) {
      logUpdate(output);
    }

    return this;
  }
}
