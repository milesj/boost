import { BaseEvent } from './BaseEvent';
import { debug } from './debug';

export class ConcurrentEvent<
	Args extends unknown[],
	Scope extends string = string,
> extends BaseEvent<Promise<unknown>, Args, Scope> {
	/**
	 * Asynchronously execute listeners for with the defined arguments.
	 * Will return a promise with an array of each listener result.
	 */
	async emit(args: Args, scope?: Scope): Promise<unknown[]> {
		if (__DEV__) {
			debug('Emitting "%s%s" as concurrent', this.name, scope ? `:${scope}` : '');
		}

		return Promise.all([...this.getListeners(scope)].map((listener) => listener(...args)));
	}
}
