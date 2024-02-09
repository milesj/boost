import { Memoize } from '../src';
import { vi, describe, it, expect, Mock } from 'vitest';

function sleep(time: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
}

describe('@Memoize()', () => {
	// Date.now() is a bit too deterministic, as tests run so fast
	// and use the same timestamp. We use a counter to increase uniqueness.
	let count = 0;

	class Test {
		spy: Mock;

		constructor(spy: Mock) {
			this.spy = spy;
		}

		@Memoize()
		get getter(): number {
			this.spy();

			return Date.now() + this.inc();
		}

		@Memoize()
		noArgs(): number {
			this.spy();

			return Date.now() + this.inc();
		}

		@Memoize()
		oneArg(a: string): string {
			this.spy();

			return a.toUpperCase();
		}

		@Memoize()
		manyArgs(a: string, b: number, c: boolean): string {
			this.spy();

			// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
			return a + b + c;
		}

		@Memoize()
		restArgs(...args: unknown[]): number {
			this.spy();

			return Date.now() + this.inc();
		}

		inc(): number {
			count += 1;

			return count;
		}
	}

	it('errors if applied to a class', () => {
		expect(() => {
			// @ts-expect-error Allow decorator here
			@Memoize()
			class TestClass {}

			return TestClass;
		}).toThrowErrorMatchingSnapshot();
	});

	it('errors if applied to a property', () => {
		expect(
			() =>
				class TestProp {
					// @ts-expect-error Allow decorator here
					@Memoize()
					value = 123;
				},
		).toThrowErrorMatchingSnapshot();
	});

	it('errors if `cache` is not a map', () => {
		expect(() => {
			class TestClass {
				// @ts-expect-error Allow decorator here
				@Memoize({ cache: {} })
				test() {}
			}

			return TestClass;
		}).toThrowErrorMatchingSnapshot();
	});

	it('errors if `expires` is not a number', () => {
		expect(() => {
			class TestClass {
				// @ts-expect-error Invalid type
				@Memoize({ expires: 'abc' })
				test() {}
			}

			return TestClass;
		}).toThrowErrorMatchingSnapshot();
	});

	it('errors if `expires` is negative', () => {
		expect(() => {
			class TestClass {
				@Memoize({ expires: -123 })
				test() {}
			}

			return TestClass;
		}).toThrowErrorMatchingSnapshot();
	});

	it('errors if `hasher` is not a function', () => {
		expect(() => {
			class TestClass {
				// @ts-expect-error Invalid type
				@Memoize({ hasher: 123 })
				test() {}
			}

			return TestClass;
		}).toThrowErrorMatchingSnapshot();
	});

	it('doesnt leak to separate instances', () => {
		const spy1 = vi.fn();
		const spy2 = vi.fn();

		const a = new Test(spy1);
		const b = new Test(spy2);

		a.noArgs();
		b.noArgs();

		expect(spy1).toHaveBeenCalledTimes(1);
		expect(spy2).toHaveBeenCalledTimes(1);
		expect(a).not.toBe(b);
	});

	it('caches result for getters', () => {
		const spy = vi.fn();
		const test = new Test(spy);

		const a = test.getter;
		const b = test.getter;
		const c = test.getter;

		expect(spy).toHaveBeenCalledTimes(1);
		expect(b).toBe(a);
		expect(c).toBe(a);
	});

	it('caches result for 0 arguments', () => {
		const spy = vi.fn();
		const test = new Test(spy);

		const a = test.noArgs();
		const b = test.noArgs();
		const c = test.noArgs();

		expect(spy).toHaveBeenCalledTimes(1);
		expect(b).toBe(a);
		expect(c).toBe(a);
	});

	it('caches result for 1 argument', () => {
		const spy = vi.fn();
		const test = new Test(spy);

		const a = test.oneArg('abc');
		const b = test.oneArg('abc');
		const c = test.oneArg('abc');

		expect(spy).toHaveBeenCalledTimes(1);
		expect(b).toBe(a);
		expect(c).toBe(a);

		const d = test.oneArg('xyz');
		const e = test.oneArg('xyz');

		expect(spy).toHaveBeenCalledTimes(2);
		expect(d).not.toBe(a);
		expect(e).toBe(d);
	});

	it('caches result for many arguments', () => {
		const spy = vi.fn();
		const test = new Test(spy);

		const a = test.manyArgs('abc', 1, true);
		const b = test.manyArgs('abc', 1, true);
		const c = test.manyArgs('abc', 1, true);

		expect(spy).toHaveBeenCalledTimes(1);
		expect(b).toBe(a);
		expect(c).toBe(a);

		const d = test.manyArgs('abc', 1, false);
		const e = test.manyArgs('abc', 2, true);
		const f = test.manyArgs('xyz', 1, true);
		const g = test.manyArgs('abc', 1, true);

		expect(spy).toHaveBeenCalledTimes(4);
		expect(d).not.toBe(a);
		expect(e).not.toBe(a);
		expect(f).not.toBe(a);
		expect(g).toBe(a);
	});

	it('caches result for rest arguments', () => {
		const spy = vi.fn();
		const test = new Test(spy);

		const a = test.restArgs('abc', 1, true, {});
		const b = test.restArgs('abc', 1, true, {});
		const c = test.restArgs('abc', 1, true, {});

		expect(spy).toHaveBeenCalledTimes(1);
		expect(b).toBe(a);
		expect(c).toBe(a);

		const d = test.restArgs('abc');
		const e = test.restArgs('abc', 3);
		const f = test.restArgs('xyz', 1, true, {}, []);
		const g = test.restArgs('abc', 1, true, {});

		expect(spy).toHaveBeenCalledTimes(4);
		expect(d).not.toBe(a);
		expect(e).not.toBe(a);
		expect(f).not.toBe(a);
		expect(g).toBe(a);
	});

	it('returns cache for same object argument structure', () => {
		const spy = vi.fn();
		const test = new Test(spy);

		const a = test.restArgs({ foo: 123 });
		const b = test.restArgs({ foo: 123 });
		const c = test.restArgs({ foo: 123 });

		expect(spy).toHaveBeenCalledTimes(1);
		expect(b).toBe(a);
		expect(c).toBe(a);

		const d = test.restArgs({ foo: 456 });
		const e = test.restArgs({ foo: 456 });
		const f = test.restArgs({ bar: 'abc' });

		expect(spy).toHaveBeenCalledTimes(3);
		expect(d).not.toBe(a);
		expect(e).toBe(d);
		expect(f).not.toBe(a);
		expect(f).not.toBe(e);
	});

	it('returns cache for same array argument structure', () => {
		const spy = vi.fn();
		const test = new Test(spy);

		const a = test.restArgs([123]);
		const b = test.restArgs([123]);
		const c = test.restArgs([123]);

		expect(spy).toHaveBeenCalledTimes(1);
		expect(b).toBe(a);
		expect(c).toBe(a);

		const d = test.restArgs([456]);
		const e = test.restArgs([456]);
		const f = test.restArgs(['abc']);

		expect(spy).toHaveBeenCalledTimes(3);
		expect(d).not.toBe(a);
		expect(e).toBe(d);
		expect(f).not.toBe(a);
		expect(f).not.toBe(e);
	});

	describe('cache map', () => {
		it('can provide a custom cache map', () => {
			const spy = vi.fn();
			const cache = new Map();
			cache.set('[]', { value: 'pre-cached value' });

			class TestCache {
				@Memoize({ cache })
				method() {
					spy();

					return 'value';
				}
			}

			const test = new TestCache();

			const a = test.method();
			const b = test.method();
			const c = test.method();

			expect(spy).toHaveBeenCalledTimes(0);
			expect(a).toBe('pre-cached value');
			expect(b).toBe(a);
			expect(c).toBe(a);
		});
	});

	describe('hash function', () => {
		function hasher() {
			return 'always same key';
		}

		it('can provide a custom hash function', () => {
			const spy = vi.fn();

			class TestHash {
				@Memoize({ hasher })
				method(...args: unknown[]) {
					spy();

					return Date.now();
				}
			}

			const test = new TestHash();

			// Differents args (cache key), but same results
			const a = test.method(1, 2, 3);
			const b = test.method('a', 'b', 'c');
			const c = test.method(1, 'a');

			expect(spy).toHaveBeenCalledTimes(1);
			expect(b).toBe(a);
			expect(c).toBe(a);
		});

		it('can provide a custom hash function by passing it directly to the decorator', () => {
			const spy = vi.fn();

			class TestHash {
				@Memoize(hasher)
				method(...args: unknown[]) {
					spy();

					return Date.now();
				}
			}

			const test = new TestHash();

			// Differents args (cache key), but same results
			const a = test.method(1, 2, 3);
			const b = test.method('a', 'b', 'c');
			const c = test.method(1, 'a');

			expect(spy).toHaveBeenCalledTimes(1);
			expect(b).toBe(a);
			expect(c).toBe(a);
		});
	});

	describe('expirations', () => {
		it('will bypass cache when an expiration time has passed', async () => {
			const spy = vi.fn();

			class TestExpires {
				@Memoize({ expires: 100 })
				method() {
					spy();

					return Date.now();
				}
			}

			const test = new TestExpires();

			const a = test.method();
			const b = test.method();
			const c = test.method();

			expect(spy).toHaveBeenCalledTimes(1);
			expect(b).toBe(a);
			expect(c).toBe(a);

			await sleep(110);

			const d = test.method();
			const e = test.method();
			const f = test.method();

			expect(spy).toHaveBeenCalledTimes(2);
			expect(d).not.toBe(a);
			expect(e).toBe(d);
			expect(f).toBe(d);
		});
	});

	describe('async/promises', () => {
		class TestAsync extends Test {
			@Memoize()
			async resolvedPromise() {
				this.spy();

				const value = await Promise.resolve(Date.now());

				return value;
			}

			@Memoize()
			async rejectedPromise(): Promise<unknown> {
				this.spy();

				await Promise.resolve(Date.now());

				throw new Error('Failed!');
			}
		}

		it('caches and reuses the same promise', async () => {
			const spy = vi.fn();
			const test = new TestAsync(spy);

			const a = test.resolvedPromise();
			const b = test.resolvedPromise();
			const c = test.resolvedPromise();

			expect(spy).toHaveBeenCalledTimes(1);
			expect(b).toBe(a);
			expect(c).toBe(a);

			const result = await a;

			await expect(b).resolves.toBe(result);
			await expect(c).resolves.toBe(result);

			const another = await test.resolvedPromise();

			expect(spy).toHaveBeenCalledTimes(1);
			expect(another).toBe(result);
		});

		it('deletes the cache if promise is rejected', async () => {
			expect.assertions(4);

			const spy = vi.fn();
			const test = new TestAsync(spy);

			const a = test.rejectedPromise();
			const b = test.rejectedPromise();
			const c = test.rejectedPromise();

			expect(spy).toHaveBeenCalledTimes(1);
			expect(b).toBe(a);
			expect(c).toBe(a);

			try {
				const result = await a;

				// Should not run
				await expect(b).resolves.toBe(result);
				await expect(c).resolves.toBe(result);
			} catch {
				// Ignore
			}

			try {
				await test.rejectedPromise();
			} catch {
				expect(spy).toHaveBeenCalledTimes(2);
			}
		});
	});
});
