// @ts-nocheck
/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import chalk from 'chalk';
import optimal, { bool, string } from 'optimal';
import util from 'util';
import Emitter, { EmitterInterface } from './Emitter';
import ExitError from './ExitError';
import { TaskInterface } from './Task';
import { ReporterInterface } from './Reporter';
import { ConsoleOptions } from './types';

export interface ConsoleInterface extends EmitterInterface {
  options: ConsoleOptions;
  reporter: ReporterInterface;
  error(message: string, ...args: any[]): void;
  log(message: string, ...args: any[]): void;
  start(tasks?: TaskInterface[]): void;
  stop(): void;
  update(): void;
}

export default class Console<Tr extends ReporterInterface> extends Emitter
  implements ConsoleInterface {
  errors: string[] = [];

  interrupted: boolean = false;

  logs: string[] = [];

  options: ConsoleOptions;

  reporter: Tr;

  constructor(reporter: Tr, options: Partial<ConsoleOptions> = {}) {
    super();

    this.reporter = reporter;
    this.options = optimal(options, {
      footer: string().empty(),
      header: string().empty(),
      silent: bool(),
    });

    // Avoid binding listeners while testing
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    // Start early so we may capture uncaught/unhandled
    this.start();
  }

  /**
   * Add a message to the error log.
   */
  error(message: string, ...args: any[]) {
    this.errors.push(util.format(message, ...args));
  }
}
