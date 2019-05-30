import { Constructor } from '../types';

/**
 * Native `instanceof` checks are problematic, as cross realm checks fail.
 * They will also fail when comparing against source and built files.
 * So emulate an `instanceof` check by comparing constructor names.
 */
export default function instanceOf<T = any>(
  object: unknown,
  declaration: Constructor<T>,
  loose: boolean = true,
): object is T {
  if (!object || typeof object !== 'object') {
    return false;
  }

  if (object instanceof declaration) {
    return true;
  }

  if (!loose) {
    return false;
  }

  let current = object;

  while (current) {
    if (current.constructor.name === 'Object') {
      return false;
    }

    if (
      current.constructor.name === declaration.name ||
      (current instanceof Error && current.name === declaration.name)
    ) {
      return true;
    }

    current = Object.getPrototypeOf(current);
  }

  return false;
}
