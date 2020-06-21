import overwrite from '../../src/helpers/overwrite';

describe('overwrite()', () => {
  it('returns the next value', () => {
    expect(overwrite<string | number>('foo', 123)).toBe(123);
  });
});
