import { EVENT_NAME_PATTERN } from './constants';
import { ListenerType, Arguments, WaterfallArgument } from './types';

export default class Emitter<T> {
  listeners: { [K in keyof T]?: Set<ListenerType<T[K]>> } = {};

  /**
   * Remove all listeners for the defined event name.
   */
  clearListeners<K extends keyof T>(eventName: K): this {
    this.getListeners(eventName).clear();

    return this;
  }

  /**
   * Synchronously execute listeners for the defined event and arguments.
   */
  emit<K extends keyof T>(eventName: K, args: Arguments<T[K]>): this {
    Array.from(this.getListeners(eventName)).forEach(listener => {
      listener(...args);
    });

    return this;
  }

  /**
   * Synchronously execute listeners for the defined event and arguments.
   * If a listener returns `false`, the loop with be aborted early.
   */
  emitBail<K extends keyof T>(eventName: K, args: Arguments<T[K]>): this {
    Array.from(this.getListeners(eventName)).some(listener => listener(...args) === false);

    return this;
  }

  /**
   * Asynchronously execute listeners for the defined event and arguments.
   * Will return a promise with an array of each listener result.
   */
  emitParallel<K extends keyof T>(eventName: K, args: Arguments<T[K]>): Promise<any[]> {
    return Promise.all(
      Array.from(this.getListeners(eventName)).map(listener => Promise.resolve(listener(...args))),
    );
  }

  /**
   * Synchronously execute listeners for the defined event and value.
   * The return value of each listener will be passed as an argument to the next listener.
   */
  emitWaterfall<K extends keyof T>(
    eventName: K,
    value: WaterfallArgument<T[K]>,
  ): WaterfallArgument<T[K]> {
    return Array.from(this.getListeners(eventName)).reduce(
      (nextValue, listener) => listener(nextValue),
      value,
    );
  }

  /**
   * Return all event names with registered listeners.
   */
<<<<<<< HEAD:packages/core/src/Emitter.ts
  getEventNames(): string[] {
    return Array.from(this.listeners.keys());
=======
  getEventNames(): (keyof T)[] {
    return Object.keys(this.listeners) as (keyof T)[];
>>>>>>> a8bbc3b... Start moving emitter to own package.:packages/emitter/src/Emitter.ts
  }

  /**
   * Return a set of listeners for a specific event name.
   */
  getListeners<K extends keyof T>(eventName: K): Set<ListenerType<T[K]>> {
    const key = String(eventName);

    if (!key.match(EVENT_NAME_PATTERN)) {
      throw new Error(
        `Invalid event name "${eventName}". ` +
          'May only contain dashes, periods, and lowercase characters.',
      );
    }

    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }

<<<<<<< HEAD:packages/core/src/Emitter.ts
    return this.listeners.get(eventName)!;
=======
    return this.listeners[eventName]!;
>>>>>>> a8bbc3b... Start moving emitter to own package.:packages/emitter/src/Emitter.ts
  }

  /**
   * Remove a listener from a specific event name.
   */
  off<K extends keyof T>(eventName: K, listener: ListenerType<T[K]>): this {
    this.getListeners(eventName).delete(listener);

    return this;
  }

  /**
   * Register a listener to a specific event name.
   */
  on<K extends keyof T>(eventName: K, listener: ListenerType<T[K]>): this {
    this.getListeners(eventName).add(this.validateListener(eventName, listener));

    return this;
  }

  /**
   * Register a listener to a specific event name that only triggers once.
   */
  once<K extends keyof T>(eventName: K, listener: ListenerType<T[K]>): this {
    const func = this.validateListener(eventName, listener);
    const handler: any = (...args: Arguments<T[K]>) => {
      this.off(eventName, handler);

      return func(...args);
    };

    return this.on(eventName, handler);
  }

  protected validateListener<K extends keyof T, L>(eventName: K, listener: L): L {
    if (typeof listener !== 'function') {
      throw new TypeError(`Invalid event listener for "${eventName}", must be a function.`);
    }

    return listener;
  }
}
