/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Vorpal from 'vorpal';
import Command from './Command';

import type { AppConfig } from './types';

export default class App {
  config: AppConfig;
  name: string;
  vorpal: Vorpal;

  constructor(name: string, config: AppConfig = {}) {
    if (!name || typeof name !== 'string') {
      throw new Error('A unique name is required for Boost applications.');
    }

    this.name = name;
    this.config = config;
    this.vorpal = new Vorpal();
  }

  /**
   * Register an executable command using a callback.
   */
  command(format: string, callback: (Command) => void): this {
    if (typeof callback !== 'function') {
      throw new Error('A callback function is required when creating commands.');
    }

    callback(new Command(this.name, this.vorpal.command(format)));

    return this;
  }

  run(): this {
    this.vorpal
      .delimiter(`${this.name}$ `)
      // .show()
      .parse(process.argv);

    return this;
  }
}
