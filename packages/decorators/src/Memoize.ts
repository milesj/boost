import { isMethod } from './helpers/isMethod';

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
	/** A custom `Map` instance to store cached values. Can also be used to pre-cache expected values. */
	cache?: MemoizeCache<T> | null;
	/**
	 * Time in milliseconds in which to keep the cache alive (TTL).
	 * Pass `0` to cache indefinitely. Defaults to `0`.
	 */
	expires?: number;
	/**
	 * A hashing function to determine the cache key. Is passed the method's arguments
	 * and must return a string. If not provided, arguments are hashed using `JSON.stringify()`.
	 */
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
			// eslint-disable-next-line promise/prefer-await-to-then
			value.catch(() => cache?.delete(key));
		}

		return value;
	};
}

/**
 * A method decorator that caches the return value of a class method or
 * getter to consistently and efficiently return the same value.
 */
export function Memoize<T>(options: MemoizeHasher | MemoizeOptions<T> = {}): MethodDecorator {
	// eslint-disable-next-line complexity
	return (target, property, descriptor) => {
		if (
			__DEV__ &&
			(!isMethod(target, property, descriptor) ||
				(!('value' in descriptor && typeof descriptor.value === 'function') &&
					!('get' in descriptor && typeof descriptor.get === 'function')))
		) {
			throw new TypeError(`\`@Memoize\` may only be applied to class methods or getters.`);
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
			// @ts-expect-error Override generic
			descriptor.get = createMemoizer<T>(descriptor.get, rootCache, config);
		} else if (descriptor.value) {
			// @ts-expect-error Override generic
			descriptor.value = createMemoizer<T>(descriptor.value, rootCache, config);
		}
	};
}
