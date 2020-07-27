import isMethod from './isMethod';
import { InternalMethodDecorator } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BoundFunction = (...args: any[]) => any;

export default function Bind(): InternalMethodDecorator<BoundFunction> {
  return (target, property, descriptor) => {
    if (!isMethod(target, property, descriptor) || typeof descriptor.value !== 'function') {
      throw new TypeError(`\`@Bind\` may only be applied to class methods.`);
    }

    return {
      configurable: true,
      get(this: BoundFunction): BoundFunction {
        const bound = descriptor.value!.bind(this) as BoundFunction;

        // Only cache the bound function when in the deepest sub-class,
        // otherwise any `super` calls will overwrite each other.
        if (target.constructor.name === this.constructor.name) {
          Object.defineProperty(this, property, {
            configurable: true,
            value: bound,
            writable: true,
          });
        }

        return bound;
      },
    };
  };
}
