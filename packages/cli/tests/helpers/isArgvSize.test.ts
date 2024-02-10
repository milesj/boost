import { describe, expect, it } from 'vitest';
import { isArgvSize } from '../../src/helpers/isArgvSize';

describe('isArgvSize()', () => {
	it('returns true if an empty array', () => {
		expect(isArgvSize([], 0)).toBe(true);
	});

	it('returns true if starts with process binaries but no additional args', () => {
		expect(isArgvSize(['/node', '/bin.js'], 0)).toBe(true);
	});

	it('returns true if contains rest args but no additional args', () => {
		expect(isArgvSize(['--', 'foo', 'bar'], 0)).toBe(true);
	});

	it('returns true for both conditions above', () => {
		expect(isArgvSize(['/node', '/bin.js', '--', 'foo', 'bar'], 0)).toBe(true);
	});

	it('returns false if theres an arg', () => {
		expect(isArgvSize(['foo'], 0)).toBe(false);
	});

	it('returns false if theres an arg after process binaries', () => {
		expect(isArgvSize(['/node', '/bin.js', 'foo'], 0)).toBe(false);
	});

	it('returns false if theres an arg before rest args', () => {
		expect(isArgvSize(['foo', '--', 'foo', 'bar'], 0)).toBe(false);
	});

	it('returns false for both conditions above', () => {
		expect(isArgvSize(['/node', '/bin.js', 'foo', '--', 'foo', 'bar'], 0)).toBe(false);
	});

	it('returns true for custom size', () => {
		expect(isArgvSize(['--help'], 1)).toBe(true);
	});

	it('returns true for custom size and conditions', () => {
		expect(isArgvSize(['/node', '/bin.js', '--help', '--', 'foo', 'bar'], 1)).toBe(true);
	});
});
