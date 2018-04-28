/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { APP_NAME_PATTERN } from './constants';

export type EventArguments = any[];

export type EventListener = (...args: EventArguments) => false | void;

export interface EmitterInterface {
  emit(name: string, args?: EventArguments): this;
  off(eventName: string, listener: EventListener): this;
  on(eventName: string, listener: EventListener): this;
  setEventNamespace(namespace: string): this;
  removeEventNamespace(): this;
}

export default class Emitter implements EmitterInterface {
  listeners: { [eventName: string]: Set<EventListener> } = {};

  namespace: string = '';

  /**
   * Create an event name with optional namespace.
   */
  createEventName(name: string): string {
    if (this.namespace && !name.startsWith(this.namespace)) {
      return `${this.namespace}.${name}`;
    }

    return name;
  }

  /**
   * Syncronously execute listeners for the defined event and arguments.
   */
  emit(name: string, args: EventArguments = []): this {
    Array.from(this.getListeners(this.createEventName(name))).some(
      listener => listener(...args) === false,
    );

    return this;
  }

  /**
   * Syncronously execute listeners for the defined event and arguments,
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
  getEventNames(): string[] {
    return Object.keys(this.listeners);
  }

  /**
   * Return a set of listeners for a specific event name.
   */
  getListeners(eventName: string): Set<EventListener> {
    if (!eventName.match(APP_NAME_PATTERN)) {
      throw new Error(
        `Invalid event name "${eventName}". ` +
          'May only contain dashes, periods, and lowercase characters.',
      );
    }

    if (!this.listeners[eventName]) {
      this.listeners[eventName] = new Set();
    }

    return this.listeners[eventName];
  }

  /**
   * Remove a listener function from a specific event name.
   */
  off(eventName: string, listener: EventListener): this {
    this.getListeners(eventName).delete(listener);

    return this;
  }

  /**
   * Register a listener function to a specific event name.
   */
  on(eventName: string, listener: EventListener): this {
    if (typeof listener !== 'function') {
      throw new TypeError(`Invalid event listener for "${eventName}", must be a function.`);
    }

    this.getListeners(eventName).add(listener);

    return this;
  }

  /**
   * Set the namespace.
   */
  setEventNamespace(namespace: string): this {
    this.namespace = namespace;

    return this;
  }

  /**
   * Remove the namespace.
   */
  removeEventNamespace(): this {
    this.namespace = '';

    return this;
  }
}
