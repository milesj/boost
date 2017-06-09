/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Vorpal from 'vorpal';
import Command from 'vorpal/dist/command';
import Pipeline from './Pipeline';
import Routine from './Routine';
import Tool from './Tool';
import { APP_NAME_PATTERN } from './constants';

import type { CommandOptions } from './types';

// Add routine support to Vorpal's command
// $FlowIgnore
Command.prototype.pipe = function pipe(...routines: Routine[]) {
  if (this.routines) {
    this.routines.push(...routines);
  } else {
    this.routines = routines;
  }

  return this;
};

export default class App extends Vorpal {
  name: string;

  constructor(name: string) {
    super();

    if (!name || typeof name !== 'string') {
      throw new Error('A unique application name is required for Boost.');

    } else if (!name.match(APP_NAME_PATTERN)) {
      throw new Error('Invalid application name. May only contain dashes and lowercase characters.');
    }

    this.name = name;
  }

  /**
   * Register a command and define the action used to run the pipeline.
   */
  command(format: string, description?: string = '', options?: Object = {}): typeof Command {
    const command = super.command(format, description, options);
    const appName = this.name;

    // The action "this" is of CommandInstance, not Command
    command.action(function runCommand(opts: CommandOptions) {
      const context = {};

      // Setup the build tool instance
      const tool = new Tool(appName)
        .setCommand(opts)
        .loadConfig()
        .loadPlugins();

      // Setup and run the pipeline
      const pipeline = new Pipeline(tool);

      if (this.commandObject.routines) {
        pipeline.pipe(...this.commandObject.routines);
      }

      return pipeline.run(opts, context);
    });

    return command;
  }

  /**
   * Run the application and execute the command.
   */
  run(): this {
    this
      .delimiter(`${this.name}$ `)
      .parse(process.argv);

    return this;
  }
}
