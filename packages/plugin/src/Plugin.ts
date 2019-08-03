import { Contract } from '@boost/common';
import { DEFAULT_PLUGIN_PRIORITY } from './constants';
import { Pluggable } from './types';

export default abstract class Plugin<Options extends object = {}> extends Contract<Options>
  implements Pluggable<Options> {
  name: string = '';

  priority: number = DEFAULT_PLUGIN_PRIORITY;

  source: string = '';

  /**
   * Called once the plugin has been loaded.
   */
  bootstrap() {}
}
