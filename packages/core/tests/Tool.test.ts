import debug from 'debug';
import path from 'path';
import { string } from 'optimal';
import { ExitError } from '@boost/internal';
import { copyFixtureToMock, getFixturePath } from '@boost/test-utils';
import {
  mockConsole,
  mockTool,
  stubPackageJson,
  stubToolConfig,
  TestToolConfig,
} from '../src/testUtils';
import Tool from '../src/Tool';
import Plugin from '../src/Plugin';
import Reporter from '../src/Reporter';
import BoostReporter from '../src/reporters/BoostReporter';

class Foo extends Plugin {
  blueprint() {
    return {};
  }
}

class Bar extends Plugin {
  blueprint() {
    return {};
  }
}

class Baz {}

interface ToolWithPlugins {
  foo: Foo;
  bar: Bar;
  baz: Baz;
  plugin: Plugin;
  reporter: Reporter;
}

describe('Tool', () => {
  let tool: Tool<any, TestToolConfig>;
  let toolWithPlugins: Tool<ToolWithPlugins, TestToolConfig>;

  beforeEach(() => {
    tool = mockTool({
      appName: 'test-boost',
      appPath: getFixturePath('app'),
      root: getFixturePath('app'),
    });
    tool.console = mockConsole(tool);
    // @ts-ignore Allow private access
    tool.initialized = false; // Reset

    toolWithPlugins = (mockTool({
      appName: 'test-boost',
      appPath: getFixturePath('app'),
      root: getFixturePath('app'),
    }) as any) as Tool<ToolWithPlugins, TestToolConfig>;
  });

  describe('constructor()', () => {
    it('can define config blueprint', () => {
      tool = mockTool({
        configBlueprint: {
          name: string(),
        },
      });

      expect(tool.options.configBlueprint).toEqual({
        name: string(),
      });
    });

    it('can define settings blueprint', () => {
      tool = mockTool({
        settingsBlueprint: {
          name: string(),
        },
      });

      expect(tool.options.settingsBlueprint).toEqual({
        name: string(),
      });
    });

    it('errors if `appName` is not kebab case', () => {
      expect(
        () =>
          new Tool({
            appName: 'should be-kebab-case',
            appPath: '.',
          }),
      ).toThrowErrorMatchingSnapshot();

      expect(
        () =>
          new Tool({
            appName: 'almost-Kebab',
            appPath: '.',
          }),
      ).toThrowErrorMatchingSnapshot();

      expect(
        () =>
          new Tool({
            appName: 'is-kebab',
            appPath: '.',
          }),
      ).not.toThrowError();
    });

    it('errors if `configName` is not camel case', () => {
      expect(
        () =>
          new Tool({
            configName: 'oh no not camel',
            appName: 'test',
            appPath: '.',
          }),
      ).toThrowErrorMatchingSnapshot();

      expect(
        () =>
          new Tool({
            configName: 'AlmostCamel',
            appName: 'test',
            appPath: '.',
          }),
      ).toThrowErrorMatchingSnapshot();

      expect(
        () =>
          new Tool({
            configName: 'isCamel',
            appName: 'test',
            appPath: '.',
          }),
      ).not.toThrowError();
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
        toolWithPlugins.addPlugin('qux', new Baz());
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

    it('bootstraps plugin', () => {
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

    it('calls `beforeBootstrap` on type', () => {
      const spy = jest.fn();
      const type = toolWithPlugins.getRegisteredPlugin('foo');

      type.beforeBootstrap = spy;

      const plugin = new Foo();

      toolWithPlugins.addPlugin('foo', plugin);

      expect(spy).toHaveBeenCalledWith(plugin);
    });

    it('calls `afterBootstrap` on type', () => {
      const spy = jest.fn();
      const type = toolWithPlugins.getRegisteredPlugin('foo');

      type.afterBootstrap = spy;

      const plugin = new Foo();

      toolWithPlugins.addPlugin('foo', plugin);

      expect(spy).toHaveBeenCalledWith(plugin);
    });

    it('emits `onLoadPlugin` with a scope', () => {
      const fooSpy = jest.fn();
      const barSpy = jest.fn();

      toolWithPlugins.onLoadPlugin.listen(fooSpy, 'foo');
      toolWithPlugins.onLoadPlugin.listen(barSpy, 'bar');

      const plugin = new Foo();

      toolWithPlugins.addPlugin('foo', plugin);

      expect(fooSpy).toHaveBeenCalledWith(plugin);
      expect(barSpy).not.toHaveBeenCalled();
    });
  });

  describe('exit()', () => {
    it('throws exit error', () => {
      try {
        tool.exit();
      } catch (error) {
        expect(error).toEqual(new ExitError('Process has been terminated.', 1));
      }
    });

    it('throws exit error with custom message and code', () => {
      try {
        tool.exit('Hello', 123);
      } catch (error) {
        expect(error).toEqual(new ExitError('Hello', 123));
      }
    });

    it('throws exit error based on original error', () => {
      try {
        tool.exit(new Error('Hello'), 0);
      } catch (error) {
        expect(error).toEqual(new ExitError('Hello', 0));
      }
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
      const plugin = new Foo();
      plugin.name = 'foo';

      // @ts-ignore Allow access
      tool.plugins.plugin = new Set([plugin]);

      expect(tool.getPlugin('plugin', 'foo')).toBe(plugin);
    });
  });

  describe('getWorkspacePackages()', () => {
    it('returns an empty array if no workspace config', () => {
      expect(tool.getWorkspacePackages({ root: getFixturePath('workspace-no-packages') })).toEqual(
        [],
      );
    });

    it('loads all package.jsons and appends metadata', () => {
      const root = getFixturePath('workspace-multiple');
      const packages = tool.getWorkspacePackages({ root });

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

  describe('getWorkspacePackagePaths()', () => {
    it('returns an empty array if no workspace config', () => {
      expect(
        tool.getWorkspacePackagePaths({ root: getFixturePath('workspace-no-packages') }),
      ).toEqual([]);
    });

    it('returns an empty array if no workspace packages', () => {
      expect(tool.getWorkspacePackagePaths({ root: getFixturePath('workspace-mismatch') })).toEqual(
        [],
      );
    });

    it('returns an array of all packages within all workspaces', () => {
      expect(tool.getWorkspacePackagePaths({ root: getFixturePath('workspace-multiple') })).toEqual(
        [
          getFixturePath('workspace-multiple', 'packages/baz'),
          getFixturePath('workspace-multiple', 'packages/foo'),
          getFixturePath('workspace-multiple', 'modules/bar'),
        ],
      );
    });

    it('returns an array of all packages within all workspaces as relative paths', () => {
      expect(
        tool.getWorkspacePackagePaths({
          root: getFixturePath('workspace-multiple'),
          relative: true,
        }),
      ).toEqual(['packages/baz', 'packages/foo', 'modules/bar']);
    });
  });

  describe('getWorkspacePaths', () => {
    it('returns an empty array if no workspace config', () => {
      expect(tool.getWorkspacePaths({ root: getFixturePath('workspace-no-packages') })).toEqual([]);
    });

    it('returns an array of workspaces for yarn `workspaces` property', () => {
      expect(tool.getWorkspacePaths({ root: getFixturePath('workspace-yarn') })).toEqual([
        getFixturePath('workspace-yarn', 'packages/*'),
      ]);
    });

    it('returns an array of workspaces for yarn no hoist `workspaces.packages` property', () => {
      expect(tool.getWorkspacePaths({ root: getFixturePath('workspace-yarn-nohoist') })).toEqual([
        getFixturePath('workspace-yarn-nohoist', 'packages/*'),
      ]);
    });

    it('returns an array of workspaces for lerna `packages` property', () => {
      expect(tool.getWorkspacePaths({ root: getFixturePath('workspace-lerna') })).toEqual([
        getFixturePath('workspace-lerna', 'packages/*'),
      ]);
    });

    it('returns an array of all workspaces', () => {
      expect(tool.getWorkspacePaths({ root: getFixturePath('workspace-multiple') })).toEqual([
        getFixturePath('workspace-multiple', 'packages/*'),
        getFixturePath('workspace-multiple', 'modules/*'),
      ]);
    });

    it('returns an array of all workspaces as relative paths', () => {
      expect(
        tool.getWorkspacePaths({ root: getFixturePath('workspace-multiple'), relative: true }),
      ).toEqual(['packages/*', 'modules/*']);
    });
  });

  describe('initialize()', () => {
    it('loads config', () => {
      // @ts-ignore Allow missing fields
      tool.config = {};

      expect(tool.config).toEqual({});
      expect(tool.package).toEqual(stubPackageJson());
      // @ts-ignore Allow private access
      expect(tool.initialized).toBe(false);

      tool.initialize();

      expect(tool.config).not.toEqual({});
      expect(tool.package).not.toEqual(stubPackageJson());
      // @ts-ignore Allow private access
      expect(tool.initialized).toBe(true);
    });

    it('only initializes once', () => {
      // @ts-ignore Allow protected access
      const spy = jest.spyOn(tool, 'loadConfig');

      tool.initialize();
      tool.initialize();
      tool.initialize();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('emits `onInit` after initializing', () => {
      const spy = jest.fn();

      tool.onInit.listen(spy);
      tool.initialize();
      tool.initialize();
      tool.initialize();

      expect(spy).toHaveBeenCalledWith();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('isPluginEnabled()', () => {
    it('returns false when config property not found', () => {
      delete tool.config.plugins;

      expect(tool.isPluginEnabled('plugin', 'foo')).toBe(false);
    });

    it('returns false when config property not an array', () => {
      // @ts-ignore Allow invalid type
      tool.config.plugins = 'wrong';

      expect(tool.isPluginEnabled('plugin', 'foo')).toBe(false);
    });

    it('returns true when using strings and name is found', () => {
      tool.config.plugins = ['foo'];

      expect(tool.isPluginEnabled('plugin', 'foo')).toBe(true);
    });

    it('returns false when using strings and name not found', () => {
      tool.config.plugins = ['bar'];

      expect(tool.isPluginEnabled('plugin', 'foo')).toBe(false);
    });

    it('returns true when using objects and name is found', () => {
      tool.config.plugins = [{ plugin: 'foo' }];

      expect(tool.isPluginEnabled('plugin', 'foo')).toBe(true);
    });

    it('returns false when using objects and name not found', () => {
      tool.config.plugins = [{ plugin: 'bar' }];

      expect(tool.isPluginEnabled('plugin', 'foo')).toBe(false);
    });

    it('returns true when using instances and name matches', () => {
      const plugin = new Foo();
      plugin.name = 'foo';

      tool.config.plugins = [plugin];

      expect(tool.isPluginEnabled('plugin', 'foo')).toBe(true);
    });

    it('returns false when using instances and name doesnt match', () => {
      const plugin = new Bar();
      plugin.name = 'bar';

      tool.config.plugins = [plugin];

      expect(tool.isPluginEnabled('plugin', 'foo')).toBe(false);
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
      // @ts-ignore Allow protected access
      tool.loadConfig();

      expect(tool.config).toEqual({});
      expect(tool.package).toEqual({});
    });

    it('loads package.json', () => {
      // @ts-ignore Allow protected access
      tool.loadConfig();

      expect(tool.package).toEqual({
        name: 'test-boost-app',
        version: '0.0.0',
      });
    });

    it('loads config file', () => {
      // @ts-ignore Allow protected access
      tool.loadConfig();

      expect(tool.config).toEqual({
        ...stubToolConfig(),
        foo: 'bar',
      });
    });

    it('enables debug if debug config is true', () => {
      const oldEnable = debug.enable;

      debug.enable = jest.fn();

      tool.args = { $0: '', _: [], debug: true };
      // @ts-ignore Allow protected access
      tool.loadConfig();

      expect(debug.enable).toHaveBeenCalledWith('test-boost:*');

      debug.enable = oldEnable;
    });
  });

  describe('loadPlugins()', () => {
    it('errors if config is falsy', () => {
      expect(() => {
        // @ts-ignore
        tool.config = null;
        // @ts-ignore Allow protected access
        tool.loadPlugins();
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if config is an empty object', () => {
      expect(() => {
        // @ts-ignore
        tool.config = {};
        // @ts-ignore Allow protected access
        tool.loadPlugins();
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt load if no plugins found in config', () => {
      tool.config = stubToolConfig();
      // @ts-ignore Allow protected access
      tool.loadPlugins();

      // @ts-ignore Allow access
      expect(tool.plugins).toEqual({ plugin: new Set(), reporter: new Set() });
    });

    it('doesnt load if initialized', () => {
      // @ts-ignore Allow private access
      tool.initialized = true;
      tool.config = stubToolConfig<TestToolConfig>({ plugins: ['foo'] });
      // @ts-ignore Allow protected access
      tool.loadPlugins();

      // @ts-ignore Allow access
      expect(tool.plugins).toEqual({ plugin: new Set(), reporter: new Set() });
    });

    it('bootstraps plugins on load', () => {
      const plugin = new Foo();
      const spy = jest.spyOn(plugin, 'bootstrap');

      tool.config = stubToolConfig<TestToolConfig>({ plugins: [plugin] });
      // @ts-ignore Allow protected access
      tool.loadPlugins();

      expect(spy).toHaveBeenCalled();
    });

    it('bootstraps plugins with tool if bootstrap() is overridden', () => {
      class TestPlugin extends Plugin {
        blueprint() {
          return {};
        }

        bootstrap() {}
      }

      const plugin = new TestPlugin();

      tool.config = stubToolConfig<TestToolConfig>({ plugins: [plugin] });
      // @ts-ignore Allow protected access
      tool.loadPlugins();

      expect(plugin.tool).toBe(tool);
    });

    it('sorts by priority', () => {
      const foo = new Foo();
      const bar = new Foo();
      const baz = new Foo();

      baz.priority = 1;
      bar.priority = 2;
      foo.priority = 3;

      tool.config = stubToolConfig<TestToolConfig>({ plugins: [foo, bar, baz] });
      // @ts-ignore Allow protected access
      tool.loadPlugins();

      // @ts-ignore Allow access
      expect(tool.plugins).toEqual({ plugin: new Set([baz, bar, foo]), reporter: new Set() });
    });

    it('loads reporter using a string', () => {
      const unmock = copyFixtureToMock('reporter', 'test-boost-reporter-foo');

      tool.config = stubToolConfig<TestToolConfig>({ reporters: ['foo'] });
      // @ts-ignore Allow protected access
      tool.loadPlugins();

      expect(tool.getPlugins('reporter')[0]).toBeInstanceOf(Reporter);
      expect(tool.getPlugins('reporter')[0].name).toBe('foo');
      expect(tool.getPlugins('reporter')[0].moduleName).toBe('test-boost-reporter-foo');

      unmock();
    });

    it('loads reporter using an object', () => {
      const unmock = copyFixtureToMock('reporter', 'test-boost-reporter-bar');

      tool.config = stubToolConfig<TestToolConfig>({ reporters: [{ reporter: 'bar' }] });
      // @ts-ignore Allow protected access
      tool.loadPlugins();

      expect(tool.getPlugins('reporter')[0]).toBeInstanceOf(Reporter);
      expect(tool.getPlugins('reporter')[0].name).toBe('bar');
      expect(tool.getPlugins('reporter')[0].moduleName).toBe('test-boost-reporter-bar');

      unmock();
    });

    it('passes options to reporter', () => {
      const unmock = copyFixtureToMock('reporter', 'test-boost-reporter-baz');

      tool.config = stubToolConfig<TestToolConfig>({ reporters: [{ reporter: 'baz', fps: 30 }] });
      // @ts-ignore Allow protected access
      tool.loadPlugins();

      const [reporter] = tool.getPlugins('reporter');

      expect(reporter.options).toEqual({ fps: 30 });

      unmock();
    });
  });

  describe('loadReporters()', () => {
    it('errors if config is falsy', () => {
      expect(() => {
        // @ts-ignore
        tool.config = null;
        // @ts-ignore Allow protected access
        tool.loadReporters();
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if config is an empty object', () => {
      expect(() => {
        // @ts-ignore
        tool.config = {};
        // @ts-ignore Allow protected access
        tool.loadReporters();
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt load if initialized', () => {
      // @ts-ignore Allow private access
      tool.initialized = true;
      // @ts-ignore Allow protected access
      tool.loadReporters();

      expect(tool.getPlugins('reporter')).toHaveLength(0);
    });

    it('loads default reporter if none defined', () => {
      // @ts-ignore Allow protected access
      tool.loadReporters();

      expect(tool.getPlugins('reporter')[0].constructor.name).toBe('BoostReporter');
    });
  });

  describe('logLive()', () => {
    it('sends log to console', () => {
      const old = process.stdout.write.bind(process.stdout);
      const log = jest.fn();
      const spy = jest.spyOn(tool.console, 'logLive');

      process.stdout.write = log;

      tool.logLive('Some message: %s', 'foo');

      expect(spy).toHaveBeenCalledWith('Some message: foo');
      expect(log).toHaveBeenCalledWith('Some message: foo');

      // @ts-ignore
      process.stdout.write = old;
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
      expect(toolWithPlugins.plugins.baz).toBeInstanceOf(Set);
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
        scopes: [],
        singularName: 'baz',
        pluralName: 'bazs',
      });
    });
  });
});
