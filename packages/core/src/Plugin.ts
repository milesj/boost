/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import optimal, { Builder, Blueprint } from 'optimal';
import Tool from './Tool';

export const DEFAULT_PLUGIN_PRIORITY = 100;

export default class Plugin<Options extends object = {}> {
  moduleName: string = '';

  name: string = '';

  options: Options;

  priority: number = DEFAULT_PLUGIN_PRIORITY;

  // @ts-ignore Set after instantiation
  tool: Tool<any>;

  constructor(options: Partial<Options> = {}) {
    this.options = optimal(options, this.blueprint(), {
      name: this.constructor.name,
    });
  }

  /**
   * Define an optimal blueprint in which to validate and build the
   * options passed to the constructor.
   */
  blueprint(): { [K in keyof Options]: Builder<any> | Blueprint } {
    return {} as any;
  }

  /**
   * Called once the plugin has been loaded by the tool.
   */
  bootstrap() {}
}
