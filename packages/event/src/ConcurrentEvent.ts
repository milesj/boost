import BaseEvent from './BaseEvent';
import debug from './debug';

export default class ConcurrentEvent<
  Args extends unknown[],
  Scope extends string = string
> extends BaseEvent<Promise<unknown>, Args, Scope> {
  /**
   * Asynchronously execute listeners for with the defined arguments.
   * Will return a promise with an array of each listener result.
   */
  emit(args: Args, scope?: Scope): Promise<unknown[]> {
    debug('Emitting "%s%s" as concurrent', this.name, scope ? `:${scope}` : '');

    return Promise.all(Array.from(this.getListeners(scope)).map((listener) => listener(...args)));
  }
}
