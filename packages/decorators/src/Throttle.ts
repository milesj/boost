import { isMethod } from './helpers/isMethod';

/**
 * A method decorator that throttles the execution of a class method to
 * only fire once within every delay timeframe (in milliseconds).
 */
export function Throttle(delay: number): MethodDecorator {
	return (target, property, descriptor) => {
		if (
			__DEV__ &&
			(!isMethod(target, property, descriptor) ||
				!('value' in descriptor && typeof descriptor.value === 'function'))
		) {
			throw new TypeError(`\`@Throttle\` may only be applied to class methods.`);
		}

		// We must use a map as all class instances would share the
		// same boolean value otherwise.
		const throttling = new WeakMap<Function, boolean>();

		// Overwrite the value function with a new throttled function
		const func = descriptor.value;

		// @ts-expect-error Override generic
		descriptor.value = function throttle(this: Function, ...args: unknown[]) {
			if (throttling.get(this)) {
				return;
			}

			(func as unknown as Function).apply(this, args);
			throttling.set(this, true);

			setTimeout(() => {
				throttling.delete(this);
			}, delay);
		};
	};
}
