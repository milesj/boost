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
import type Reporter from './Reporter';
import type { ToolConfig } from './types';

export default class Pipeline<Tp: Plugin<Object>, Tx: Object = {}> extends Routine<ToolConfig, Tx> {
  constructor(tool: Tool<Tp, Reporter>) {
    super('root', 'Pipeline', tool ? tool.config : { ...DEFAULT_TOOL_CONFIG });

    if (tool instanceof Tool) {
      tool.initialize();
    } else {
      throw new TypeError('A build `Tool` instance is required to operate the pipeline.');
    }

    this.tool = tool;
  }

  /**
   * Execute all subroutines in order.
   */
  run(initialValue: *, context?: Tx): Promise<*> {
    const { console: cli } = this.tool;

    // $FlowIgnore
    this.context = context || {};

    cli.start(this.subroutines);

    return this.serializeSubroutines(initialValue)
      .then((result) => {
        cli.exit(null, 0);
      })
      .catch((error) => {
        cli.exit(error, 1);
      });
  }
}
