/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Event from './Event';
import { APP_NAME_PATTERN } from './constants';

import type { EventArguments, EventListener, Result } from './types';

export default class Emitter {
  listeners: { [eventName: string]: Set<EventListener> } = {};

  /**
   * Syncronously execute listeners for the defined event and arguments.
   */
  emit(eventName: string, initialValue: Result, args?: EventArguments = []): Event {
    const event = new Event(eventName, initialValue);

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
  emitCascade(eventName: string, initialValue: Result, args?: EventArguments = []): Event {
    const event = new Event(eventName, initialValue);
    const listeners = Array.from(this.getListeners(event.name));
    let index = 0;

    if (listeners.length === 0) {
      return event;
    }

    // Handler passed to each listener
    function next(nextIndex: number, ...nextEventArguments: EventArguments) {
      if (nextIndex < index || nextIndex > listeners.length) {
        throw new Error('Invalid cascading event.');
      }

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
        'May only contain dashes and lowercase characters.',
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
}
