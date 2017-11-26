/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable promise/always-return */

import Routine from './Routine';
import Tool from './Tool';
import { DEFAULT_TOOL_CONFIG } from './constants';

import type Plugin from './Plugin';
import type Renderer from './Renderer';
import type Task from './Task';
import type { Result, ResultPromise, ToolConfig } from './types';

export default class Pipeline<Tx: Object, Tp: Plugin<*>> extends Routine<ToolConfig, Tx> {
  constructor(tool: Tool<Tp, Renderer<Tx>>) {
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
  loadTasks(): Task<*, Tx>[] {
    return this.subroutines;
  }

  /**
   * Execute all subroutines in order.
   */
  run(initialValue: Result, context: Tx): ResultPromise {
    const { console: cli } = this.tool;

    this.context = context || {};

    cli.start(this.loadTasks);

    return this.serializeSubroutines(initialValue)
      .then(() => {
        cli.displayOutput();
        cli.stop();
      })
      .catch((error) => {
        cli.displayError(error);
        cli.stop();
      });
  }
}
