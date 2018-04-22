import chalk from 'chalk';
import Tool from '../src/Tool';
import Plugin from '../src/Plugin';
import Reporter from '../src/Reporter';
import { DEFAULT_TOOL_CONFIG } from '../src/constants';
import enableDebug from '../src/helpers/enableDebug';
import { getFixturePath } from './helpers';

jest.mock('../src/helpers/enableDebug');

describe('Tool', () => {
  let tool;

  beforeEach(() => {
    tool = new Tool({
      appName: 'test-boost',
      root: getFixturePath('app'),
    });
    tool.config = {};
    tool.package = {};
  });

  describe('constructor()', () => {
    it('enables debug if --debug is passed', () => {
      tool = new Tool(
        {
          appName: 'test-boost',
          root: getFixturePath('app'),
        },
        ['--debug'],
      );

      expect(enableDebug).toHaveBeenCalledWith('test-boost');
    });
  });

  describe('debug()', () => {
    it('logs to debugger', () => {
      const spy = jest.spyOn(tool, 'debug');

      tool.debug('message');

      expect(spy).toHaveBeenCalledWith('message');
    });
  });

  describe('exit()', () => {
    it('accepts a string', () => {
      const spy = jest.spyOn(tool.console, 'exit');

      tool.exit('Oops', 123);

      expect(spy).toHaveBeenCalledWith('Oops', 123);
    });

    it('accepts an error', () => {
      const spy = jest.spyOn(tool.console, 'exit');
      const error = new Error('Oh nooo', 456);

      tool.exit(error);

      expect(spy).toHaveBeenCalledWith(error, 1);
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
    it('logs green if true', () => {
      const spy = jest.spyOn(tool, 'debug');

      tool.invariant(true, 'message', 'foo', 'bar');

      expect(spy).toHaveBeenCalledWith('%s: %s', 'message', chalk.green('foo'));
    });

    it('logs red if false', () => {
      const spy = jest.spyOn(tool, 'debug');

      tool.invariant(false, 'message', 'foo', 'bar');

      expect(spy).toHaveBeenCalledWith('%s: %s', 'message', chalk.red('bar'));
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

    it('extends from argv', () => {
      tool.argv = ['--debug', '--silent'];
      tool.loadConfig();

      expect(tool.config.debug).toBe(true);
      expect(tool.config.silent).toBe(true);
    });

    it('doesnt extend from argv if disabled', () => {
      tool.argv = ['--debug', '--silent'];
      tool.options.extendArgv = false;
      tool.loadConfig();

      expect(tool.config.debug).toBe(false);
      expect(tool.config.silent).toBe(false);
    });

    it('enables debug if debug config is true', () => {
      tool.argv = ['--debug'];
      tool.loadConfig();

      expect(enableDebug).toHaveBeenCalledWith('test-boost');
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

    it('sorts by priority', () => {
      const foo = new Plugin();
      const bar = new Plugin();
      const baz = new Plugin();

      baz.priority = 1;
      bar.priority = 2;
      foo.priority = 3;

      tool.config = { plugins: [foo, bar, baz] };
      tool.loadPlugins();

      expect(tool.plugins).toEqual([baz, bar, foo]);
    });
  });

  describe('loadReporter()', () => {
    it('errors if config is falsy', () => {
      expect(() => {
        tool.loadReporter();
      }).toThrowError('Cannot load reporter as configuration has not been loaded.');
    });

    it('errors if config is an empty object', () => {
      expect(() => {
        tool.config = {};
        tool.loadReporter();
      }).toThrowError('Cannot load reporter as configuration has not been loaded.');
    });

    it('loads reporter', () => {
      const reporter = new Reporter();

      tool.config = { reporter };
      tool.loadReporter();

      expect(tool.console.reporter).toBe(reporter);
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
