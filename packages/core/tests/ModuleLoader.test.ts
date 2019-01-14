import { getFixurePath } from '@boost/test-utils';
import Plugin from '../src/Plugin';
import ModuleLoader from '../src/ModuleLoader';
import { getFixturePath, copyFixtureToMock, createTestTool } from './helpers';
// @ts-ignore
import TestPlugin from './fixtures/plugin-exported-definition';

function createPlugin(name: string, options: any = {}): Plugin {
  const plugin = new TestPlugin(options);
  plugin.name = name;
  plugin.moduleName = `test-boost-plugin-${name}`;

  return plugin;
}

describe('ModuleLoader', () => {
  let loader: ModuleLoader<any>;
  let fixtures: (() => void)[] = [];

  beforeEach(() => {
    loader = new ModuleLoader(
      createTestTool({
        root: getFixturePath('app'),
      }),
      'plugin',
      Plugin,
    );

    fixtures = [];
  });

  afterEach(() => {
    fixtures.forEach(remove => remove());
  });

  describe('importModule()', () => {
    it('errors for missing node module', () => {
      expect(() => {
        loader.importModule('missing');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors for missing node module (with scope)', () => {
      expect(() => {
        loader.tool.options.scoped = true;
        loader.importModule('missing');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors for missing node module (with boost)', () => {
      expect(() => {
        loader.scopes = ['boost'];
        loader.tool.options.scoped = true;
        loader.importModule('missing');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if a non-function is exported', () => {
      fixtures.push(copyFixtureToMock('plugin-exported-nonfunc', 'test-boost-plugin-nonfunc'));

      expect(() => {
        loader.importModule('nonfunc');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if a non-plugin is exported', () => {
      fixtures.push(copyFixtureToMock('plugin-exported-func', 'test-boost-plugin-func'));

      expect(() => {
        loader.importModule('func');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if a plugin instance is exported', () => {
      fixtures.push(copyFixtureToMock('plugin-exported-instance', 'test-boost-plugin-instance'));

      expect(() => {
        loader.importModule('instance');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if a non-plugin instance is exported', () => {
      fixtures.push(
        copyFixtureToMock('plugin-exported-nonplugin-instance', 'test-boost-plugin-nonplugin'),
      );

      expect(() => {
        loader.importModule('nonplugin');
      }).toThrowErrorMatchingSnapshot();
    });

    it('imports and instantiates a plugin', () => {
      fixtures.push(
        copyFixtureToMock('plugin-exported-definition', 'test-boost-plugin-definition'),
      );

      const plugin = loader.importModule('definition');

      expect(plugin).toBeInstanceOf(Plugin);
      expect(plugin.name).toBe('definition');
      expect(plugin.moduleName).toBe('test-boost-plugin-definition');
    });

    it('imports and returns a theme object', () => {
      fixtures.push(copyFixtureToMock('theme-exported-object', 'test-boost-theme-object'));

      loader = new ModuleLoader(
        createTestTool({
          root: getFixturePath('app'),
        }),
        'theme',
      );

      const palette = loader.importModule('object');

      expect(palette).toEqual({
        default: 'white',
        failure: 'red',
        pending: 'gray',
        success: 'green',
        warning: 'yellow',
      });
    });

    it('imports using a file path', () => {
      fixtures.push(
        copyFixtureToMock('plugin-exported-definition', 'test-boost-plugin-definition'),
      );

      const plugin = loader.importModule(getFixturePath('plugin-exported-definition'));

      expect(plugin).toBeInstanceOf(Plugin);
      expect(plugin.name).toBe('');
      expect(plugin.moduleName).toBe('');
    });

    it('can customize type name', () => {
      fixtures.push(copyFixtureToMock('plugin-exported-definition', 'test-boost-addon-definition'));

      loader.typeName = 'addon';

      const plugin = loader.importModule('definition');

      expect(plugin.name).toBe('definition');
      expect(plugin.moduleName).toBe('test-boost-addon-definition');
    });

    it('supports app scopes', () => {
      fixtures.push(copyFixtureToMock('plugin-exported-definition', '@test-boost/plugin-scoped'));
      loader.tool.options.scoped = true;

      const plugin = loader.importModule('scoped');

      expect(plugin.name).toBe('scoped');
      expect(plugin.moduleName).toBe('@test-boost/plugin-scoped');
    });

    it('supports additional scopes', () => {
      fixtures.push(copyFixtureToMock('plugin-exported-definition', 'custom-scope-plugin-scoped'));
      loader.scopes = ['custom-scope'];

      const plugin = loader.importModule('scoped');

      expect(plugin.name).toBe('scoped');
      expect(plugin.moduleName).toBe('custom-scope-plugin-scoped');
    });
  });

  describe('importModuleFromOptions()', () => {
    it('errors if key doesnt exist', () => {
      expect(() => {
        loader.importModuleFromOptions({});
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if key is not a string', () => {
      expect(() => {
        loader.importModuleFromOptions({ plugin: [] });
      }).toThrowErrorMatchingSnapshot();
    });

    it('imports and instantiates a plugin with options', () => {
      fixtures.push(
        copyFixtureToMock('plugin-exported-definition', 'test-boost-plugin-definition-with-opts'),
      );

      const plugin = loader.importModuleFromOptions({
        foo: 'bar',
        plugin: 'definition-with-opts',
      });

      expect(plugin.options).toEqual({ foo: 'bar', bar: false, baz: 0 });
      expect(plugin.name).toBe('definition-with-opts');
      expect(plugin.moduleName).toBe('test-boost-plugin-definition-with-opts');
    });

    it('merges options correctly', () => {
      fixtures.push(
        copyFixtureToMock('plugin-exported-definition', 'test-boost-plugin-definition-merge-opts'),
      );

      const plugin = loader.importModuleFromOptions(
        {
          foo: 'bar',
          plugin: 'definition-with-opts',
        },
        [{ foo: 'wtf', baz: 123 }],
      );

      expect(plugin.options).toEqual({ foo: 'bar', bar: false, baz: 123 });
    });
  });

  describe('loadModules()', () => {
    it('errors if an unsupported value is passed', () => {
      expect(() => {
        loader.loadModules([123]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns an empty array if no values', () => {
      expect(loader.loadModules()).toEqual([]);
      expect(loader.loadModules([])).toEqual([]);
    });

    it('supports class instances', () => {
      const plugins = [createPlugin('foo'), createPlugin('bar'), createPlugin('baz')];

      expect(loader.loadModules(plugins)).toEqual(plugins);
    });

    it('supports string names', () => {
      fixtures.push(copyFixtureToMock('plugin-exported-definition', 'test-boost-plugin-foo'));
      fixtures.push(copyFixtureToMock('plugin-exported-definition', 'test-boost-plugin-bar'));
      fixtures.push(copyFixtureToMock('plugin-exported-definition', 'test-boost-plugin-baz'));

      expect(loader.loadModules(['foo', 'bar', 'baz'])).toEqual([
        createPlugin('foo'),
        createPlugin('bar'),
        createPlugin('baz'),
      ]);
    });

    it('supports options objects', () => {
      fixtures.push(copyFixtureToMock('plugin-exported-definition', 'test-boost-plugin-foo'));
      fixtures.push(copyFixtureToMock('plugin-exported-definition', 'test-boost-plugin-bar'));
      fixtures.push(copyFixtureToMock('plugin-exported-definition', 'test-boost-plugin-baz'));

      expect(loader.loadModules([{ plugin: 'foo' }, { plugin: 'bar' }, { plugin: 'baz' }])).toEqual(
        [createPlugin('foo'), createPlugin('bar'), createPlugin('baz')],
      );
    });

    it('supports all 3 at once', () => {
      fixtures.push(copyFixtureToMock('plugin-exported-definition', 'test-boost-plugin-bar'));
      fixtures.push(copyFixtureToMock('plugin-exported-definition', 'test-boost-plugin-baz'));

      expect(loader.loadModules([createPlugin('foo'), 'bar', { plugin: 'baz' }])).toEqual([
        createPlugin('foo'),
        createPlugin('bar'),
        createPlugin('baz'),
      ]);
    });

    it('pass options to string names', () => {
      fixtures.push(copyFixtureToMock('plugin-exported-definition', 'test-boost-plugin-foo'));

      const foo = createPlugin('foo');
      // @ts-ignore Allow
      foo.options.bar = true;

      expect(loader.loadModules(['foo'], [{ bar: true }])).toEqual([foo]);
    });

    it('pass options to option objects', () => {
      fixtures.push(copyFixtureToMock('plugin-exported-definition', 'test-boost-plugin-foo'));

      const foo = createPlugin('foo');
      // @ts-ignore Allow
      foo.options.bar = true;

      expect(loader.loadModules([{ plugin: 'foo' }], [{ bar: true }])).toEqual([foo]);
    });
  });
});
