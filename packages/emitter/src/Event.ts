import BaseEvent from './BaseEvent';

export default class Event<Args extends unknown[]> extends BaseEvent<Args, void> {
  /**
   * Synchronously execute listeners with the defined arguments.
   */
  emit(args: Args): this {
    Array.from(this.listeners).forEach(listener => {
      listener(...args);
    });

    return this;
  }
}
