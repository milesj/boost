/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Module from './Module';
import Tool from './Tool';

const DEFAULT_PLUGIN_PRIORITY: number = 100;

export default class Plugin<To> extends Module<To> {
  priority: number = DEFAULT_PLUGIN_PRIORITY;

  tool: Tool<object, object>;

  bootstrap() {}
}
