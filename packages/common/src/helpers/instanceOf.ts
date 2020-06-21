import { Constructor } from '../types';

/**
 * Native `instanceof` checks are problematic, as cross realm checks fail.
 * They will also fail when comparing against source and built files.
 * So emulate an `instanceof` check by comparing constructor names.
 */
export default function instanceOf<T = unknown>(
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
      break;
    }

    if (
      current.constructor.name === declaration.name ||
      // istanbul ignore next
      (current instanceof Error && current.name === declaration.name)
    ) {
      return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    current = Object.getPrototypeOf(current);
  }

  return false;
}
