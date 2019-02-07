import optimal, { predicates, Blueprint, Predicates } from 'optimal';
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
    this.options = optimal(options, this.blueprint(predicates), {
      name: this.constructor.name,
    });
  }

  /**
   * Define an optimal blueprint in which to validate and build the
   * options passed to the constructor.
   */
  blueprint(preds: Predicates): Blueprint<Options> {
    return {} as any;
  }

  /**
   * Called once the plugin has been loaded by the tool.
   */
  bootstrap() {}
}
