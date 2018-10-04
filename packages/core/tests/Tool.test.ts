import path from 'path';
import Tool from '../src/Tool';
import Plugin from '../src/Plugin';
import Reporter from '../src/Reporter';
import DefaultReporter from '../src/reporters/DefaultReporter';
import ErrorReporter from '../src/reporters/ErrorReporter';
import { DEFAULT_TOOL_CONFIG } from '../src/constants';
import enableDebug from '../src/helpers/enableDebug';
import { getFixturePath, copyFixtureToMock, createTestTool } from './helpers';

jest.mock('../src/helpers/enableDebug');

describe('Tool', () => {
  let tool: Tool;

  beforeEach(() => {
    tool = createTestTool({
      root: getFixturePath('app'),
    });
    // @ts-ignore Allow private access
    tool.initialized = false; // Reset
  });

  describe('constructor()', () => {
    it('enables debug if --debug is passed', () => {
      tool = new Tool(
        {
          appName: 'test-boost',
          appPath: __dirname,
          root: getFixturePath('app'),
        },
        ['--debug'],
      );

      expect(enableDebug).toHaveBeenCalledWith('test-boost');
    });

    it('sets an error reporter', () => {
      expect(tool.reporters[0]).toBeInstanceOf(ErrorReporter);
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
        resourcePaths: [
          path.join(__dirname, '../src/resources'),
          path.join(__dirname, 'resources'),
        ],
      });
    });
  });

  describe('exit()', () => {
    it('accepts a string', () => {
      const spy = jest.fn();

      tool.console.exit = spy;
      tool.exit('Oops', 123);

      expect(spy).toHaveBeenCalledWith('Oops', 123);
    });

    it('accepts an error', () => {
      const error = new Error('Oh nooo');
      const spy = jest.fn();

      tool.console.exit = spy;
      tool.exit(error);

      expect(spy).toHaveBeenCalledWith(error, 1);
    });
  });

  describe('getPlugin()', () => {
    it('errors if not found', () => {
      expect(() => {
        tool.getPlugin('foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns plugin by name', () => {
      const plugin = new Plugin();
      plugin.name = 'foo';

      tool.plugins.push(plugin);

      expect(tool.getPlugin('foo')).toBe(plugin);
    });
  });

  describe('getReporter()', () => {
    it('errors if not found', () => {
      expect(() => {
        tool.getReporter('foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns plugin by name', () => {
      const reporter = new Reporter();
      reporter.name = 'foo';

      tool.reporters.push(reporter);

      expect(tool.getReporter('foo')).toBe(reporter);
    });
  });

  describe('getThemeList()', () => {
    it('returns a list of themes', () => {
      const themes = tool.getThemeList();

      expect(themes.length).not.toBe(0);
      expect(themes).toContain('one-dark');
    });
  });

  describe('initialize()', () => {
    it('loads config', () => {
      // @ts-ignore Allow missing fields
      tool.config = {};

      expect(tool.config).toEqual({});
      expect(tool.package).toEqual({ name: '' });
      // @ts-ignore Allow private access
      expect(tool.initialized).toBe(false);

      tool.initialize();

      expect(tool.config).not.toEqual({});
      expect(tool.package).not.toEqual({ name: '' });
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
        ...DEFAULT_TOOL_CONFIG,
        foo: 'bar',
      });
    });

    it('enables debug if debug config is true', () => {
      tool.argv = ['--debug'];
      tool.loadConfig();

      expect(enableDebug).toHaveBeenCalledWith('test-boost');
    });

    it('updates locale if defined', () => {
      const spy = jest.spyOn(tool.translator, 'changeLanguage');

      // @ts-ignore Allow private access
      tool.configLoader.loadConfig = jest.fn(() => ({ locale: 'fr' }));
      tool.loadConfig();

      expect(spy).toHaveBeenCalledWith('fr');
    });
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
      tool.config = { ...DEFAULT_TOOL_CONFIG, plugins: [] };
      tool.loadPlugins();

      expect(tool.plugins).toEqual([]);
    });

    it('doesnt load if initialized', () => {
      // @ts-ignore Allow private access
      tool.initialized = true;
      tool.config = { ...DEFAULT_TOOL_CONFIG, plugins: ['foo'] };
      tool.loadPlugins();

      expect(tool.plugins).toEqual([]);
    });

    it('bootstraps plugins on load', () => {
      const plugin = new Plugin();
      const spy = jest.spyOn(plugin, 'bootstrap');

      tool.config = { ...DEFAULT_TOOL_CONFIG, plugins: [plugin] };
      tool.loadPlugins();

      expect(spy).toHaveBeenCalled();
    });

    it('bootstraps plugins with tool if bootstrap() is overridden', () => {
      class TestPlugin extends Plugin<any> {
        bootstrap() {}
      }

      const plugin = new TestPlugin();

      tool.config = { ...DEFAULT_TOOL_CONFIG, plugins: [plugin] };
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

      tool.config = { ...DEFAULT_TOOL_CONFIG, plugins: [foo, bar, baz] };
      tool.loadPlugins();

      expect(tool.plugins).toEqual([baz, bar, foo]);
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

      expect(tool.reporters).toHaveLength(1);
    });

    it('loads default reporter if config not set', () => {
      tool.config = { ...DEFAULT_TOOL_CONFIG, reporters: [] };
      tool.loadReporters();

      expect(tool.reporters[1]).toBeInstanceOf(DefaultReporter);
    });

    it('loads reporter using a string', () => {
      const unmock = copyFixtureToMock('reporter', 'test-boost-reporter-foo');

      tool.config = { ...DEFAULT_TOOL_CONFIG, reporters: ['foo'] };
      tool.loadReporters();

      expect(tool.reporters[1]).toBeInstanceOf(Reporter);
      expect(tool.reporters[1].name).toBe('foo');
      expect(tool.reporters[1].moduleName).toBe('test-boost-reporter-foo');

      unmock();
    });

    it('loads reporter using an object', () => {
      const unmock = copyFixtureToMock('reporter', 'test-boost-reporter-bar');

      tool.config = { ...DEFAULT_TOOL_CONFIG, reporters: [{ reporter: 'bar' }] };
      tool.loadReporters();

      expect(tool.reporters[1]).toBeInstanceOf(Reporter);
      expect(tool.reporters[1].name).toBe('bar');
      expect(tool.reporters[1].moduleName).toBe('test-boost-reporter-bar');

      unmock();
    });

    it('passes options to reporter', () => {
      const unmock = copyFixtureToMock('reporter', 'test-boost-reporter-baz');

      tool.config = { ...DEFAULT_TOOL_CONFIG, reporters: [{ reporter: 'baz', foo: 'bar' }] };
      tool.loadReporters();

      const [, reporter] = tool.reporters;

      expect(reporter.options).toEqual({ foo: 'bar' });

      unmock();
    });
  });

  describe('log()', () => {
    it('sends log to console', () => {
      const spy = jest.spyOn(tool.console, 'log');

      tool.log('Some message: %s', 'foo');

      expect(spy).toHaveBeenCalledWith('Some message: foo');
    });
  });

  describe('logError()', () => {
    it('sends error to console', () => {
      const spy = jest.spyOn(tool.console, 'logError');

      tool.logError('Some error: %s', 'foo');

      expect(spy).toHaveBeenCalledWith('Some error: foo');
    });
  });
});
