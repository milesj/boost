import toArray from '../../src/helpers/toArray';

describe('toArray()', () => {
  it('returns an empty array for undefined', () => {
    expect(toArray()).toEqual([]);
    expect(toArray(undefined)).toEqual([]);
  });

  it('returns an array as is', () => {
    expect(toArray([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('returns non-arrays as an array of 1 item', () => {
    expect(toArray(123)).toEqual([123]);
    expect(toArray(true)).toEqual([true]);
    expect(toArray(null)).toEqual([null]);
    expect(toArray('abc')).toEqual(['abc']);
    expect(toArray({})).toEqual([{}]);
  });
});
