import { BaseEvent } from './BaseEvent';
import { debug } from './debug';

export class BailEvent<Args extends unknown[], Scope extends string = string> extends BaseEvent<
	boolean | void,
	Args,
	Scope
> {
	/**
	 * Synchronously execute listeners with the defined arguments.
	 * If a listener returns `false`, the loop with be aborted early,
	 * and the emitter will return `true` (for bailed).
	 */
	emit(args: Args, scope?: Scope): boolean {
		if (__DEV__) {
			debug('Emitting "%s%s" as bail', this.name, scope ? `:${scope}` : '');
		}

		return [...this.getListeners(scope)].some((listener) => listener(...args) === false);
	}
}
