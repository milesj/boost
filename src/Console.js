/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import chalk from 'chalk';
import ExitError from './ExitError';

import type Task from './Task';
import type Reporter from './Reporter';
import type { ToolConfig, ToolOptions } from './types';

const DEBUG_COLORS: string[] = [
  'white',
  'cyan',
  'blue',
  'magenta',
  'red',
  'yellow',
  'green',
];

export default class Console<Tr: Reporter<Object>> {
  debugs: string[] = [];

  debugGroups: string[] = [];

  debugIndex: number = -1;

  errors: string[] = [];

  interrupted: boolean = false;

  logs: string[] = [];

  reporter: Tr;

  constructor(reporter: Tr) {
    this.reporter = reporter;

    // Avoid binding listeners while testing
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    const signalHandler = () => {
      if (this.interrupted) {
        this.exit('Process has been terminated.');
      } else {
        this.log(chalk.yellow('Press Ctrl+C again to exit.'));
        this.interrupted = true;
      }
    };

    process
      .on('SIGINT', signalHandler)
      .on('SIGTERM', signalHandler)
      .on('uncaughtException', (error) => {
        this.log(chalk.yellow('Uncaught exception detected!'));
        this.exit(error.message);
      })
      .on('unhandledRejection', (error) => {
        this.log(chalk.yellow('Unhandled promise rejection detected!'));
        this.exit(error.message);
      });
  }

  /**
   * Add a message to the debug log.
   */
  debug(message: string) {
    this.debugs.push(`${chalk.gray('[debug]')}${this.reporter.indent(this.debugGroups.length)} ${message}`);
  }

  /**
   * Add a message to the error log.
   */
  error(message: string) {
    this.errors.push(message);
  }

  /**
   * Force exit the application.
   */
  /* istanbul ignore next */
  exit(message: string | Error | null, code?: number = 1) {
    let errorCode = code;

    // Null messages are always successful
    if (message !== null) {
      const error = (message instanceof Error) ? message : new ExitError(message, code);

      if (typeof error.code === 'number') {
        errorCode = error.code;
      }
    }

    // Show terminal cursor
    this.log('\x1B[?25h'); // eslint-disable-line unicorn/no-hex-escape

    // Stop the renderer
    this.stop();

    // Send final output and exit after buffer is flushed
    (code === 0 ? process.stdout : process.stderr).write(this.reporter.render(code), () => {
      process.exit(errorCode); // eslint-disable-line unicorn/no-process-exit
    });
  }

  /**
   * Add a message to the output log.
   */
  log(message: string) {
    this.logs.push(message);
  }

  /**
   * Start a new console and begin rendering.
   */
  start(config: ToolConfig, options: ToolOptions, tasks: Task<*, *>[]) {
    const { debug, silent } = config;
    const { footer, header } = options;
    const { debugs, errors, logs } = this;

    this.reporter.start(() => ({
      debug,
      debugs,
      errors,
      footer,
      header,
      logs,
      silent,
      tasks,
    }));
  }

  /**
   * Start a debug capturing group, which will indent all incoming debug messages.
   */
  startDebugGroup(group: string) {
    this.debugIndex += 1;

    if (this.debugIndex === DEBUG_COLORS.length) {
      this.debugIndex = 0;
    }

    const color = DEBUG_COLORS[this.debugIndex];

    this.debug(chalk[color](`[${group}]`));
    this.debugGroups.push(group);
  }

  /**
   * Stop rendering and end the console.
   */
  stop() {
    this.reporter.stop();
  }

  /**
   * End the current debug capturing group.
   */
  stopDebugGroup() {
    const color = DEBUG_COLORS[this.debugIndex];
    const group = this.debugGroups.pop();

    this.debug(chalk[color](`[/${group}]`));
    this.debugIndex -= 1;

    if (this.debugIndex < 0) {
      this.debugIndex = DEBUG_COLORS.length - 1;
    }
  }

  /**
   * Force a rendering update.
   */
  update() {
    this.reporter.update();
  }
}
