import { BaseEvent } from './BaseEvent';
import { debug } from './debug';

export class WaterfallEvent<Arg, Scope extends string = string> extends BaseEvent<
	Arg,
	[Arg],
	Scope
> {
	/**
	 * Synchronously execute listeners with the defined argument value.
	 * The return value of each listener will be passed as an argument to the next listener.
	 */
	emit(arg: Arg, scope?: Scope): Arg {
		if (__DEV__) {
			debug('Emitting "%s%s" as waterfall', this.name, scope ? `:${scope}` : '');
		}

		return [...this.getListeners(scope)].reduce((nextValue, listener) => listener(nextValue), arg);
	}
}
