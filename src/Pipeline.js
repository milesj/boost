/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Routine from './Routine';

import type { RoutineConfig, Result, ResultPromise } from './types';

export default class Pipeline extends Routine {

  constructor(name: string, config: RoutineConfig = {}) {
    super(name, config);

    // Inherit global config as well
    this.globalConfig = config;
  }

  /**
   * Execute the routines in sequential order while passing the result
   * from the previous routine to the next routine. The initial value can
   * be passed by the consumer.
   */
  execute(initialValue: Result<*> = null): ResultPromise<*> {
    return this.serializeSubroutines(initialValue);
  }
}
