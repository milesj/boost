import enableDebug from '../../src/helpers/enableDebug';

describe('enableDebug()', () => {
  const oldEnv = process.env.DEBUG;

  beforeEach(() => {
    process.env.DEBUG = '';
  });

  afterEach(() => {
    process.env.DEBUG = oldEnv;
  });

  it('adds to DEBUG if namespace not defined', () => {
    enableDebug('foo');

    expect(process.env.DEBUG).toBe('foo:*');
  });

  it('adds to DEBUG if other namespaces defined', () => {
    process.env.DEBUG = 'bar:*';

    enableDebug('foo');

    expect(process.env.DEBUG).toBe('bar:*,foo:*');
  });

  it('doesnt add to DEBUG if namespace defined', () => {
    process.env.DEBUG = 'foo:*';

    enableDebug('foo');

    expect(process.env.DEBUG).toBe('foo:*');
  });
});
