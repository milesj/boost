import formatPluginModuleName from '../../src/helpers/formatPluginModuleName';

describe('formatPluginModuleName()', () => {
  it('lowercases plugin name', () => {
    expect(formatPluginModuleName('foo', 'plugin', 'BAR')).toBe('foo-plugin-bar');
  });

  it('supports dashes', () => {
    expect(formatPluginModuleName('foo', 'plugin', 'bar-baz')).toBe('foo-plugin-bar-baz');
  });

  it('supports custom plugin name', () => {
    expect(formatPluginModuleName('foo', 'addon', 'bar-baz')).toBe('foo-addon-bar-baz');
  });

  it('removes plugin prefix', () => {
    expect(formatPluginModuleName('foo', 'plugin', 'plugin:bar')).toBe('foo-plugin-bar');
  });

  it('supports namespace', () => {
    expect(formatPluginModuleName('foo', 'plugin', 'bar', true)).toBe('@foo/plugin-bar');
  });
});
