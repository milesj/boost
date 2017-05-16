/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Pipeline from './Pipeline';
import Routine from './Routine';
import Tool from './Tool';

import type { Command as VorpalCommand } from 'vorpal'; // eslint-disable-line
import type { Result } from './types';

export default class Command {
  command: VorpalCommand;
  routines: Routine[] = [];

  constructor(command: VorpalCommand) {
    this.command = command;
  }

  /**
   * Define an alias for the current command.
   */
  alias(...aliases: string[]): this {
    this.command.alias(...aliases);

    return this;
  }

  /**
   * Define a tab autocomplete list.
   */
  autocomplete(list: *): this {
    this.command.autocomplete(list);

    return this;
  }

  /**
   * Define a description for the current command.
   */
  description(description: string): this {
    this.command.description(description);

    return this;
  }

  /**
   * Define an option (or argument) for the current command.
   */
  option(...args: *[]): this {
    this.command.option(...args);

    return this;
  }

  /**
   * Persist routines to later pass to the current pipeline.
   */
  routine(...routines: Routine[]): this {
    this.routines.push(...routines);

    return this;
  }

  /**
   * Run the command by executing the pipeline.
   */
  run(value: Result, context: Object = {}) {
    const { routines } = this;

    // Setup the build tool instance
    const tool = new Tool('NAME'); // TODO

    tool.loadConfig();
    tool.loadPlugins();

    // Setup and run the pipeline
    const pipeline = new Pipeline(tool);

    pipeline.pipe(...routines);

    return pipeline.run(value, context);
  }

  /**
   * Define a mapping of types to options.
   */
  types(types: *): this {
    this.command.types(types);

    return this;
  }

  /**
   * Validate user input before running the command.
   */
  validate(callback: *): this {
    this.command.validate(callback);

    return this;
  }
}
