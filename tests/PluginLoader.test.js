import fs from 'fs-extra';
import Plugin from '../src/Plugin';
import PluginLoader from '../src/PluginLoader';

const createdPlugins = new Set();

function createPlugin(name) {
  const plugin = new Plugin();
  plugin.name = name;
  plugin.moduleName = `boost-plugin-${name}`;

  return plugin;
}

function createPluginPackage(fixture, plugin) {
  fs.copySync(
    `./tests/fixtures/${fixture}`,
    `./node_modules/${plugin}`,
    { overwrite: true },
  );

  fs.writeJsonSync(`./node_modules/${plugin}/package.json`, {
    main: './index.js',
    name: plugin,
    version: '0.0.0',
  });

  createdPlugins.add(plugin);
}

function removePluginPackage(plugin) {
  fs.removeSync(`./node_modules/${plugin}`);

  createdPlugins.delete(plugin);
}

describe('PluginLoader', () => {
  let loader;

  beforeEach(() => {
    loader = new PluginLoader({
      appName: 'boost',
      pluginName: 'plugin',
      root: process.cwd(),
    });
  });

  afterEach(() => {
    createdPlugins.forEach(plugin => removePluginPackage(plugin));
  });

  describe('importPlugin()', () => {
    it('errors for missing node module', () => {
      expect(() => {
        loader.importPlugin('missing');
      }).toThrowError('Missing plugin module "boost-plugin-missing".');
    });

    it('errors if a non-function is exported', () => {
      createPluginPackage('plugin-exported-nonfunc', 'boost-plugin-nonfunc');

      expect(() => {
        loader.importPlugin('nonfunc');
      }).toThrowError('Invalid plugin class definition exported from "boost-plugin-nonfunc".');
    });

    it('errors if a non-plugin is exported', () => {
      createPluginPackage('plugin-exported-func', 'boost-plugin-func');

      expect(() => {
        loader.importPlugin('func');
      }).toThrowError('Plugin exported from "boost-plugin-func" is invalid.');
    });

    it('errors if a plugin instance is exported', () => {
      createPluginPackage('plugin-exported-instance', 'boost-plugin-instance');

      expect(() => {
        loader.importPlugin('instance');
      }).toThrowError('A plugin class instance was exported from "boost-plugin-instance". Boost requires a plugin class definition to be exported.');
    });

    it('errors if a non-plugin instance is exported', () => {
      createPluginPackage('plugin-exported-nonplugin-instance', 'boost-plugin-nonplugin');

      expect(() => {
        loader.importPlugin('nonplugin');
      }).toThrowError('Invalid plugin class definition exported from "boost-plugin-nonplugin".');
    });

    it('imports and instantiates a plugin', () => {
      createPluginPackage('plugin-exported-definition', 'boost-plugin-definition');

      const plugin = loader.importPlugin('definition');

      expect(plugin).toBeInstanceOf(Plugin);
      expect(plugin.name).toBe('definition');
      expect(plugin.moduleName).toBe('boost-plugin-definition');
    });

    it('can customize plugin type name', () => {
      createPluginPackage('plugin-exported-definition', 'boost-addon-definition');

      loader.options.pluginName = 'addon';

      const plugin = loader.importPlugin('definition');

      expect(plugin.name).toBe('definition');
      expect(plugin.moduleName).toBe('boost-addon-definition');
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
      createPluginPackage('plugin-exported-definition', 'boost-plugin-definition-with-opts');

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
      createPluginPackage('plugin-exported-definition', 'boost-plugin-foo');
      createPluginPackage('plugin-exported-definition', 'boost-plugin-bar');
      createPluginPackage('plugin-exported-definition', 'boost-plugin-baz');

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
      createPluginPackage('plugin-exported-definition', 'boost-plugin-foo');
      createPluginPackage('plugin-exported-definition', 'boost-plugin-bar');
      createPluginPackage('plugin-exported-definition', 'boost-plugin-baz');

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
      createPluginPackage('plugin-exported-definition', 'boost-plugin-bar');
      createPluginPackage('plugin-exported-definition', 'boost-plugin-baz');

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
