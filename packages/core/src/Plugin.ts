/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Module from './Module';
import Tool from './Tool';

export const DEFAULT_PLUGIN_PRIORITY: number = 100;

export default class Plugin<Options> extends Module<Options> {
  priority: number = DEFAULT_PLUGIN_PRIORITY;

  // @ts-ignore Set after instantiation
  tool: Tool;

  bootstrap() {}
}
