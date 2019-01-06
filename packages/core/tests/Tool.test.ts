import path from 'path';
import { string } from 'optimal';
import Tool from '../src/Tool';
import Plugin from '../src/Plugin';
import Reporter from '../src/Reporter';
import BoostReporter from '../src/reporters/BoostReporter';
import enableDebug from '../src/helpers/enableDebug';
import {
  getFixturePath,
  copyFixtureToMock,
  createTestTool,
  TestPluginRegistry,
  TestToolConfig,
  TEST_TOOL_CONFIG,
  TEST_PACKAGE_JSON,
} from './helpers';

jest.mock('../src/helpers/enableDebug');

class Foo extends Plugin {}
class Bar extends Plugin {}
class Baz {}

describe('Tool', () => {
  let tool: Tool<TestPluginRegistry, TestToolConfig>;
  let toolWithPlugins: Tool<
    TestPluginRegistry & {
      foo: Foo;
      bar: Bar;
      baz: Baz;
    },
    TestToolConfig
  >;

  beforeEach(() => {
    tool = createTestTool({
      root: getFixturePath('app'),
    });
    // @ts-ignore Allow private access
    tool.initialized = false; // Reset

    toolWithPlugins = createTestTool({
      root: getFixturePath('app'),
    }) as any;
  });

  describe('constructor()', () => {
    it('can define config blueprint', () => {
      tool = createTestTool({
        configBlueprint: {
          name: string(),
        },
      });

      expect(tool.options.configBlueprint).toEqual({
        name: string(),
      });
    });

    it('can define settings blueprint', () => {
      tool = createTestTool({
        settingsBlueprint: {
          name: string(),
        },
      });

      expect(tool.options.settingsBlueprint).toEqual({
        name: string(),
      });
    });
  });

  describe('addPlugin()', () => {
    beforeEach(() => {
      toolWithPlugins.registerPlugin('foo', Foo);
      toolWithPlugins.registerPlugin('bar', Bar);
      toolWithPlugins.registerPlugin('baz', Baz);
    });

    it('errors if type has not been registered', () => {
      expect(() => {
        // @ts-ignore Allow invalid type
        toolWithPlugins.addPlugin('qux', new Plugin());
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if type does not extend `Plugin`', () => {
      expect(() => {
        toolWithPlugins.addPlugin('baz', new Baz());
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if type does not extend defined contract', () => {
      expect(() => {
        // @ts-ignore Allow invalid instance
        toolWithPlugins.addPlugin('foo', new Bar());
      }).toThrowErrorMatchingSnapshot();
    });

    it('sets tool on plugin', () => {
      const plugin = new Foo();

      toolWithPlugins.addPlugin('foo', plugin);

      expect(plugin.tool).toBe(toolWithPlugins);
    });

    it('calls bootstrap() on plugin', () => {
      const plugin = new Foo();
      const spy = jest.spyOn(plugin, 'bootstrap');

      toolWithPlugins.addPlugin('foo', plugin);

      expect(spy).toHaveBeenCalled();
    });

    it('adds to plugins list', () => {
      expect(toolWithPlugins.getPlugins('foo')).toHaveLength(0);

      toolWithPlugins.addPlugin('foo', new Foo());
      toolWithPlugins.addPlugin('foo', new Foo());

      expect(toolWithPlugins.getPlugins('foo')).toHaveLength(2);
    });

    it('sets console on reporter', () => {
      const reporter = new BoostReporter();

      toolWithPlugins.addPlugin('reporter', reporter);

      // @ts-ignore Allow protected access
      expect(reporter.console).toBe(toolWithPlugins.console);
    });

    it('doesnt set console on non-reporter', () => {
      const plugin = new Foo();

      toolWithPlugins.addPlugin('foo', plugin);

      // @ts-ignore
      expect(plugin.console).not.toBe(tool.console);
    });
  });

  describe('createDebugger()', () => {
    it('returns a debug function', () => {
      const debug = tool.createDebugger('foo');

      expect(typeof debug).toBe('function');
      expect(debug.namespace).toBe('test-boost:foo');
    });

    it('provides an invariant function', () => {
      const debug = tool.createDebugger('foo');

      expect(typeof debug.invariant).toBe('function');
    });
  });

  describe('createTranslator', () => {
    it('returns an i18n instance', () => {
      const i18n = tool.createTranslator();

      expect(typeof i18n).toBe('object');
      expect(i18n.options.backend).toEqual({
        resourcePaths: [path.join(__dirname, '../resources'), path.join(__dirname, 'resources')],
      });
    });
  });

  describe('exit()', () => {
    it('accepts null (no error)', () => {
      const spy = jest.fn();

      tool.console.stop = spy;
      tool.exit();

      expect(spy).toHaveBeenCalledWith(null, false);
    });

    it('accepts a string', () => {
      const spy = jest.fn();

      tool.console.stop = spy;
      tool.exit('Oops');

      expect(spy).toHaveBeenCalledWith('Oops', true);
    });

    it('accepts an error', () => {
      const error = new Error('Oh nooo');
      const spy = jest.fn();

      tool.console.stop = spy;
      tool.exit(error);

      expect(spy).toHaveBeenCalledWith(error, true);
    });
  });

  describe('getPlugin()', () => {
    it('errors for invalid type', () => {
      expect(() => {
        // @ts-ignore Allow invalid type
        tool.getPlugin('unknown', 'foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if not found', () => {
      expect(() => {
        tool.getPlugin('plugin', 'foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns plugin by name', () => {
      const plugin = new Plugin();
      plugin.name = 'foo';

      // @ts-ignore Allow access
      tool.plugins.plugin = [plugin];

      expect(tool.getPlugin('plugin', 'foo')).toBe(plugin);
    });
  });

  describe('getWorkspacePackagePaths()', () => {
    it('returns an empty array if no workspace config', () => {
      expect(tool.getWorkspacePackagePaths(getFixturePath('workspace-no-packages'))).toEqual([]);
    });

    it('returns an empty array if no workspace packages', () => {
      expect(tool.getWorkspacePackagePaths(getFixturePath('workspace-mismatch'))).toEqual([]);
    });

    it('returns an array of all packages within all workspaces', () => {
      expect(tool.getWorkspacePackagePaths(getFixturePath('workspace-multiple'))).toEqual([
        getFixturePath('workspace-multiple', 'packages/baz'),
        getFixturePath('workspace-multiple', 'packages/foo'),
        getFixturePath('workspace-multiple', 'modules/bar'),
      ]);
    });

    it('returns an array of all packages within all workspaces as relative paths', () => {
      expect(tool.getWorkspacePackagePaths(getFixturePath('workspace-multiple'), true)).toEqual([
        'packages/baz',
        'packages/foo',
        'modules/bar',
      ]);
    });
  });

  describe('getWorkspacePaths', () => {
    it('returns an empty array if no workspace config', () => {
      expect(tool.getWorkspacePaths(getFixturePath('workspace-no-packages'))).toEqual([]);
    });

    it('returns an array of workspaces for yarn `workspaces` property', () => {
      expect(tool.getWorkspacePaths(getFixturePath('workspace-yarn'))).toEqual([
        getFixturePath('workspace-yarn', 'packages/*'),
      ]);
    });

    it('returns an array of workspaces for yarn no hoist `workspaces.packages` property', () => {
      expect(tool.getWorkspacePaths(getFixturePath('workspace-yarn-nohoist'))).toEqual([
        getFixturePath('workspace-yarn-nohoist', 'packages/*'),
      ]);
    });

    it('returns an array of workspaces for lerna `packages` property', () => {
      expect(tool.getWorkspacePaths(getFixturePath('workspace-lerna'))).toEqual([
        getFixturePath('workspace-lerna', 'packages/*'),
      ]);
    });

    it('returns an array of all workspaces', () => {
      expect(tool.getWorkspacePaths(getFixturePath('workspace-multiple'))).toEqual([
        getFixturePath('workspace-multiple', 'packages/*'),
        getFixturePath('workspace-multiple', 'modules/*'),
      ]);
    });

    it('returns an array of all workspaces as relative paths', () => {
      expect(tool.getWorkspacePaths(getFixturePath('workspace-multiple'), true)).toEqual([
        'packages/*',
        'modules/*',
      ]);
    });
  });

  describe('initialize()', () => {
    it('loads config', () => {
      // @ts-ignore Allow missing fields
      tool.config = {};

      expect(tool.config).toEqual({});
      expect(tool.package).toEqual({ ...TEST_PACKAGE_JSON });
      // @ts-ignore Allow private access
      expect(tool.initialized).toBe(false);

      tool.initialize();

      expect(tool.config).not.toEqual({});
      expect(tool.package).not.toEqual({ ...TEST_PACKAGE_JSON });
      // @ts-ignore Allow private access
      expect(tool.initialized).toBe(true);
    });
  });

  describe('loadConfig()', () => {
    it('doesnt load if initialized', () => {
      // @ts-ignore
      tool.config = {};
      // @ts-ignore
      tool.package = {};
      // @ts-ignore Allow private access
      tool.initialized = true;
      tool.loadConfig();

      expect(tool.config).toEqual({});
      expect(tool.package).toEqual({});
    });

    it('loads package.json', () => {
      tool.loadConfig();

      expect(tool.package).toEqual({
        name: 'test-boost-app',
        version: '0.0.0',
      });
    });

    it('loads config file', () => {
      tool.loadConfig();

      expect(tool.config).toEqual({
        ...TEST_TOOL_CONFIG,
        foo: 'bar',
      });
    });

    it('enables debug if debug config is true', () => {
      tool.args = { $0: '', _: [], debug: true };
      tool.loadConfig();

      expect(enableDebug).toHaveBeenCalledWith('test-boost');
    });

    // it('updates locale if defined', () => {
    //   const spy = jest.spyOn(tool.translator, 'changeLanguage');

    //   // @ts-ignore Allow private access
    //   tool.configLoader.loadConfig = jest.fn(() => ({ locale: 'fr' }));
    //   tool.loadConfig();

    //   expect(spy).toHaveBeenCalledWith('fr');
    // });
  });

  describe('loadPlugins()', () => {
    it('errors if config is falsy', () => {
      expect(() => {
        // @ts-ignore
        tool.config = null;
        tool.loadPlugins();
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if config is an empty object', () => {
      expect(() => {
        // @ts-ignore
        tool.config = {};
        tool.loadPlugins();
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt load if no plugins found in config', () => {
      tool.config = { ...TEST_TOOL_CONFIG };
      tool.loadPlugins();

      // @ts-ignore Allow access
      expect(tool.plugins).toEqual({ plugin: [], reporter: [] });
    });

    it('doesnt load if initialized', () => {
      // @ts-ignore Allow private access
      tool.initialized = true;
      tool.config = { ...TEST_TOOL_CONFIG, plugins: ['foo'] };
      tool.loadPlugins();

      // @ts-ignore Allow access
      expect(tool.plugins).toEqual({ plugin: [], reporter: [] });
    });

    it('bootstraps plugins on load', () => {
      const plugin = new Plugin();
      const spy = jest.spyOn(plugin, 'bootstrap');

      tool.config = { ...TEST_TOOL_CONFIG, plugins: [plugin] };
      tool.loadPlugins();

      expect(spy).toHaveBeenCalled();
    });

    it('bootstraps plugins with tool if bootstrap() is overridden', () => {
      class TestPlugin extends Plugin {
        bootstrap() {}
      }

      const plugin = new TestPlugin();

      tool.config = { ...TEST_TOOL_CONFIG, plugins: [plugin] };
      tool.loadPlugins();

      expect(plugin.tool).toBe(tool);
    });

    it('sorts by priority', () => {
      const foo = new Plugin();
      const bar = new Plugin();
      const baz = new Plugin();

      baz.priority = 1;
      bar.priority = 2;
      foo.priority = 3;

      tool.config = { ...TEST_TOOL_CONFIG, plugins: [foo, bar, baz] };
      tool.loadPlugins();

      // @ts-ignore Allow access
      expect(tool.plugins).toEqual({ plugin: [baz, bar, foo], reporter: [] });
    });

    it('loads reporter using a string', () => {
      const unmock = copyFixtureToMock('reporter', 'test-boost-reporter-foo');

      tool.config = { ...TEST_TOOL_CONFIG, reporters: ['foo'] };
      tool.loadPlugins();

      expect(tool.getPlugins('reporter')[0]).toBeInstanceOf(Reporter);
      expect(tool.getPlugins('reporter')[0].name).toBe('foo');
      expect(tool.getPlugins('reporter')[0].moduleName).toBe('test-boost-reporter-foo');

      unmock();
    });

    it('loads reporter using an object', () => {
      const unmock = copyFixtureToMock('reporter', 'test-boost-reporter-bar');

      tool.config = { ...TEST_TOOL_CONFIG, reporters: [{ reporter: 'bar' }] };
      tool.loadPlugins();

      expect(tool.getPlugins('reporter')[0]).toBeInstanceOf(Reporter);
      expect(tool.getPlugins('reporter')[0].name).toBe('bar');
      expect(tool.getPlugins('reporter')[0].moduleName).toBe('test-boost-reporter-bar');

      unmock();
    });

    it('passes options to reporter', () => {
      const unmock = copyFixtureToMock('reporter', 'test-boost-reporter-baz');

      tool.config = { ...TEST_TOOL_CONFIG, reporters: [{ reporter: 'baz', foo: 'bar' }] };
      tool.loadPlugins();

      const [reporter] = tool.getPlugins('reporter');

      expect(reporter.options).toEqual({ foo: 'bar' });

      unmock();
    });
  });

  describe('loadReporters()', () => {
    it('errors if config is falsy', () => {
      expect(() => {
        // @ts-ignore
        tool.config = null;
        tool.loadReporters();
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if config is an empty object', () => {
      expect(() => {
        // @ts-ignore
        tool.config = {};
        tool.loadReporters();
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt load if initialized', () => {
      // @ts-ignore Allow private access
      tool.initialized = true;
      tool.loadReporters();

      expect(tool.getPlugins('reporter')).toHaveLength(0);
    });

    it('loads default reporter if none defined', () => {
      tool.loadReporters();

      expect(tool.getPlugins('reporter')[0]).toBeInstanceOf(BoostReporter);
    });
  });

  describe('loadWorkspacePackages()', () => {
    it('returns an empty array if no workspace config', () => {
      expect(tool.loadWorkspacePackages(getFixturePath('workspace-no-packages'))).toEqual([]);
    });

    it('loads all package.jsons and appends metadata', () => {
      const root = getFixturePath('workspace-multiple');
      const packages = tool.loadWorkspacePackages(root);

      expect(packages).toEqual([
        {
          name: 'test-boost-workspace-multiple-baz',
          version: '0.0.0',
          workspace: tool.createWorkspaceMetadata(path.join(root, 'packages/baz/package.json')),
        },
        {
          name: 'test-boost-workspace-multiple-foo',
          version: '0.0.0',
          workspace: tool.createWorkspaceMetadata(path.join(root, 'packages/foo/package.json')),
        },
        {
          name: 'test-boost-workspace-multiple-bar',
          version: '0.0.0',
          workspace: tool.createWorkspaceMetadata(path.join(root, 'modules/bar/package.json')),
        },
      ]);
    });
  });

  describe('log()', () => {
    it('sends log to console', () => {
      const spy = jest.spyOn(tool.console, 'log');

      tool.log('Some message: %s', 'foo');

      expect(spy).toHaveBeenCalledWith('Some message: foo');
    });
  });

  describe('logLive()', () => {
    it('sends log to console', () => {
      const old = console.log.bind(console);
      const log = jest.fn();
      const spy = jest.spyOn(tool.console, 'logLive');

      console.log = log;

      tool.logLive('Some message: %s', 'foo');

      expect(spy).toHaveBeenCalledWith('Some message: foo');

      console.log = old;
    });
  });

  describe('logError()', () => {
    it('sends error to console', () => {
      const spy = jest.spyOn(tool.console, 'logError');

      tool.logError('Some error: %s', 'foo');

      expect(spy).toHaveBeenCalledWith('Some error: foo');
    });
  });

  describe('registerPlugin()', () => {
    it('errors if type is already defined', () => {
      expect(() => {
        toolWithPlugins.registerPlugin('foo', Foo);
        toolWithPlugins.registerPlugin('foo', Foo);
      }).toThrowErrorMatchingSnapshot();
    });

    it('creates a plugins property', () => {
      // @ts-ignore Allow access
      expect(toolWithPlugins.plugins.baz).toBeUndefined();

      toolWithPlugins.registerPlugin('baz', Baz);

      // @ts-ignore Allow access
      expect(toolWithPlugins.plugins.baz).toEqual([]);
    });

    it('creates a plugins type struct', () => {
      // @ts-ignore Allow access
      expect(toolWithPlugins.pluginTypes.baz).toBeUndefined();

      toolWithPlugins.registerPlugin('baz', Baz);

      // @ts-ignore Allow access
      expect(toolWithPlugins.pluginTypes.baz).toEqual({
        afterBootstrap: null,
        beforeBootstrap: null,
        contract: Baz,
        loader: expect.anything(),
        singularName: 'baz',
        pluralName: 'bazs',
      });
    });
  });
});
