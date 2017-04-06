/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Routine from './Routine';
import Renderer from './Renderer';
import Console from './Console';
import { DEFAULT_GLOBALS } from './constants';

import type { GlobalConfig, Result, ResultPromise, TreeNode } from './types';

export default class Pipeline extends Routine {
  constructor(name: string, globalConfig: GlobalConfig = DEFAULT_GLOBALS) {
    super(name, name, globalConfig.config);

    // Define the global config
    this.global = globalConfig;

    // Initialize the root console
    this.console = new Console(new Renderer(this.loadTree), globalConfig);
  }

  /**
   * Load tree data to be used by the console renderer.
   */
  loadTree = (): TreeNode[] => this.toTree().routines || [];

  /**
   * Execute all subroutines in order.
   */
  run(initialValue: Result = null): ResultPromise {
    return this.serializeSubroutines(initialValue).finally(() => {
      this.console.close();
    });
  }
}
