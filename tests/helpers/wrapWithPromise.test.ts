import wrapWithPromise from '../../src/helpers/wrapWithPromise';

describe('wrapWithPromise()', () => {
  it('wraps the value in a promise', () => {
    expect(wrapWithPromise(123)).toBeInstanceOf(Promise);
  });

  it('returns the promise as is', () => {
    const promise = Promise.resolve(123);

    expect(wrapWithPromise(promise)).toBe(promise);
  });
});
