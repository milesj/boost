import { Contract } from '@boost/common';
import { DEFAULT_PLUGIN_PRIORITY } from './constants';
import { Pluggable } from './types';

export default abstract class Plugin<Options extends object = {}> extends Contract<Options>
  implements Pluggable<Options> {
  moduleName: string = '';

  name: string = '';

  priority: number = DEFAULT_PLUGIN_PRIORITY;

  /**
   * Called once the plugin has been loaded.
   */
  bootstrap() {}
}
