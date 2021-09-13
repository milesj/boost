import { string } from 'optimal';
import { createBlueprint } from '../../src/helpers/createBlueprint';

describe('createBlueprint()', () => {
	it('returns a blueprint', () => {
		const blueprint = createBlueprint((schemas) => ({
			foo: schemas.string(),
		}));

		expect(blueprint).toEqual({
			foo: string(),
		});
	});
});
