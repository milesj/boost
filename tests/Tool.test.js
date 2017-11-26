import chalk from 'chalk';
import Tool from '../src/Tool';
import Plugin from '../src/Plugin';
import { DEFAULT_TOOL_CONFIG } from '../src/constants';
import { getFixturePath, MockRenderer } from './helpers';

jest.mock('../src/Console');

describe('Tool', () => {
  let tool;

  beforeEach(() => {
    tool = new Tool({
      appName: 'boost',
      renderer: new MockRenderer(),
      root: getFixturePath('app'),
    });
    tool.config = {};
    tool.package = {};
  });

  describe('constructor()', () => {
    it('errors if `renderer` is not an instance of Renderer', () => {
      expect(() => {
        tool = new Tool({
          appName: 'boost',
          renderer: 123,
        });
      }).toThrowError('Invalid Tool option "renderer". Must be an instance of "Renderer".');
    });
  });

  describe('debug()', () => {
    it('doesnt log if debug is false', () => {
      const spy = jest.spyOn(tool.console, 'debug');

      tool.debug('message');

      expect(spy).not.toHaveBeenCalled();
    });

    it('logs to console if debug is true', () => {
      const spy = jest.spyOn(tool.console, 'debug');

      tool.config.debug = true;
      tool.debug('message');

      expect(spy).toHaveBeenCalledWith('message');
    });
  });

  describe('getPlugin()', () => {
    it('errors if not found', () => {
      expect(() => {
        tool.getPlugin('foo');
      }).toThrowError('Failed to find plugin "foo". Have you installed it?');
    });

    it('returns plugin by name', () => {
      const plugin = new Plugin();
      plugin.name = 'foo';

      tool.plugins.push(plugin);

      expect(tool.getPlugin('foo')).toBe(plugin);
    });
  });

  describe('initialize()', () => {
    it('loads config', () => {
      expect(tool.config).toEqual({});
      expect(tool.package).toEqual({});
      expect(tool.initialized).toBe(false);

      tool.initialize();

      expect(tool.config).not.toEqual({});
      expect(tool.package).not.toEqual({});
      expect(tool.initialized).toBe(true);
    });
  });

  describe('invariant()', () => {
    it('doesnt log if debug is false', () => {
      const spy = jest.spyOn(tool.console, 'debug');

      tool.invariant(true, 'message', 'foo', 'bar');

      expect(spy).not.toHaveBeenCalled();
    });

    it('logs green if true', () => {
      const spy = jest.spyOn(tool.console, 'debug');

      tool.config.debug = true;
      tool.invariant(true, 'message', 'foo', 'bar');

      expect(spy).toHaveBeenCalledWith(`message: ${chalk.green('foo')}`);
    });

    it('logs red if false', () => {
      const spy = jest.spyOn(tool.console, 'debug');

      tool.config.debug = true;
      tool.invariant(false, 'message', 'foo', 'bar');

      expect(spy).toHaveBeenCalledWith(`message: ${chalk.red('bar')}`);
    });
  });

  describe('loadConfig()', () => {
    it('doesnt load if initialized', () => {
      tool.initialized = true;
      tool.loadConfig();

      expect(tool.config).toEqual({});
      expect(tool.package).toEqual({});
    });

    it('loads package.json', () => {
      tool.loadConfig();

      expect(tool.package).toEqual({
        name: 'boost',
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
  });

  describe('loadPlugins()', () => {
    it('errors if config is falsy', () => {
      expect(() => {
        tool.loadPlugins();
      }).toThrowError('Cannot load plugins as configuration has not been loaded.');
    });

    it('errors if config is an empty object', () => {
      expect(() => {
        tool.config = {};
        tool.loadPlugins();
      }).toThrowError('Cannot load plugins as configuration has not been loaded.');
    });

    it('doesnt load if no plugins found in config', () => {
      tool.config = { plugins: [] };
      tool.loadPlugins();

      expect(tool.plugins).toEqual([]);
    });

    it('doesnt load if initialized', () => {
      tool.initialized = true;
      tool.config = { plugins: ['foo'] };
      tool.loadPlugins();

      expect(tool.plugins).toEqual([]);
    });

    it('bootstraps plugins on load', () => {
      const plugin = new Plugin();
      const spy = jest.spyOn(plugin, 'bootstrap');

      tool.config = { plugins: [plugin] };
      tool.loadPlugins();

      expect(spy).toHaveBeenCalled();
    });

    it('bootstraps plugins with tool if bootstrap() is overridden', () => {
      class TestPlugin extends Plugin {
        bootstrap() {}
      }

      const plugin = new TestPlugin();

      tool.config = { plugins: [plugin] };
      tool.loadPlugins();

      expect(plugin.tool).toBe(tool);
    });
  });

  describe('log()', () => {
    it('passes to console', () => {
      const spy = jest.spyOn(tool.console, 'log');

      tool.log('foo');

      expect(spy).toHaveBeenCalledWith('foo');
    });
  });

  describe('logError()', () => {
    it('passes to console', () => {
      const spy = jest.spyOn(tool.console, 'error');

      tool.logError('foo');

      expect(spy).toHaveBeenCalledWith('foo');
    });
  });
});
