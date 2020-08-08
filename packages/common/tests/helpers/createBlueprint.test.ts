import { string } from 'optimal';
import createBlueprint from '../../src/helpers/createBlueprint';

describe('createBlueprint()', () => {
  it('returns a blueprint', () => {
    const blueprint = createBlueprint((predicats) => ({
      foo: predicats.string(),
    }));

    expect(blueprint).toEqual({
      foo: string(),
    });
  });
});
