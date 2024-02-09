import { describe, expect,it } from 'vitest';
import { isModuleName } from '../../src/helpers/isModuleName';

describe('isModuleName()', () => {
	it('returns true for traditional names', () => {
		expect(isModuleName('some-package')).toBe(true);
		expect(isModuleName('example.com')).toBe(true);
		expect(isModuleName('under_score')).toBe(true);
		expect(isModuleName('period.js')).toBe(true);
		expect(isModuleName('123numeric')).toBe(true);
	});

	it('returns true for scoped names', () => {
		expect(isModuleName('@foo/some-package')).toBe(true);
		expect(isModuleName('@foo_bar/example.com')).toBe(true);
		expect(isModuleName('@123-foo/under_score')).toBe(true);
		expect(isModuleName('@foo/period.js')).toBe(true);
		expect(isModuleName('@foo.bar/123numeric')).toBe(true);
	});

	it('returns false for an empty string', () => {
		expect(isModuleName('')).toBe(false);
	});

	it('returns false if starts with a period', () => {
		expect(isModuleName('.foo')).toBe(false);
	});

	it('returns false if starts with a underscore', () => {
		expect(isModuleName('_foo')).toBe(false);
	});

	it('returns false if starts with a dash', () => {
		expect(isModuleName('-foo')).toBe(false);
	});

	it('returns false if name contains capitals', () => {
		expect(isModuleName('fooBar')).toBe(false);
	});

	it('returns false if "node_modules"', () => {
		expect(isModuleName('node_modules')).toBe(false);
	});

	it('returns false if "favicon.ico"', () => {
		expect(isModuleName('favicon.ico')).toBe(false);
	});

	it('returns false if a built-in module', () => {
		expect(isModuleName('fs')).toBe(false);
	});
});
