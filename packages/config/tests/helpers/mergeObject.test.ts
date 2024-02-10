import { describe, expect, it } from 'vitest';
import { mergeObject } from '../../src/helpers/mergeObject';

describe('mergeObject()', () => {
	it('returns a merged object', () => {
		expect(mergeObject({ a: true }, { b: true })).toEqual({ a: true, b: true });
	});

	it('properties of same name overwrite', () => {
		expect(mergeObject({ a: 1 }, { a: 2 })).toEqual({ a: 2 });
	});

	it('shallow merges instead of deep', () => {
		expect(mergeObject({ a: { a: 1, b: 2, c: 3 } }, { a: { d: 4 } })).toEqual({ a: { d: 4 } });
	});

	it('next value can overwrite with undefined', () => {
		expect(mergeObject({ a: 1 }, { a: undefined })).toEqual({ a: undefined });
	});
});
