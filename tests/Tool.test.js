import chalk from 'chalk';
import mfs from 'mock-fs';
import Tool from '../src/Tool';
import Renderer from '../src/Renderer';
import { DEFAULT_TOOL_CONFIG, DEFAULT_PACKAGE_CONFIG } from '../src/constants';

describe('Tool', () => {
  let tool;

  beforeEach(() => {
    tool = new Tool({
      appName: 'boost',
    });
    tool.config = {};
    tool.package = {};
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
    beforeEach(() => {
      mfs({
        'config/boost.json': JSON.stringify({ foo: 'bar' }),
        'package.json': JSON.stringify({ name: 'boost' }),
      });
    });

    afterEach(() => {
      mfs.restore();
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

    it('does nothing if no plugins found in config', () => {
      tool.config = { plugins: [] };
      tool.loadPlugins();

      expect(tool.plugins).toEqual([]);
    });

    // TODO test plugins
  });

  describe.skip('render()');

  describe('setRenderer()', () => {
    it('errors if not an instance of Renderer', () => {
      expect(() => {
        tool.setRenderer(123);
      }).toThrowError('Invalid renderer, must be an instance of `Renderer`.');
    });

    it('sets the renderer', () => {
      const renderer = new Renderer();

      tool.setRenderer(renderer);

      expect(tool.renderer).toBe(renderer);
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
