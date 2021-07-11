import BaseEvent from './BaseEvent';

export default class Event<Args extends unknown[], Scope extends string = string> extends BaseEvent<
	void,
	Args,
	Scope
> {
	/**
	 * Synchronously execute listeners with the defined arguments.
	 */
	emit(args: Args, scope?: Scope) {
		Array.from(this.getListeners(scope)).forEach((listener) => {
			listener(...args);
		});
	}
}
