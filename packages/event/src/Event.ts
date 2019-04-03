import BaseEvent from './BaseEvent';
import { Scope } from './types';

export default class Event<Args extends unknown[]> extends BaseEvent<Args, void> {
  /**
   * Synchronously execute listeners with the defined arguments.
   */
  emit(args: Args, scope?: Scope) {
    Array.from(this.getListeners(scope)).forEach(listener => {
      listener(...args);
    });
  }
}
