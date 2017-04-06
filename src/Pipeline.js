/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Routine from './Routine';
import Console from './Console';
import { DEFAULT_GLOBALS } from './constants';

import type { GlobalConfig, Result, ResultPromise } from './types';

export default class Pipeline extends Routine {
  constructor(name: string, globalConfig: GlobalConfig = DEFAULT_GLOBALS) {
    super(name, name, globalConfig.config);

    // Define the global config
    this.global = globalConfig;

    // Initialize the root console
    this.console = new Console(globalConfig);
  }

  /**
   * Execute all subroutines in order.
   */
  run(initialValue: Result<*> = null): ResultPromise<*> {
    return this.serializeSubroutines(initialValue).finally(() => {
      this.console.render();
      this.console.close();
    });
  }
}
