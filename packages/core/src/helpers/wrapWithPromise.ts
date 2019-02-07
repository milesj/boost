/**
 * Wrap a value in a promise if it has not already been.
 */
export default function wrapWithPromise<T>(value: T): Promise<any> {
  return value instanceof Promise ? value : Promise.resolve(value);
}
