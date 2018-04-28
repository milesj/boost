/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Routine from './Routine';
import Tool, { ToolInterface } from './Tool';
import { PluginInterface } from './Plugin';
import { Context, ToolConfig } from './types';

export default class Pipeline<Tp extends PluginInterface, Tx extends Context> extends Routine<
  ToolConfig,
  Tx
> {
  constructor(tool: ToolInterface) {
    super('root', 'Pipeline');

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
  run<T>(context: Tx, initialValue: T | null = null): Promise<any> {
    const { console: cli } = this.tool;

    this.tool.debug('Running pipeline');

    this.context = context;

    cli.emit('start', [this.subroutines]);

    return this.serializeSubroutines(initialValue)
      .then(result => {
        cli.exit(null, 0);

        return result;
      })
      .catch(error => {
        cli.exit(error, 1);

        return error;
      });
  }
}
