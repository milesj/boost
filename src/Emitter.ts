/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Event from './Event';
import { APP_NAME_PATTERN } from './constants';
import { EventArguments, EventListener } from './types';

export interface EmitterInterface {
  emit(name: string, args: EventArguments, initialValue: any): Event;
  off(eventName: string, listener: EventListener): this;
  on(eventName: string, listener: EventListener): this;
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
  emit(name: string, args: EventArguments = [], initialValue: any = null): Event {
    const event = new Event(this.createEventName(name), initialValue);

    Array.from(this.getListeners(event.name)).some((listener) => {
      listener(event, ...args);

      return event.stopped;
    });

    return event;
  }

  /**
   * Syncronously execute listeners for the defined event and arguments,
   * through a chaining lyer controlled by next handlers.
   */
  emitCascade(name: string, args: EventArguments = [], initialValue: any = null): Event {
    const event = new Event(this.createEventName(name), initialValue);
    const listeners = Array.from(this.getListeners(event.name));
    let index = 0;

    if (listeners.length === 0) {
      return event;
    }

    // Handler passed to each listener
    function next(nextIndex: number, ...nextEventArguments: EventArguments) {
      index = nextIndex;
      const listener = listeners[index];

      if (!listener || event.stopped) {
        return;
      }

      // Set the next handler
      event.next = () => next(index + 1, ...nextEventArguments);

      listener(event, ...nextEventArguments);
    }

    // Execute the first listener
    next(0, ...args);

    return event;
  }

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
