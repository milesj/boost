import isMethod from './isMethod';
import { InternalMethodDecorator } from './types';

export type ThrottledFunction = (...args: unknown[]) => void;

export default function Throttle(delay: number): InternalMethodDecorator<ThrottledFunction> {
  return (target, property, descriptor) => {
    if (!isMethod(target, property, descriptor) || typeof descriptor.value !== 'function') {
      throw new TypeError(`\`@Throttle\` may only be applied to class methods.`);
    }

    const func = descriptor.value;

    // We must use a map as all class instances would share the
    // same boolean value otherwise.
    const throttling = new WeakMap<Function, boolean>();

    return {
      ...descriptor,
      value(this: InternalMethodDecorator<ThrottledFunction>, ...args: unknown[]) {
        if (throttling.get(this)) {
          return;
        }

        func(...args);
        throttling.set(this, true);

        setTimeout(() => {
          throttling.delete(this);
        }, delay);
      },
    };
  };
}
