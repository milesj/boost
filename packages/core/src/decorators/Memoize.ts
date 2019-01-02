/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

const cacheKey = Symbol('Memoize');

export default function Memoize(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const cache = target[cacheKey] || {};
  let type: 'get' | 'value' = 'value';
  let original: any;

  if (descriptor.get) {
    type = 'get';
    original = descriptor.get;
  } else if (descriptor.value) {
    type = 'value';
    original = descriptor.value;
  }

  if (!type || typeof original !== 'function') {
    throw new TypeError('@Memoize may only be used with methods.');
  }

  descriptor[type] = (...args: any[]) => {
    const key = JSON.stringify(args);

    if (cache[key]) {
      return cache[key];
    }

    cache[key] = original.apply(original, args);
    target[cacheKey] = cache;

    return cache[key];
  };
}
