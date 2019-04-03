import BaseEvent from './BaseEvent';
import { Scope } from './types';

export default class BailEvent<Args extends unknown[]> extends BaseEvent<Args, boolean | void> {
  /**
   * Synchronously execute listeners with the defined arguments.
   * If a listener returns `false`, the loop with be aborted early,
   * and the emitter will return `true` (for bailed).
   */
  emit(args: Args, scope?: Scope): boolean {
    return Array.from(this.getListeners(scope)).some(listener => listener(...args) === false);
  }
}
