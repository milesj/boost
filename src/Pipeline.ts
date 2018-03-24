/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable promise/always-return */

import Routine from './Routine';
import Tool, { ToolInterface } from './Tool';
import { PluginInterface } from './Plugin';
import Reporter from './Reporter';
import { DEFAULT_TOOL_CONFIG } from './constants';
import { Context, ToolConfig } from './types';

export default class Pipeline<Tp extends PluginInterface, Tx extends Context> extends Routine<
  ToolConfig,
  Tx
> {
  constructor(tool: ToolInterface) {
    super('root', 'Pipeline', tool ? tool.config : { ...DEFAULT_TOOL_CONFIG });

    if (tool instanceof Tool) {
      tool.initialize();
    } else {
      throw new TypeError('A build `Tool` instance is required to operate the pipeline.');
    }

    this.tool = tool;
    this.tool.debug('Instantiating pipeline');
  }

  /**
   * Execute all subroutines in order.
   */
  run(initialValue: any, context: Tx): Promise<any> {
    const { console: cli } = this.tool;

    this.tool.debug('Running pipeline');

    this.context = context;

    cli.start(this.subroutines);

    return this.serializeSubroutines(initialValue)
      .then(result => {
        cli.exit(null, 0);
      })
      .catch(error => {
        cli.exit(error, 1);
      });
  }
}
