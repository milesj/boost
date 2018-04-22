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
  interrupted: boolean = false;

  constructor() {
    super();

    // Avoid binding listeners while testing
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    const signalHandler = () => {
      if (this.interrupted) {
        this.exit('Process has been terminated.');
      } else {
        console.log(chalk.yellow('Press Ctrl+C again to exit.'));
        this.interrupted = true;
      }
    };

    process
      .on('SIGINT', signalHandler)
      .on('SIGTERM', signalHandler)
      .on('uncaughtException', error => {
        this.exit(error);
      })
      .on('unhandledRejection', error => {
        this.exit(error);
      });
  }

  /**
   * Force exit the application.
   */
  exit(message: string | Error | null, code: number = 1) {
    let error = null;

    if (message !== null) {
      error = message instanceof Error ? message : new Error(message);
    }

    this.emit('stop', [error, code]);

    process.exitCode = code;
  }
}
