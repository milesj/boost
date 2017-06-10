/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Tool from './Tool';
import { DEFAULT_PLUGIN_PRIORITY } from './constants';

import type { Config } from './types';

export default class Plugin {
  config: Config;
  priority: number = DEFAULT_PLUGIN_PRIORITY;
  tool: ?Tool = null;

  constructor(config: Config = {}) {
    this.config = config;
  }

  bootstrap(tool: Tool) {
    this.tool = tool;
  }
}
