/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Context from './Context';
import CrashLogger from './CrashLogger';
import Routine from './Routine';
import Tool from './Tool';
import { ToolConfig } from './types';

export default class Pipeline<Ctx extends Context> extends Routine<Ctx, ToolConfig> {
  constructor(tool: Tool, context: Ctx) {
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
  async run<T>(initialValue?: T): Promise<any> {
    const { console: cli } = this.tool;
    let result = null;

    this.tool.debug('Running pipeline');

    cli.start([this.routines]);

    try {
      result = await this.serializeRoutines(initialValue);
      cli.exit(null, 0);
    } catch (error) {
      result = error;
      cli.exit(error, 1);

      // Create a log of the failure
      new CrashLogger(this.tool).log(error);
    }

    return result;
  }
}
