import { EVENT_NAME_PATTERN } from './constants';
import { Listener, Scope } from './types';

export default abstract class BaseEvent<Args extends unknown[], Return> {
  listeners: Map<string, Set<Listener<Args, Return>>> = new Map();

  name: string;

  constructor(name: string) {
    this.name = this.validateName(name, 'name');
  }

  /**
   * Remove all listeners from the event.
   */
  clearListeners(scope?: Scope): this {
    if (scope) {
      this.getListeners(scope).clear();
    } else {
      this.listeners.clear();
    }

    return this;
  }

  /**
   * Return a set of listeners for a specific event scope.
   */
  getListeners(scope: Scope = '*'): Set<Listener<Args, Return>> {
    const key = this.validateName(scope, 'scope');

    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }

    return this.listeners.get(key)!;
  }

  /**
   * Return a list of all scopes with listeners.
   */
  getScopes(): string[] {
    return Array.from(this.listeners.keys());
  }

  /**
   * Register a listener to the event.
   */
  listen(listener: Listener<Args, Return>, scope?: Scope): this {
    this.getListeners(scope).add(this.validateListener(listener));

    return this;
  }

  /**
   * Register a listener to the event that only triggers once.
   */
  once(listener: Listener<Args, Return>, scope?: Scope): this {
    const func = this.validateListener(listener);
    const handler: any = (...args: unknown[]) => {
      this.unlisten(handler);

      return func(...args);
    };

    return this.listen(handler, scope);
  }

  /**
   * Remove a listener from the event.
   */
  unlisten(listener: Listener<Args, Return>, scope?: Scope): this {
    this.getListeners(scope).delete(listener);

    return this;
  }

  /**
   * Validate the listener is a function.
   */
  protected validateListener<L>(listener: L): L {
    if (typeof listener !== 'function') {
      throw new TypeError(`Invalid event listener for "${this.name}", must be a function.`);
    }

    return listener;
  }

  /**
   * Validate the name/scope match a defined pattern.
   */
  protected validateName(name: string, type: string): string {
    if (type === 'scope' && name === '*') {
      return name;
    }

    if (!name.match(EVENT_NAME_PATTERN)) {
      throw new Error(
        `Invalid event ${type} "${name}". May only contain dashes, periods, and lowercase characters.`,
      );
    }

    return name;
  }

  /**
   * Emit the event by executing all scoped listeners with the defined arguments.
   */
  abstract emit(args: unknown, scope?: Scope): unknown;
}
