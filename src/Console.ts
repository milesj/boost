/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import readline from 'readline';
import chalk from 'chalk';
import Emitter, { EmitterInterface } from './Emitter';
import ExitError from './ExitError';

export interface ConsoleOptions {
  [key: string]: any;
}

export interface ConsoleInterface extends EmitterInterface {
  options: ConsoleOptions;
  // error(message: string, ...args: any[]): void;
  exit(message: string | Error | null, code: number): void;
  // log(message: string, ...args: any[]): void;
  // start(tasks?: TaskInterface[]): void;
  // stop(): void;
  // update(): void;
}

export default class Console extends Emitter {
  interrupted: boolean = false;

  options: ConsoleOptions = {};

  // rl: readline.ReadLine;

  constructor(options: ConsoleOptions = {}) {
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

    // this.rl = readline.createInterface({
    //   input: process.stdin,
    //   output: process.stdout,
    // });

    // this.rl.on('SIGINT', () => {
    //   this.rl.pause();
    //   this.rl.question('Are you sure you want to exit? [Y/n]', answer => {
    //     if (answer === 'Y') {
    //       this.rl.close();
    //     } else {
    //       this.rl.resume();
    //     }
    //   });
    // });
  }

  /**
   * Force exit the application.
   */
  /* istanbul ignore next */
  exit(message: string | Error | null, code: number = 1) {
    let errorCode = code;

    if (message !== null) {
      const error = message instanceof Error ? message : new ExitError(message, code);

      if (error instanceof ExitError && typeof error.code === 'number') {
        errorCode = error.code;
      }

      this.emit('stop', [error, errorCode]);
    }

    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(errorCode);
  }
}
