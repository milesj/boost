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
  constructor(tool: ToolInterface, context?: Tx) {
    super('root', 'Pipeline');

    if (tool instanceof Tool) {
      tool.initialize();
    } else {
      throw new TypeError('A build `Tool` instance is required to operate the pipeline.');
    }

    this.tool = tool;
    this.tool.debug('Instantiating pipeline');

    if (context) {
      this.setContext(context);
    }
  }

  /**
   * Execute all routines in order.
   */
  run<T>(initialValue?: T): Promise<any> {
    const { console: cli } = this.tool;

    this.tool.debug('Running pipeline');

    cli.emit('start', [this.routines]);

    return this.serializeRoutines(initialValue)
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
