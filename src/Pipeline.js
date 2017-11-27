/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Routine from './Routine';
import Tool from './Tool';
import { DEFAULT_TOOL_CONFIG } from './constants';

import type Plugin from './Plugin';
import type Reporter from './Reporter';
import type Task from './Task';
import type { ToolConfig } from './types';

export default class Pipeline<Tx: Object, Tp: Plugin<*>> extends Routine<ToolConfig, Tx> {
  constructor(tool: Tool<Tp, Reporter<Tx>>) {
    super('root', 'Pipeline', tool ? tool.config : { ...DEFAULT_TOOL_CONFIG });

    if (tool instanceof Tool) {
      tool.initialize();
    } else {
      throw new TypeError('A build `Tool` instance is required to operate the pipeline.');
    }

    this.tool = tool;
  }

  /**
   * Load tasks to be used by the CLI reporter.
   */
  loadTasks(): Task<*, Tx>[] {
    return this.subroutines;
  }

  /**
   * Execute all subroutines in order.
   */
  run(initialValue: *, context: Tx): Promise<*> {
    const { console: cli } = this.tool;

    this.context = context || {};

    cli.start(this.loadTasks);

    return this.serializeSubroutines(initialValue)
      .then((result) => {
        cli.displayOutput();

        // Return so consumer may use it
        return result;
      })
      .catch((error) => {
        cli.displayError(error);

        // Do not throw as we handled it
        return error;
      });
  }
}
