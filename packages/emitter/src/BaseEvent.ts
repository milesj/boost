import { EVENT_NAME_PATTERN } from './constants';
import { Listener } from './types';

export default abstract class BaseEvent<Args extends unknown[], Return> {
  listeners: Set<Listener<Args, Return>> = new Set();

  name: string;

  constructor(name: string) {
    if (!name.match(EVENT_NAME_PATTERN)) {
      throw new Error(
        `Invalid event name "${name}". ` +
          'May only contain dashes, periods, and lowercase characters.',
      );
    }

    this.name = name;
  }

  /**
   * Remove all listeners from the event.
   */
  clearListeners(): this {
    this.listeners.clear();

    return this;
  }

  /**
   * Register a listener to the event.
   */
  listen(listener: Listener<Args, Return>): this {
    this.listeners.add(this.validateListener(listener));

    return this;
  }

  /**
   * Register a listener to the event that only triggers once.
   */
  once(listener: Listener<Args, Return>): this {
    const func = this.validateListener(listener);
    const handler: Listener<Args, Return> = (...args: Args) => {
      this.unlisten(handler);

      return func(...args);
    };

    return this.listen(handler);
  }

  /**
   * Remove a listener from the event.
   */
  unlisten(listener: Listener<Args, Return>): this {
    this.listeners.delete(listener);

    return this;
  }

  protected validateListener<L>(listener: L): L {
    if (typeof listener !== 'function') {
      throw new TypeError(`Invalid event listener for "${this.name}", must be a function.`);
    }

    return listener;
  }

  abstract emit(args: unknown): unknown;
}
