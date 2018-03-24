/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Module from './Module';
import { ToolInterface } from './Tool';

export const DEFAULT_PLUGIN_PRIORITY: number = 100;

export interface PluginInterface {
  tool: ToolInterface;
  bootstrap(): void;
}

export default class Plugin<To extends object> extends Module<To> {
  priority: number = DEFAULT_PLUGIN_PRIORITY;

  tool: ToolInterface | null = null;

  bootstrap() {}
}
