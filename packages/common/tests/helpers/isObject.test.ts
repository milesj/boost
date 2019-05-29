import isObject from '../../src/helpers/isObject';

describe('isObject()', () => {
  it('returns true if a plain object', () => {
    expect(isObject({})).toBe(true);
  });

  it('returns false if an array', () => {
    expect(isObject([])).toBe(false);
  });

  it('returns false if null', () => {
    expect(isObject(null)).toBe(false);
  });

  it('returns false if not an object', () => {
    expect(isObject(123)).toBe(false);
    expect(isObject('abc')).toBe(false);
    expect(isObject(true)).toBe(false);
  });
});
