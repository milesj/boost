import EventError from './EventError';
import debug from './debug';
import { EVENT_NAME_PATTERN, WILDCARD_SCOPE } from './constants';
import { Listener, WildstarScope } from './types';

export default abstract class BaseEvent<
  Return,
  Args extends unknown[],
  Scope extends string = string
> {
  listeners = new Map<Scope | WildstarScope, Set<Listener<Args, Return>>>();

  name: string;

  constructor(name: string) {
    this.name = this.validateName(name, 'name');

    debug('New %S created: %s', this.constructor.name, name);
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
  getListeners(scope?: Scope): Set<Listener<Args, Return>> {
    const key = this.validateName(scope || WILDCARD_SCOPE, 'scope');

    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }

    return this.listeners.get(key)!;
  }

  /**
   * Return a list of all scopes with listeners.
   */
  getScopes(): (Scope | WildstarScope)[] {
    return Array.from(this.listeners.keys()) as (Scope | WildstarScope)[];
  }

  /**
   * Register a listener to the event.
   */
  listen(listener: Listener<Args, Return>, scope?: Scope): this {
    debug('Registering "%s" listener', this.name);

    this.getListeners(scope).add(this.validateListener(listener));

    return this;
  }

  /**
   * Register a listener to the event that only triggers once.
   */
  once(listener: Listener<Args, Return>, scope?: Scope): this {
    const func = this.validateListener(listener);
    const handler = ((...args: unknown[]) => {
      this.unlisten(handler);

      return func(...args);
    }) as Listener<Args, Return>;

    return this.listen(handler, scope);
  }

  /**
   * Remove a listener from the event.
   */
  unlisten(listener: Listener<Args, Return>, scope?: Scope): this {
    debug('Unregistering "%s" listener', this.name);

    this.getListeners(scope).delete(listener);

    return this;
  }

  /**
   * Validate the listener is a function.
   */
  protected validateListener<L>(listener: L): L {
    if (typeof listener !== 'function') {
      throw new EventError('LISTENER_INVALID', [this.name]);
    }

    return listener;
  }

  /**
   * Validate the name/scope match a defined pattern.
   */
  protected validateName<N extends string>(name: N, type: string): N {
    if (type === 'scope' && name === WILDCARD_SCOPE) {
      return name;
    }

    if (!name.match(EVENT_NAME_PATTERN)) {
      throw new EventError('NAME_INVALID', [type, name]);
    }

    return name;
  }

  /**
   * Emit the event by executing all scoped listeners with the defined arguments.
   */
  abstract emit(args: unknown, scope?: Scope): unknown;
}
