/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Pipeline from './Pipeline';
import Routine from './Routine';

import type { Command as VorpalCommand } from 'vorpal'; // eslint-disable-line
import type { GlobalConfig, Result } from './types';

// We purposefully do not support all methods
const INHERIT_METHODS: string[] = [
  'description', 'alias', 'option', 'types', 'hidden', 'help', 'validate', 'autocomplete',
];

export default class Command {
  command: VorpalCommand;
  pipeline: Pipeline;

  constructor(command: VorpalCommand, globalConfig: GlobalConfig) {
    this.command = command;

    // Instantiate a pipeline for this specific command
    this.pipeline = new Pipeline(globalConfig);

    // Generate methods that pipe to the base vorpal command
    INHERIT_METHODS.forEach((method: string) => {
      // $FlowIgnore
      this[method] = (...args: *[]) => {
        // $FlowIgnore
        this.command[method](...args);

        return this;
      };
    });
  }

  /**
   * Pass routines to the current pipeline.
   */
  routine(...routines: Routine[]): this {
    this.pipeline.pipe(...routines);

    return this;
  }

  /**
   * Run the command by executing the pipeline.
   */
  run(value: Result, context: Object = {}) {
    return this.pipeline.run(value, context);
  }
}
