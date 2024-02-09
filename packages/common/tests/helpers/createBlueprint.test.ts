import { createBlueprint } from '../../src/helpers/createBlueprint';
import { describe, it, expect } from 'vitest';

describe('createBlueprint()', () => {
	it('returns a blueprint', () => {
		const blueprint = createBlueprint((schemas) => ({
			foo: schemas.string(),
		}));

		expect(blueprint).toHaveProperty('foo');
		expect(blueprint.foo.schema()).toBe('string');
	});
});
