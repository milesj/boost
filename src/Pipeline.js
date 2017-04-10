/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Routine from './Routine';
import Renderer from './Renderer';
import Console from './Console';
import { DEFAULT_GLOBALS } from './constants';

import type { GlobalConfig, Result, ResultPromise } from './types';

export default class Pipeline extends Routine {
  constructor(name: string, globalConfig: GlobalConfig = DEFAULT_GLOBALS) {
    super(name, name, globalConfig.config);

    // Define the global config
    this.global = globalConfig;

    // Initialize the root console
    this.console = new Console(new Renderer(this.loadTasks), globalConfig);
  }

  /**
   * Load task results to be used by the console renderer.
   */
  loadTasks = () => this.subroutines;

  /**
   * Execute all subroutines in order.
   */
  run(initialValue: Result = null, context: Object = {}): ResultPromise {
    this.context = context;

    return this.serializeSubroutines(initialValue).finally(() => {
      this.console.close();
    });
  }
}
