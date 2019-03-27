import BaseEvent from './BaseEvent';

export default class ParallelEvent<Args extends unknown[]> extends BaseEvent<
  Args,
  Promise<unknown>
> {
  /**
   * Asynchronously execute listeners for with the defined arguments.
   * Will return a promise with an array of each listener result.
   */
  emit(args: Args): Promise<unknown[]> {
    return Promise.all(
      Array.from(this.listeners).map(listener => Promise.resolve(listener(...args))),
    );
  }
}
