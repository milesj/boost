/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { Options } from 'optimal';
import Module, { ModuleInterface } from './Module';
import { ToolInterface } from './Tool';

export const DEFAULT_PLUGIN_PRIORITY: number = 100;

export interface PluginInterface extends ModuleInterface {
  priority: number;
  tool: ToolInterface;
  bootstrap(): void;
}

export default class Plugin<To extends Options> extends Module<To> implements PluginInterface {
  priority: number = DEFAULT_PLUGIN_PRIORITY;

  // @ts-ignore Set after instantiation
  tool: ToolInterface;

  bootstrap() {}
}
