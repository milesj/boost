import { describe, expect, it } from 'vitest';
import { isPlainObject } from '../../src/helpers/isPlainObject';

describe('isPlainObject()', () => {
	it('returns true if a plain object', () => {
		expect(isPlainObject({})).toBe(true);
		expect(isPlainObject(Object.create({}))).toBe(true);
		expect(isPlainObject(Object.create(null))).toBe(true);
	});

	it('returns false for classes', () => {
		class Foo {}

		expect(isPlainObject(Foo)).toBe(false);
		expect(isPlainObject(new Foo())).toBe(false);
	});

	it('returns false for built-ins', () => {
		expect(isPlainObject(/abc/u)).toBe(false);
		expect(isPlainObject(Promise.resolve())).toBe(false);
	});

	it('returns false if an array', () => {
		expect(isPlainObject([])).toBe(false);
	});

	it('returns false if null', () => {
		expect(isPlainObject(null)).toBe(false);
	});

	it('returns false if not an object', () => {
		expect(isPlainObject(123)).toBe(false);
		expect(isPlainObject('abc')).toBe(false);
		expect(isPlainObject(true)).toBe(false);
	});
});
