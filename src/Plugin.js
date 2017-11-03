/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Tool from './Tool';
import { DEFAULT_PLUGIN_PRIORITY } from './constants';

export default class Plugin {
  moduleName: string = '';

  name: string = '';

  options: Object = {};

  priority: number = DEFAULT_PLUGIN_PRIORITY;

  tool: ?Tool = null;

  constructor(options?: Object = {}) {
    this.options = { ...options };
  }

  bootstrap(tool: Tool) {
    this.tool = tool;
  }
}
