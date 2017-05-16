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
    super('root', 'Pipeline', tool.config);

    this.tool = tool;
  }

  /**
   * Load tasks to be used by the user interface renderer.
   */
  loadTasks = () => this.subroutines;

  /**
   * Execute all subroutines in order.
   */
  run(initialValue: Result = null, context: Object = {}): ResultPromise {
    this.context = context;

    return this.serializeSubroutines(initialValue).finally(() => {
      this.tool.closeConsole();
    });
  }
}
