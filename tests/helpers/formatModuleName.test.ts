import formatModuleName from '../../src/helpers/formatModuleName';

describe('formatModuleName()', () => {
  it('lowercases plugin name', () => {
    expect(formatModuleName('foo', 'plugin', 'BAR')).toBe('foo-plugin-bar');
  });

  it('supports dashes', () => {
    expect(formatModuleName('foo', 'plugin', 'bar-baz')).toBe('foo-plugin-bar-baz');
  });

  it('supports custom plugin name', () => {
    expect(formatModuleName('foo', 'addon', 'bar-baz')).toBe('foo-addon-bar-baz');
  });

  it('removes plugin prefix', () => {
    expect(formatModuleName('foo', 'plugin', 'plugin:bar')).toBe('foo-plugin-bar');
  });

  it('supports scoped', () => {
    expect(formatModuleName('foo', 'plugin', 'bar', true)).toBe('@foo/plugin-bar');
  });
});
