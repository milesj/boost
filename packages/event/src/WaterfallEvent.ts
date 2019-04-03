import BaseEvent from './BaseEvent';
import { Scope } from './types';

export default class WaterfallEvent<Arg> extends BaseEvent<[Arg], Arg> {
  /**
   * Synchronously execute listeners with the defined argument value.
   * The return value of each listener will be passed as an argument to the next listener.
   */
  emit(arg: Arg, scope?: Scope): Arg {
    return Array.from(this.getListeners(scope)).reduce(
      (nextValue, listener) => listener(nextValue),
      arg,
    );
  }
}
