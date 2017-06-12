/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Event from './Event';
import { APP_NAME_PATTERN } from './constants';

import type { Result } from './types';

type Args = *[];
type Listener = (...args: Args) => *;

export default class Emitter {
  listeners: { [eventName: string]: Set<Listener> } = {};

  /**
   * Emit an event with the provided arguments. Optionally cascade the event value.
   */
  emit(event: Event, args: Args = [], cascade: boolean = false): Event {
    if (!(event instanceof Event)) {
      throw new Error('Invalid event, must be an instance of `Event`.');

    } else if (!Array.isArray(args)) {
      throw new Error(`Invalid arguments for event "${event.name}", must be an array.`);
    }

    Array.from(this.getListeners(event.name)).some((listener) => {
      if (event.stopped) {
        return true;
      }

      const nextValue = listener(event, ...args);

      if (cascade && typeof nextValue !== 'undefined') {
        // eslint-disable-next-line no-param-reassign
        event.value = nextValue;
      }

      return false;
    });

    return event;
  }

  /**
   * Asyncronously execute listeners in the next tick for the provided event and arguments.
   */
  emitAsync(eventName: string, args: Args = []): Event {
    const event = new Event(eventName);

    process.nextTick(() => this.emit(event, args));

    return event;
  }

  /**
   * Asyncronously execute listeners in the next tick for the provided event and arguments,
   * while passing a value from the previous listener to the next listener.
   */
  emitAsyncCascade(eventName: string, initialValue: Result, args: Args = []): Event {
    const event = new Event(eventName, initialValue);

    process.nextTick(() => this.emit(event, args, true));

    return event;
  }

  /**
   * Syncronously execute listeners for the provided event and arguments.
   */
  emitSync(eventName: string, args: Args = []): Event {
    return this.emit(new Event(eventName), args);
  }

  /**
   * Syncronously execute listeners for the provided event and arguments,
   * while passing a value from the previous listener to the next listener.
   */
  emitSyncCascade(eventName: string, initialValue: Result, args: Args = []): Event {
    return this.emit(new Event(eventName, initialValue), args, true);
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
  getListeners(eventName: string): Set<Listener> {
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
  off(eventName: string, listener: Listener): this {
    this.getListeners(eventName).delete(listener);

    return this;
  }

  /**
   * Register a listener function to a specific event name.
   */
  on(eventName: string, listener: Listener): this {
    if (typeof listener !== 'function') {
      throw new Error(`Invalid event listener for "${eventName}", must be a function.`);
    }

    this.getListeners(eventName).add(listener);

    return this;
  }
}
