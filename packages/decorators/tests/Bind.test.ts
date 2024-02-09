import { Bind } from '../src';
import { describe, beforeEach, afterEach, it, expect, vi, MockInstance } from 'vitest';

describe('@Bind()', () => {
	class Test {
		value: string;

		constructor(value: string = 'abc') {
			this.value = value;
		}

		@Bind()
		getValue(): string {
			return this.value;
		}

		@Bind()
		async getAsyncValue(): Promise<string> {
			const value = await Promise.resolve(this.value);

			return value;
		}

		@Bind()
		setValue(value: string) {
			this.value = value;

			return this;
		}
	}

	it('errors if applied to a class', () => {
		expect(() => {
			// @ts-expect-error Allow decorator here
			@Bind()
			class TestClass {}

			return TestClass;
		}).toThrowErrorMatchingSnapshot();
	});

	it('errors if applied to a property', () => {
		expect(
			() =>
				class TestProp {
					// @ts-expect-error Allow decorator here
					@Bind()
					value = 123;
				},
		).toThrowErrorMatchingSnapshot();
	});

	it('binds methods to an instance', async () => {
		const test = new Test();
		const { getValue, getAsyncValue } = test;

		expect(getValue()).toBe('abc');
		await expect(getAsyncValue()).resolves.toBe('abc');
	});

	it('binds method only once', () => {
		const test = new Test();
		const { getValue, getAsyncValue } = test;

		expect(test.getValue).toBe(test.getValue);
		expect(test.getValue).toBe(getValue);
		expect(test.getAsyncValue).toBe(test.getAsyncValue);
		expect(test.getAsyncValue).toBe(getAsyncValue);
	});

	it('doesnt leak to separate instances', async () => {
		const a = new Test('a');
		const b = new Test('b');
		const c = new Test('c');

		expect(a.getValue()).not.toBe(b.getValue());
		await expect(b.getAsyncValue()).resolves.not.toBe(await c.getAsyncValue());
	});

	it('allows sub-classes to overwrite', () => {
		class TestSub extends Test {
			override getValue() {
				return 'xyz';
			}
		}

		const a = new Test();
		const b = new TestSub();
		const { getValue } = b;

		expect(a.getValue()).toBe('abc');
		expect(b.getValue()).toBe('xyz');
		expect(b.getValue()).toBe(getValue());
	});

	it('allows sub-classes to overwrite and bind', () => {
		class TestSub extends Test {
			@Bind()
			override getValue() {
				return 'xyz';
			}
		}

		const a = new Test();
		const b = new TestSub();
		const { getValue } = b;

		expect(a.getValue()).toBe('abc');
		expect(b.getValue()).toBe('xyz');
		expect(b.getValue()).toBe(getValue());
	});

	it('allows setters to work correctly', () => {
		const test = new Test();
		const { setValue } = test;

		expect(test.getValue()).toBe('abc');

		expect(setValue('xyz')).toBe(test);

		expect(test.getValue()).toBe('xyz');
	});

	it('allows sub-class overwritten setters to work correctly', () => {
		class TestSub extends Test {
			@Bind()
			override setValue(value: string) {
				this.value = `inherited ${value}`;

				return this;
			}
		}

		const a = new Test();
		const b = new TestSub();

		a.setValue('abc');

		expect(a.getValue()).toBe('abc');
		expect(b.getValue()).toBe('abc');

		b.setValue('xyz');

		expect(a.getValue()).toBe('abc');
		expect(b.getValue()).toBe('inherited xyz');
	});

	it('doesnt break parent super calls', () => {
		class TestSub extends Test {
			@Bind()
			override getValue() {
				return `${super.getValue()} child`;
			}
		}

		const a = new Test('a');
		const b = new TestSub('b');
		const { getValue } = b;

		expect(a.getValue()).toBe('a');
		expect(b.getValue()).toBe('b child');
		expect(b.getValue()).toBe(getValue());
	});

	it('supports static methods', () => {
		expect.assertions(1);

		class StaticTest {
			@Bind()
			static test() {
				expect(this).toBe(StaticTest);
			}
		}

		StaticTest.test();
	});
});
