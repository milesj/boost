import { describe, expect,it } from 'vitest';
import { deepFreeze } from '../../src/helpers/deepFreeze';

describe('deepFreeze()', () => {
	it('returns a frozen object', () => {
		const obj = deepFreeze({
			foo: {
				bar: {
					baz: 123,
				},
			},
		});

		expect(obj).toEqual({
			foo: {
				bar: {
					baz: 123,
				},
			},
		});

		expect(() => {
			// @ts-expect-error Allow type
			obj.foo.bar = 123;
		}).toThrowErrorMatchingSnapshot();
	});

	it('returns already frozen objects', () => {
		const obj1 = Object.freeze({ foo: 123 });
		const obj2 = deepFreeze(obj1);

		expect(obj1).toBe(obj2);
	});
});
