import { isMethod } from './helpers/isMethod';

/**
 * A method decorator that automatically binds a class method's
 * `this` context to its current instance.
 */
export function Bind(): MethodDecorator {
	return (target, property, descriptor) => {
		if (
			__DEV__ &&
			(!isMethod(target, property, descriptor) ||
				!('value' in descriptor && typeof descriptor.value === 'function'))
		) {
			throw new TypeError(`\`@Bind\` may only be applied to class methods.`);
		}

		const func = descriptor.value;

		return {
			configurable: true,
			get(this: Function) {
				const bound = (func as unknown as Function).bind(this);

				// Only cache the bound function when in the deepest sub-class,
				// otherwise any `super` calls will overwrite each other.
				if (target.constructor.name === this.constructor.name) {
					Object.defineProperty(this, property, {
						configurable: true,
						value: bound,
						writable: true,
					});
				}

				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return bound;
			},
		};
	};
}
