/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Vorpal from 'vorpal';
import Command from './Command';

const APP_NAME_PATTERN: RegExp = /^[a-z-]+$/;

export default class App {
  name: string;
  vorpal: Vorpal;

  constructor(name: string) {
    if (!name || typeof name !== 'string') {
      throw new Error('A unique application name is required for Boost.');

    } else if (!name.match(APP_NAME_PATTERN)) {
      throw new Error('Invalid application name. May only contain dashes and lowercase characters.');
    }

    this.name = name;
    this.vorpal = new Vorpal();
  }

  /**
   * Register an executable command using a callback.
   */
  command(format: string, description: string = ''): Command {
    return new Command(this.name, this.vorpal.command(format, description));
  }

  /**
   * Run the application and execute the command.
   */
  run(): this {
    this.vorpal
      .delimiter(`${this.name}$ `)
      .parse(process.argv);

    return this;
  }
}
