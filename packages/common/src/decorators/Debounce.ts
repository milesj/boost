import isMethod from './isMethod';
import { InternalMethodDecorator } from './types';

export type DebouncedFunction = (...args: unknown[]) => void;

export default function Debounce(delay: number): InternalMethodDecorator<DebouncedFunction> {
  return (target, property, descriptor) => {
    if (!isMethod(target, property, descriptor) || typeof descriptor.value !== 'function') {
      throw new TypeError(`\`@Debounce\` may only be applied to class methods.`);
    }

    const func = descriptor.value;
    let timer: NodeJS.Timeout;

    return {
      ...descriptor,
      value(...args: unknown[]) {
        clearTimeout(timer);

        timer = setTimeout(() => {
          func(...args);
        }, delay);
      },
    };
  };
}
