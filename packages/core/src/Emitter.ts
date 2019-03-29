import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import { EVENT_NAME_PATTERN } from './constants';

export type EventArguments = any[];

export type EventListener = (...args: EventArguments) => false | void;

export default class Emitter {
  listeners: Map<string, Set<EventListener>> = new Map();

  /**
   * Remove all listeners for the defined event name.
   */
  clearListeners(eventName: string): this {
    this.getListeners(eventName).clear();

    return this;
  }

  /**
   * Syncronously execute listeners for the defined event and arguments.
   */
  emit(eventName: string, args: EventArguments = []): this {
    Array.from(this.getListeners(eventName)).some(listener => listener(...args) === false);

    return this;
  }

  /**
   * Return all event names with registered listeners.
   */
  getEventNames(): string[] {
    return Array.from(this.listeners.keys());
  }

  /**
   * Return a set of listeners for a specific event name.
   */
  getListeners(eventName: string): Set<EventListener> {
    if (!eventName.match(EVENT_NAME_PATTERN)) {
      throw new Error(
        `Invalid event name "${eventName}". ` +
          'May only contain dashes, periods, and lowercase characters.',
      );
    }

    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }

    return this.listeners.get(eventName)!;
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

    let eventProp = eventName;
    const args = ['listener'];

    if (eventName.includes('.')) {
      const [scope, event] = eventName.split('.', 2);

      args.push(`'${scope}'`);
      eventProp = event;
    }

    console.warn(
      `Boost emitter has been deprecated. Please migrate \`on('${eventName}', listener)\` to the new event system, \`on${upperFirst(
        camelCase(eventProp),
      )}.listen(${args.join(', ')})\`.'`,
    );

    this.getListeners(eventName).add(listener);

    return this;
  }
}
