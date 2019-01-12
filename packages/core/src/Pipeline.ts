/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import exit from 'exit';
import Context from './Context';
import CrashLogger from './CrashLogger';
import ExitError from './ExitError';
import Routine from './Routine';
import CoreTool from './Tool';

export default class Pipeline<Ctx extends Context, Tool extends CoreTool<any>> extends Routine<
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

    // Child routines should start at 0
    this.metadata.depth = -1;

    this.setContext(context);
  }

  /**
   * Execute all routines in order.
   */
  run<T>(initialValue?: T): Promise<any> {
    const { console: cli } = this.tool;

    this.tool.debug('Running pipeline');

    cli.start([this.routines, initialValue]);

    return this.serializeRoutines(initialValue)
      .then(result => {
        cli.stop();

        process.exitCode = 0;

        return result;
      })
      .catch(error => {
        cli.stop(error);

        new CrashLogger(this.tool).log(error);

        if (error instanceof ExitError) {
          exit(error.code);
        } else {
          exit(1);
        }

        return error;
      });
  }
}
