/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import chalk from 'chalk';
import ExitError from './ExitError';

import type Reporter from './Reporter';
import type { TasksLoader } from './types';

// const INTERRUPT_CODE: number = 130;

export default class Console<Tr: Reporter<*>> {
  debugs: string[] = [];

  debugGroups: string[] = [];

  errors: string[] = [];

  logs: string[] = [];

  reporter: Tr;

  constructor(reporter: Tr) {
    this.reporter = reporter;

    // Avoid binding listeners while testing
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    let interrupted = false;
    const signalHandler = () => {
      // Exit without an error
      if (interrupted) {
        this.exit('Process has been terminated.', 0);
      } else {
        this.log(chalk.yellow('Press Ctrl+C to exit.'));
        interrupted = true;
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
    this.debugs.push(`${chalk.blue('[debug]')}${this.reporter.indent(this.debugGroups.length)} ${message}`);
  }

  /**
   * Display the final output to stdout.
   */
  displayOutput() {
    console.log('OUT OCCURRED');
  }

  /**
   * Display a caught error to stderr.
   */
  displayError(error?: ?Error = null) {
    console.error('ERROR OCCURRED');
  }

  /**
   * Display an uncaught error, unhandled promise, or general forced exit to stderr.
   */
  displayExit(code: number) {
    console.error('EXIT OCCURRED');
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
  exit(message: string | Error, code?: number = 1) {
    const error = (message instanceof Error) ? message : new ExitError(message, code);
    const errorCode = (typeof error.code === 'number') ? error.code : code;

    // Show terminal cursor
    // eslint-disable-next-line unicorn/no-hex-escape
    this.log('\x1B[?25h');

    // TODO, send final output

    // Exit the node process
    if (process.env.NODE_ENV !== 'test') {
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(errorCode);
    }
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
  start(loader: TasksLoader<*>) {
    this.reporter.start(loader);
  }

  /**
   * Start a debug capturing group, which will indent all incoming debug messages.
   */
  startDebugGroup(group: string) {
    this.debug(chalk.gray(`[${group}]`));
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
    this.debugGroups.pop();
  }

  /**
   * Force a rendering update.
   */
  update() {
    this.reporter.update();
  }
}
