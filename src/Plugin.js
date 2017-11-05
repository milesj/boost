/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Tool from './Tool';
import { DEFAULT_PLUGIN_PRIORITY } from './constants';

export default class Plugin<T: Object> {
  moduleName: string = '';

  name: string = '';

  options: T;

  priority: number = DEFAULT_PLUGIN_PRIORITY;

  tool: ?Tool<T> = null;

  constructor(options?: T) {
    this.options = { ...options };
  }

  bootstrap(tool: Tool<T>) {
    this.tool = tool;
  }
}
