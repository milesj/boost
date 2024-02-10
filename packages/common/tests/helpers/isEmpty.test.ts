import { describe, expect,it } from 'vitest';
import { isEmpty } from '../../src/helpers/isEmpty';

describe('isEmpty()', () => {
	it('returns true for falsy values', () => {
		expect(isEmpty('')).toBe(true);
		expect(isEmpty(0)).toBe(true);
		expect(isEmpty(null)).toBe(true);
		expect(isEmpty(undefined)).toBe(true);
		expect(isEmpty(false)).toBe(true);
	});

	it('returns false for truthy values', () => {
		expect(isEmpty('abc')).toBe(false);
		expect(isEmpty(123)).toBe(false);
		expect(isEmpty(true)).toBe(false);
	});

	it('returns true for an empty object', () => {
		expect(isEmpty({})).toBe(true);
	});

	it('returns false for a non-empty object', () => {
		expect(isEmpty({ foo: 123 })).toBe(false);
	});

	it('returns true for an empty array', () => {
		expect(isEmpty([])).toBe(true);
	});

	it('returns false for a non-empty array', () => {
		expect(isEmpty([123])).toBe(false);
	});
});
