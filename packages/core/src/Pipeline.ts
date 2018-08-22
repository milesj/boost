/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Context from './Context';
import CrashLogger from './CrashLogger';
import Routine from './Routine';
import Tool from './Tool';
import { ToolConfig } from './types';

export default class Pipeline<Tx extends Context> extends Routine<Tx, ToolConfig> {
  constructor(tool: Tool, context: Tx) {
    super('root', 'Pipeline');

    if (tool instanceof Tool) {
      tool.initialize();
    } else {
      throw new TypeError('A build `Tool` instance is required to operate the pipeline.');
    }

    this.tool = tool;
    this.tool.debug('Instantiating pipeline');

    this.setContext(context);
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

        // Create a log of the failure
        new CrashLogger(this.tool).log(error);

        return error;
      });
  }
}
