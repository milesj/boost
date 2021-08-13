import { isMethod } from './helpers/isMethod';

/**
 * A method decorator that delays the execution of the class method
 * by the provided time in milliseconds.
 */
export function Debounce(delay: number): MethodDecorator {
	return (target, property, descriptor) => {
		if (
			__DEV__ &&
			(!isMethod(target, property, descriptor) ||
				!('value' in descriptor && typeof descriptor.value === 'function'))
		) {
			throw new TypeError(`\`@Debounce\` may only be applied to class methods.`);
		}

		// We must use a map as all class instances would share the
		// same timer value otherwise.
		const timers = new WeakMap<Function, NodeJS.Timeout>();

		// Overwrite the value function with a new debounced function
		const func = descriptor.value;

		// @ts-expect-error Override generic
		descriptor.value = function debounce(this: Function, ...args: unknown[]) {
			const timer = timers.get(this);

			if (timer) {
				clearTimeout(timer);
				timers.delete(this);
			}

			timers.set(
				this,
				setTimeout(() => {
					(func as unknown as Function).apply(this, args);
				}, delay),
			);
		};
	};
}
