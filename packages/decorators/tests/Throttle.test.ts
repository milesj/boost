import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { Throttle } from '../src';

describe('@Throttle()', () => {
	class Test {
		@Throttle(100)
		log(...args: unknown[]) {
			console.log('Logged!', ...args);
		}
	}

	let spy: MockInstance;

	beforeEach(() => {
		vi.useFakeTimers();

		spy = vi.spyOn(console, 'log').mockImplementation(() => {});
	});

	afterEach(() => {
		spy.mockRestore();

		vi.useRealTimers();
	});

	it('errors if applied to a class', () => {
		expect(() => {
			// @ts-expect-error Allow decorator here
			@Throttle(100)
			class TestClass {}

			return TestClass;
		}).toThrowErrorMatchingSnapshot();
	});

	it('errors if applied to a property', () => {
		expect(
			() =>
				class TestProp {
					// @ts-expect-error Allow decorator here
					@Throttle(100)
					value = 123;
				},
		).toThrowErrorMatchingSnapshot();
	});

	it('logs once within the delay', () => {
		const test = new Test();

		test.log();

		expect(spy).toHaveBeenCalledWith('Logged!');

		test.log();
		test.log();
		test.log();

		expect(spy).toHaveBeenCalledTimes(1);

		vi.advanceTimersByTime(150);

		test.log();

		expect(spy).toHaveBeenCalledWith('Logged!');
		expect(spy).toHaveBeenCalledTimes(2);
	});

	it('passes arguments through', () => {
		const test = new Test();

		test.log(1, 2);
		test.log(3, 4);
		test.log(5, 6);

		vi.advanceTimersByTime(150);

		expect(spy).toHaveBeenCalledWith('Logged!', 1, 2);
		expect(spy).toHaveBeenCalledTimes(1);
	});
});
