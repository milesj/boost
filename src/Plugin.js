/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { DEFAULT_PLUGIN_PRIORITY } from './constants';

import type Tool from './Tool';

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
