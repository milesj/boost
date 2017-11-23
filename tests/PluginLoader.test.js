import Plugin from '../src/Plugin';
import PluginLoader from '../src/PluginLoader';
import { getTestRoot, copyFixtureToMock } from './helpers';

function createPlugin(name) {
  const plugin = new Plugin();
  plugin.name = name;
  plugin.moduleName = `boost-plugin-${name}`;

  return plugin;
}

describe('PluginLoader', () => {
  let loader;
  let fixtures = [];

  beforeEach(() => {
    loader = new PluginLoader({
      appName: 'boost',
      pluginName: 'plugin',
      root: getTestRoot(),
    });

    fixtures = [];
  });

  afterEach(() => {
    fixtures.forEach(remove => remove());
  });

  describe('importPlugin()', () => {
    it('errors for missing node module', () => {
      expect(() => {
        loader.importPlugin('missing');
      }).toThrowError('Missing plugin module "boost-plugin-missing".');
    });

    it('errors if a non-function is exported', () => {
      fixtures.push(copyFixtureToMock('plugin-exported-nonfunc', 'boost-plugin-nonfunc'));

      expect(() => {
        loader.importPlugin('nonfunc');
      }).toThrowError('Invalid plugin class definition exported from "boost-plugin-nonfunc".');
    });

    it('errors if a non-plugin is exported', () => {
      fixtures.push(copyFixtureToMock('plugin-exported-func', 'boost-plugin-func'));

      expect(() => {
        loader.importPlugin('func');
      }).toThrowError('Plugin exported from "boost-plugin-func" is invalid.');
    });

    it('errors if a plugin instance is exported', () => {
      fixtures.push(copyFixtureToMock('plugin-exported-instance', 'boost-plugin-instance'));

      expect(() => {
        loader.importPlugin('instance');
      }).toThrowError('A plugin class instance was exported from "boost-plugin-instance". Boost requires a plugin class definition to be exported.');
    });

    it('errors if a non-plugin instance is exported', () => {
      fixtures.push(copyFixtureToMock('plugin-exported-nonplugin-instance', 'boost-plugin-nonplugin'));

      expect(() => {
        loader.importPlugin('nonplugin');
      }).toThrowError('Invalid plugin class definition exported from "boost-plugin-nonplugin".');
    });

    it('imports and instantiates a plugin', () => {
      fixtures.push(copyFixtureToMock('plugin-exported-definition', 'boost-plugin-definition'));

      const plugin = loader.importPlugin('definition');

      expect(plugin).toBeInstanceOf(Plugin);
      expect(plugin.name).toBe('definition');
      expect(plugin.moduleName).toBe('boost-plugin-definition');
    });

    it('can customize plugin type name', () => {
      fixtures.push(copyFixtureToMock('plugin-exported-definition', 'boost-addon-definition'));

      loader.options.pluginName = 'addon';

      const plugin = loader.importPlugin('definition');

      expect(plugin.name).toBe('definition');
      expect(plugin.moduleName).toBe('boost-addon-definition');
    });

    it('supports scopeds', () => {
      fixtures.push(copyFixtureToMock('plugin-exported-definition', '@boost/plugin-scoped'));
      loader.options.scoped = true;

      const plugin = loader.importPlugin('scoped');

      expect(plugin.name).toBe('scoped');
      expect(plugin.moduleName).toBe('@boost/plugin-scoped');
    });
  });

  describe('importPluginFromOptions()', () => {
    it('errors if key doesnt exist', () => {
      expect(() => {
        loader.importPluginFromOptions({});
      }).toThrowError('A "plugin" property must exist when loading through an options object.');
    });

    it('errors if key is not a string', () => {
      expect(() => {
        loader.importPluginFromOptions({ plugin: [] });
      }).toThrowError('A "plugin" property must exist when loading through an options object.');
    });

    it('imports and instantiates a plugin with options', () => {
      fixtures.push(copyFixtureToMock('plugin-exported-definition', 'boost-plugin-definition-with-opts'));

      const plugin = loader.importPluginFromOptions({
        foo: 'bar',
        plugin: 'definition-with-opts',
      });

      expect(plugin.options).toEqual({ foo: 'bar' });
      expect(plugin.name).toBe('definition-with-opts');
      expect(plugin.moduleName).toBe('boost-plugin-definition-with-opts');
    });
  });

  describe('loadPlugins()', () => {
    it('errors if an unsupported value is passed', () => {
      expect(() => {
        loader.loadPlugins([123]);
      }).toThrowError('Invalid plugin. Must be a class instance or a module that exports a class definition.');
    });

    it('supports class instances', () => {
      const plugins = [
        createPlugin('foo'),
        createPlugin('bar'),
        createPlugin('baz'),
      ];

      expect(loader.loadPlugins(plugins)).toEqual(plugins);
    });

    it('supports string names', () => {
      fixtures.push(copyFixtureToMock('plugin-exported-definition', 'boost-plugin-foo'));
      fixtures.push(copyFixtureToMock('plugin-exported-definition', 'boost-plugin-bar'));
      fixtures.push(copyFixtureToMock('plugin-exported-definition', 'boost-plugin-baz'));

      expect(loader.loadPlugins([
        'foo',
        'bar',
        'baz',
      ])).toEqual([
        createPlugin('foo'),
        createPlugin('bar'),
        createPlugin('baz'),
      ]);
    });

    it('supports options objects', () => {
      fixtures.push(copyFixtureToMock('plugin-exported-definition', 'boost-plugin-foo'));
      fixtures.push(copyFixtureToMock('plugin-exported-definition', 'boost-plugin-bar'));
      fixtures.push(copyFixtureToMock('plugin-exported-definition', 'boost-plugin-baz'));

      expect(loader.loadPlugins([
        { plugin: 'foo' },
        { plugin: 'bar' },
        { plugin: 'baz' },
      ])).toEqual([
        createPlugin('foo'),
        createPlugin('bar'),
        createPlugin('baz'),
      ]);
    });

    it('supports all 3 at once', () => {
      fixtures.push(copyFixtureToMock('plugin-exported-definition', 'boost-plugin-bar'));
      fixtures.push(copyFixtureToMock('plugin-exported-definition', 'boost-plugin-baz'));

      expect(loader.loadPlugins([
        createPlugin('foo'),
        'bar',
        { plugin: 'baz' },
      ])).toEqual([
        createPlugin('foo'),
        createPlugin('bar'),
        createPlugin('baz'),
      ]);
    });

    it('sorts by priority', () => {
      const foo = createPlugin('foo');
      const bar = createPlugin('bar');
      const baz = createPlugin('baz');

      baz.priority = 1;
      bar.priority = 2;
      foo.priority = 3;

      expect(loader.loadPlugins([foo, bar, baz])).toEqual([baz, bar, foo]);
    });
  });
});
