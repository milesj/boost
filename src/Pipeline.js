/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Routine from './Routine';
import executeSequentially from './helpers/executeSequentially';

import type { RoutineConfig, Result, ResultPromise } from './types';

export default class Pipeline {
  configurations: { [key: string]: RoutineConfig } = {};
  routines: Routine[] = [];

  /**
   * Execute the routines in sequential order while passing the result
   * from the previous routine to the next routine. The initial value can
   * be passed by the consumer.
   */
  execute(initialValue: Result<*> = null): ResultPromise<*> {
    try {
      return executeSequentially(this.routines, initialValue, this.executeRoutine);
    } catch (e) {
      throw e;
    }
  }

  /**
   * Execute the routine with the provided value.
   */
  executeRoutine(value: Result<*>, routine: Routine): ResultPromise<*> {
    return routine.execute(value);
  }

  /**
   * Add a new routine with a unique name.
   */
  pipe(name: string, routine: Routine): this {
    if (!(routine instanceof Routine)) {
      throw new TypeError(`Routine "${name}" must be an instance of \`Routine\`.`);
    }

    // Inherit configurations if they exists
    routine.configure(this.configurations[name] || {});

    this.routines.push(routine);

    return this;
  }
}
