import mergePlugins from '../../src/helpers/mergePlugins';

describe('mergePlugins()', () => {
  it('returns a merged object', () => {
    expect(mergePlugins({ foo: true }, { bar: true })).toEqual({ foo: true, bar: true });
  });

  it('plugins of same name overwrite', () => {
    expect(mergePlugins({ foo: true }, { foo: false })).toEqual({ foo: false });
  });

  it('plugin options are merged', () => {
    expect(mergePlugins({ foo: { debug: true }, bar: true }, { foo: { debug: false } })).toEqual({
      foo: { debug: false },
      bar: true,
    });
  });

  it('plugin options overwrite booleans', () => {
    expect(mergePlugins({ foo: true }, { foo: { debug: false } })).toEqual({
      foo: { debug: false },
    });
  });

  it('undefined plugin values are skipped', () => {
    expect(
      mergePlugins(
        { foo: true },
        {
          // @ts-expect-error
          foo: undefined,
        },
      ),
    ).toEqual({ foo: true });
  });

  it('supports a list on the left', () => {
    expect(mergePlugins(['foo'], { bar: {} })).toEqual({ foo: true, bar: {} });
  });

  it('supports a list on the right', () => {
    expect(mergePlugins({ foo: true, bar: false }, ['bar'])).toEqual({ foo: true, bar: true });
  });
});
