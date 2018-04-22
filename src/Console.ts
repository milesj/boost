/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import chalk from 'chalk';
import Emitter, { EmitterInterface } from './Emitter';

export interface ConsoleInterface extends EmitterInterface {
  exit(message: string | Error | null, code: number): void;
}

export default class Console extends Emitter {
  constructor() {
    super();

    // Avoid binding listeners while testing
    if (process.env.NODE_ENV !== 'test') {
      process
        .on('SIGINT', this.handleSignal)
        .on('SIGTERM', this.handleSignal)
        .on('uncaughtException', this.handleFailure)
        .on('unhandledRejection', this.handleFailure);
    }
  }

  /**
   * Handle uncaught exceptions and unhandled rejections that bubble up.
   */
  handleFailure = (error: Error) => {
    this.exit(error, 1, true);
  };

  /**
   * Handle SIGINT and SIGTERM interruptions.
   */
  handleSignal = () => {
    this.exit('Process has been terminated.', 1, true);
  };

  /**
   * Force exit the application.
   */
  exit(message: string | Error | null, code: number = 1, force: boolean = false) {
    let error = null;

    if (message !== null) {
      error = message instanceof Error ? message : new Error(message);
    }

    this.emit('stop', [error, code]);

    if (force) {
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(code);
    } else {
      process.exitCode = code;
    }
  }
}
