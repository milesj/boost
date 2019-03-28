import BaseEvent from './BaseEvent';
import { Scope } from './types';

export default class ParallelEvent<Args extends unknown[]> extends BaseEvent<
  Args,
  Promise<unknown>
> {
  /**
   * Asynchronously execute listeners for with the defined arguments.
   * Will return a promise with an array of each listener result.
   */
  emit(args: Args, scope?: Scope): Promise<unknown[]> {
    return Promise.all(Array.from(this.getListeners(scope)).map(listener => listener(...args)));
  }
}
