/* eslint-disable babel/no-invalid-this */

import isMethod from './helpers/isMethod';

export type MemoizedFunction<T> = (...args: unknown[]) => T;

export type MemoizeHasher = (...args: unknown[]) => string;

export type MemoizeCache<T> = Map<
  string,
  {
    time?: number | null;
    value: T;
  }
>;

export interface MemoizeOptions<T> {
  cache?: MemoizeCache<T> | null;
  expires?: number;
  hasher?: MemoizeHasher;
}

function hasher(...args: unknown[]): string {
  return JSON.stringify(args);
}

function createMemoizer<T>(
  method: MemoizedFunction<T>,
  rootCache: WeakMap<Function, MemoizeCache<T>>,
  options: Required<MemoizeOptions<T>>,
): MemoizedFunction<T> {
  // Must be a normal function as we require `this`
  return function memoizer(this: Function, ...args: unknown[]) {
    // Extract the cache for this specific instance
    let cache = rootCache.get(this);

    if (!cache) {
      cache = options.cache ? new Map(options.cache) : new Map();
      rootCache.set(this, cache);
    }

    // Hash the key and check the cache
    const key = options.hasher(...args);
    const item = cache.get(key);

    if (item && (!item.time || (typeof item.time === 'number' && item.time > Date.now()))) {
      return item.value;
    }

    // No cache so execute and cache the result
    const value = method.apply(this, args);
    const time = options.expires > 0 ? Date.now() + options.expires : null;

    cache.set(key, {
      time,
      value,
    });

    // Only cache if successful
    if (value instanceof Promise) {
      value.catch(() => cache?.delete(key));
    }

    return value;
  };
}

export default function Memoize<T>(
  options: MemoizeHasher | MemoizeOptions<T> = {},
): MethodDecorator {
  // eslint-disable-next-line complexity
  return (target, property, descriptor) => {
    if (__DEV__) {
      if (
        !isMethod(target, property, descriptor) ||
        (!('value' in descriptor && typeof descriptor.value === 'function') &&
          !('get' in descriptor && typeof descriptor.get === 'function'))
      ) {
        throw new TypeError(`\`@Memoize\` may only be applied to class methods or getters.`);
      }
    }

    const config = {
      cache: null,
      expires: 0,
      hasher,
      ...(typeof options === 'function' ? { hasher: options } : options),
    };

    if (__DEV__) {
      if (config.cache && !(config.cache instanceof Map)) {
        throw new Error('`cache` must be an instance of `Map`.');
      }

      if (typeof config.expires !== 'number' || config.expires < 0) {
        throw new Error('`expires` must be a number greater than or equal to 0.');
      }

      if (typeof config.hasher !== 'function') {
        throw new TypeError('`hasher` must be a function.');
      }
    }

    // We must use a map as all class instances would share the
    // same cache otherwise. Probability of collision is high.
    const rootCache = new WeakMap<Function, MemoizeCache<T>>();

    if (descriptor.get) {
      // @ts-expect-error
      descriptor.get = createMemoizer<T>(descriptor.get, rootCache, config);
    } else if (descriptor.value) {
      // @ts-expect-error
      descriptor.value = createMemoizer<T>(descriptor.value, rootCache, config);
    }
  };
}
