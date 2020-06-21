import getEnv from '../../src/helpers/getEnv';

describe('getEnv()', () => {
  it('returns from project named env', () => {
    process.env.BOOST_TEST_ENV = 'test';

    expect(getEnv('boostTest')).toBe('test');

    delete process.env.BOOST_TEST_ENV;
  });

  it('returns from node env', () => {
    process.env.NODE_ENV = 'staging';

    expect(getEnv('boostTest')).toBe('staging');

    process.env.NODE_ENV = 'test';
  });

  it('returns "development" if no env', () => {
    delete process.env.NODE_ENV;

    expect(getEnv('boostTest')).toBe('development');

    process.env.NODE_ENV = 'test';
  });
});
