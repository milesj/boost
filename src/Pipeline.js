/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Routine from './Routine';
import Tool from './Tool';

import type { Result, ResultPromise } from './types';

export default class Pipeline extends Routine {
  constructor(tool: Tool) {
    super('root', 'Pipeline', tool ? tool.config : {});

    if (!tool || !(tool instanceof Tool)) {
      throw new Error('A build `Tool` instance is required to operate the pipeline.');
    }

    this.tool = tool;
  }

  /**
   * Load tasks to be used by the interface renderer.
   */
  loadTasks = () => this.subroutines;

  /**
   * Execute all subroutines in order.
   */
  run(initialValue: Result, context: Object = {}): ResultPromise {
    this.context = context;

    return this.serializeSubroutines(initialValue || null).finally(() => {
      this.tool.closeConsole();
    });
  }
}
