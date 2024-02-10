import { describe, expect, it } from 'vitest';
import { mergeArray } from '../../src/helpers/mergeArray';

describe('mergeArray()', () => {
	it('returns a merged array', () => {
		expect(mergeArray(['foo'], [123])).toEqual(['foo', 123]);
	});

	it('removes undefined values', () => {
		expect(mergeArray(['foo'], [undefined])).toEqual(['foo']);
	});

	it('removes duplicate values', () => {
		expect(mergeArray(['foo'], ['foo'])).toEqual(['foo']);
	});

	it('removes duplicate object references', () => {
		const obj = { foo: 123 };

		expect(mergeArray([obj], [obj])).toEqual([obj]);
	});

	it('persists separate object instances', () => {
		expect(mergeArray([{ foo: 123 }], [{ foo: 123 }])).toEqual([{ foo: 123 }, { foo: 123 }]);
	});
});
