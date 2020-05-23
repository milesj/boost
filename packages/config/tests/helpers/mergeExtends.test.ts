import mergeExtends from '../../src/helpers/mergeExtends';

describe('mergeExtends()', () => {
  it('removes duplicates', () => {
    expect(mergeExtends(['foo'], 'foo')).toEqual(['foo']);
  });

  it('supports previous string, next array', () => {
    expect(mergeExtends('foo', ['bar', 'baz'])).toEqual(['foo', 'bar', 'baz']);
  });

  it('supports previous array, next string', () => {
    expect(mergeExtends(['foo', 'bar'], 'baz')).toEqual(['foo', 'bar', 'baz']);
  });

  it('supports previous and next string', () => {
    expect(mergeExtends('foo', 'baz')).toEqual(['foo', 'baz']);
  });

  it('supports previous and next array', () => {
    expect(mergeExtends(['foo', 'bar'], ['bar', 'baz'])).toEqual(['foo', 'bar', 'baz']);
  });
});
