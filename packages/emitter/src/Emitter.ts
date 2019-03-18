import { EVENT_NAME_PATTERN } from './constants';
import { ListenerOf, ArgumentsOf } from './types';

export default class Emitter<T> {
  listeners: { [K in keyof T]?: Set<ListenerOf<T[K]>> } = {};

  /**
   * Remove all listeners for the defined event name.
   */
  clearListeners<K extends keyof T>(eventName: K): this {
    this.getListeners(eventName).clear();

    return this;
  }

  /**
   * Synchronously execute listeners for the defined event and arguments.
   * If a listener returns `false`, the loop with be aborted early.
   */
  emit<K extends keyof T>(eventName: K, args: ArgumentsOf<T[K]>): this {
    Array.from(this.getListeners(eventName)).some(listener => listener(...args) === false);

    return this;
  }

  /**
   * Synchronously execute listeners for the defined event and arguments,
   * with the ability to intercept and abort early with a value.
   */
  // emitCascade<T>(name: string, args: EventArguments = []): T | void {
  //   let value;

  //   Array.from(this.getListeners(this.createEventName(name))).some(listener => {
  //     value = listener(...args);

  //     return typeof value !== 'undefined';
  //   });

  //   return value;
  // }

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
  getListeners<K extends keyof T>(eventName: K): Set<ListenerOf<T[K]>> {
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
  off<K extends keyof T>(eventName: K, listener: ListenerOf<T[K]>): this {
    this.getListeners(eventName).delete(listener);

    return this;
  }

  /**
   * Register a listener to a specific event name.
   */
  on<K extends keyof T>(eventName: K, listener: ListenerOf<T[K]>): this {
    if (typeof listener !== 'function') {
      throw new TypeError(`Invalid event listener for "${eventName}", must be a function.`);
    }

    this.getListeners(eventName).add(listener);

    return this;
  }
}
