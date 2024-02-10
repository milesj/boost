import { describe, expect,it } from 'vitest';
import { instanceOf } from '../../src/helpers/instanceOf';

describe('instanceOf()', () => {
	class Foo {}
	class Bar {}

	it('returns false if object is falsy', () => {
		expect(instanceOf(undefined, Foo)).toBe(false);
		expect(instanceOf(null, Foo)).toBe(false);
	});

	it('returns true if object extends declaration', () => {
		expect(instanceOf(new Foo(), Foo)).toBe(true);
	});

	it('returns false if object does not extend declaration', () => {
		expect(instanceOf(new Bar(), Foo)).toBe(false);
	});

	it('returns true if object does not extend declaration, but names match', () => {
		class Baz {}

		Object.defineProperty(Baz, 'name', { value: 'Foo' });

		const similar = new Baz();

		expect(instanceOf(similar, Foo)).toBe(true);
	});

	it('returns false if object does not extend declaration, but names match, but loose is disabled', () => {
		class Baz {}

		Object.defineProperty(Baz, 'name', { value: 'Foo' });

		const similar = new Baz();

		expect(instanceOf(similar, Foo, false)).toBe(false);
	});
});
