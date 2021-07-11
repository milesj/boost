import isObject from '../../src/helpers/isObject';

describe('isObject()', () => {
	it('returns true if an object', () => {
		expect(isObject({})).toBe(true);
		expect(isObject(Object.create({}))).toBe(true);
		expect(isObject(Object.create(null))).toBe(true);
	});

	it('returns true for classes', () => {
		class Foo {}

		expect(isObject(new Foo())).toBe(true);
	});

	it('returns true for built-ins', () => {
		expect(isObject(/abc/u)).toBe(true);
		expect(isObject(Promise.resolve())).toBe(true);
	});

	it('returns false if an array', () => {
		expect(isObject([])).toBe(false);
	});

	it('returns false if null', () => {
		expect(isObject(null)).toBe(false);
	});

	it('returns false if not an object', () => {
		expect(isObject(123)).toBe(false);
		expect(isObject('abc')).toBe(false);
		expect(isObject(true)).toBe(false);
	});
});
