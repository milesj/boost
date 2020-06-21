import { Contract } from '@boost/common';
import Tool from './Tool';

export const DEFAULT_PLUGIN_PRIORITY = 100;

export default abstract class Plugin<Options extends object = {}> extends Contract<Options> {
  moduleName: string = '';

  name: string = '';

  priority: number = DEFAULT_PLUGIN_PRIORITY;

  // @ts-expect-error
  tool: Tool<any>;

  /**
   * Called once the plugin has been loaded by the tool.
   */
  bootstrap() {}
}
