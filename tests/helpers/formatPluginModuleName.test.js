import formatPluginModuleName from '../../src/helpers/formatPluginModuleName';

describe('formatPluginModuleName()', () => {
  it('lowercases plugin name', () => {
    expect(formatPluginModuleName('foo', 'BAR')).toBe('foo-plugin-bar');
  });

  it('supports dashes', () => {
    expect(formatPluginModuleName('foo', 'bar-baz')).toBe('foo-plugin-bar-baz');
  });

  it('removes plugin prefix', () => {
    expect(formatPluginModuleName('foo', 'plugin:bar')).toBe('foo-plugin-bar');
  });
});
