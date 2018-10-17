/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Context from './Context';
import CrashLogger from './CrashLogger';
import Routine from './Routine';
import CoreTool from './Tool';

export default class Pipeline<Ctx extends Context, Tool extends CoreTool<any, any>> extends Routine<
  Ctx,
  Tool,
  Tool['config']
> {
  constructor(tool: Tool, context: Ctx) {
    super('root', 'Pipeline');

    if (tool instanceof CoreTool) {
      tool.initialize();
    } else {
      throw new TypeError('A `Tool` instance is required to operate the pipeline.');
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
      // Create a log of the failure
      new CrashLogger(this.tool).log(error);

      result = error;
      cli.exit(error, 1);
    }

    return result;
  }
}
