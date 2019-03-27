import BaseEvent from './BaseEvent';

export default class BailEvent<Args extends unknown[]> extends BaseEvent<Args, boolean | void> {
  /**
   * Synchronously execute listeners with the defined arguments.
   * If a listener returns `false`, the loop with be aborted early.
   */
  emit(args: Args): this {
    Array.from(this.listeners).some(listener => listener(...args) === false);

    return this;
  }
}
