/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Routine from './Routine';
import Tool from './Tool';
import { DEFAULT_TOOL_CONFIG } from './constants';

import type Plugin from './Plugin';
import type Renderer from './Renderer';
import type { Result, ResultPromise, ToolConfig } from './types';

export default class Pipeline<TP: Plugin<*>, TR: Renderer> extends Routine<ToolConfig> {
  tool: Tool<TP, TR>;

  constructor(tool: Tool<TP, TR>) {
    super('root', 'Pipeline', tool ? tool.config : { ...DEFAULT_TOOL_CONFIG });

    if (tool instanceof Tool) {
      tool.initialize();
    } else {
      throw new TypeError('A build `Tool` instance is required to operate the pipeline.');
    }

    this.tool = tool;
  }

  /**
   * Load tasks to be used by the CLI renderer.
   */
  loadTasks = () => this.subroutines;

  /**
   * Execute all subroutines in order.
   */
  run(initialValue: Result, context?: Object = {}): ResultPromise {
    this.context = context;
    this.tool.openConsole(this.loadTasks);

    return this.serializeSubroutines(initialValue).finally(() => {
      this.tool.closeConsole();
    });
  }
}
