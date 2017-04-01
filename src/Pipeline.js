/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import chalk from 'chalk';
import readline from 'readline';
import Routine from './Routine';

import type { RoutineConfig, Result, ResultPromise } from './types';

export default class Pipeline extends Routine {
  console: readline.Interface;

  constructor(name: string, config: RoutineConfig = {}) {
    super(name, config);

    // Inherit global config as well
    this.globalConfig = config;

    this.console = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * Execute the routines in sequential order while passing the result
   * from the previous routine to the next routine. The initial value can
   * be passed by the consumer.
   */
  execute(initialValue: Result<*> = null): ResultPromise<*> {
    return this.serializeSubroutines(initialValue);
  }

  /**
   * Request input from the console.
   */
  askQuestion(question: string): Promise<string> {
    return new Promise((resolve: (string) => void) => {
      this.console.question(chalk.magenta(question), (answer: string) => {
        resolve(answer);
        this.console.close();
      });
    });
  }

  /**
   * Output a message to the console.
   */
  log(message: string): this {
    this.console.write(message);

    return this;
  }

  /**
   * Output a title for the current routing phase.
   */
  logTitle(step: string, message: string): this {
    return this.log(`${chalk.gray(`[${step}]`)} ${chalk.reset(message)}`);
  }
}
