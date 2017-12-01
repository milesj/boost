/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type Tool from './Tool';

const DEFAULT_PLUGIN_PRIORITY: number = 100;

export default class Plugin<To: Object = {}> {
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
