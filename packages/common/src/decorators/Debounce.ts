import isMethod from './isMethod';
import { InternalMethodDecorator } from './types';

export type DebouncedFunction = (...args: unknown[]) => void;

export default function Debounce(delay: number): InternalMethodDecorator<DebouncedFunction> {
  return (target, property, descriptor) => {
    if (!isMethod(target, property, descriptor) || typeof descriptor.value !== 'function') {
      throw new TypeError(`\`@Debounce\` may only be applied to class methods.`);
    }

    const func = descriptor.value;

    // We must use a map as all class instances would share the
    // same timer value otherwise.
    const timers = new WeakMap<Function, NodeJS.Timeout>();

    return {
      ...descriptor,
      value(this: InternalMethodDecorator<DebouncedFunction>, ...args: unknown[]) {
        const timer = timers.get(this);

        if (timer) {
          clearTimeout(timer);
          timers.delete(this);
        }

        timers.set(
          this,
          setTimeout(() => {
            func(...args);
          }, delay),
        );
      },
    };
  };
}
