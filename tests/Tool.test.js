import chalk from 'chalk';
import Tool from '../src/Tool';
import Plugin from '../src/Plugin';
import { DEFAULT_TOOL_CONFIG, DEFAULT_PACKAGE_CONFIG } from '../src/constants';
import { getFixturePath, MockRenderer } from './helpers';

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

  describe.skip('closeConsole()');

  describe('debug()', () => {
    it('doesnt log if debug is false', () => {
      tool.debug('message');

      expect(tool.debugs).toHaveLength(0);
    });

    it('logs if debug is true', () => {
      tool.config.debug = true;
      tool.debug('message');

      expect(tool.debugs).toEqual([
        `${chalk.blue('[debug]')} message`,
      ]);
    });

    it('indents when within a group', () => {
      tool.config.debug = true;
      tool.startDebugGroup('one').startDebugGroup('two');
      tool.debug('message');

      expect(tool.debugs).toEqual([
        `${chalk.blue('[debug]')} ${chalk.gray('[one]')}`,
        `${chalk.blue('[debug]')}     ${chalk.gray('[two]')}`,
        `${chalk.blue('[debug]')}         message`,
      ]);
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
      tool.invariant(true, 'message', 'foo', 'bar');

      expect(tool.debugs).toHaveLength(0);
    });

    it('logs green if true', () => {
      tool.config.debug = true;
      tool.invariant(true, 'message', 'foo', 'bar');

      expect(tool.debugs).toEqual([
        `${chalk.blue('[debug]')} message: ${chalk.green('foo')}`,
      ]);
    });

    it('logs red if false', () => {
      tool.config.debug = true;
      tool.invariant(false, 'message', 'foo', 'bar');

      expect(tool.debugs).toEqual([
        `${chalk.blue('[debug]')} message: ${chalk.red('bar')}`,
      ]);
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
        ...DEFAULT_PACKAGE_CONFIG,
        name: 'boost',
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

      expect(spy).toHaveBeenCalledWith(tool);
    });
  });

  describe.skip('render()');

  describe('log()', () => {
    it('adds to output log', () => {
      tool.log('foo').log('bar');

      expect(tool.logs).toEqual(['foo', 'bar']);
    });
  });

  describe('logError()', () => {
    it('adds to error log', () => {
      tool.logError('foo').logError('bar');

      expect(tool.errors).toEqual(['foo', 'bar']);
    });
  });

  describe('startDebugGroup()', () => {
    it('logs a message and appends a group name', () => {
      tool.config.debug = true;
      tool.startDebugGroup('foo');

      expect(tool.debugGroups).toEqual(['foo']);
      expect(tool.debugs).toEqual([
        `${chalk.blue('[debug]')} ${chalk.gray('[foo]')}`,
      ]);
    });
  });

  describe('stopDebugGroup()', () => {
    it('removes the group name from the list', () => {
      tool.config.debug = true;
      tool.startDebugGroup('foo');

      expect(tool.debugGroups).toEqual(['foo']);

      tool.stopDebugGroup();

      expect(tool.debugGroups).toEqual([]);
    });
  });
});
