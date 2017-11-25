/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Tool from './Tool';
import { DEFAULT_PLUGIN_PRIORITY } from './constants';

export default class Plugin<To: Object> {
  moduleName: string = '';

  name: string = '';

  options: To;

  priority: number = DEFAULT_PLUGIN_PRIORITY;

  tool: Tool<*, *>;

  constructor(options?: To) {
    this.options = { ...options };
  }

  bootstrap() {}
}
