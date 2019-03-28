import BaseEvent from './BaseEvent';
import { Scope } from './types';

export default class BailEvent<Args extends unknown[]> extends BaseEvent<Args, boolean | void> {
  /**
   * Synchronously execute listeners with the defined arguments.
   * If a listener returns `false`, the loop with be aborted early.
   */
  emit(args: Args, scope?: Scope): this {
    Array.from(this.getListeners(scope)).some(listener => listener(...args) === false);

    return this;
  }
}
