import mfs from 'mock-fs';
import Renderer from '../src/Renderer';
import Tool from '../src/Tool';
import ToolBuilder from '../src/ToolBuilder';
import { DEFAULT_TOOL_CONFIG, DEFAULT_PACKAGE_CONFIG } from '../src/constants';

describe('ToolBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new ToolBuilder('boost');
  });

  describe('build()', () => {
    it('returns a Tool instance', () => {
      expect(builder.build()).toBeInstanceOf(Tool);
    });

    it('passes along the app name', () => {
      expect(builder.build().appName).toBe('boost');
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
      builder.loadConfig();

      expect(builder.tool.package).toEqual({
        ...DEFAULT_PACKAGE_CONFIG,
        name: 'boost',
      });
    });

    it('loads config file', () => {
      builder.loadConfig();

      expect(builder.tool.config).toEqual({
        ...DEFAULT_TOOL_CONFIG,
        foo: 'bar',
      });
    });
  });

  describe('loadPlugins()', () => {
    it('errors if config is falsy', () => {
      expect(() => {
        builder.loadPlugins();
      }).toThrowError('Cannot load plugins as configuration has not been loaded.');
    });

    it('errors if config is an empty object', () => {
      expect(() => {
        builder.tool.config = {};
        builder.loadPlugins();
      }).toThrowError('Cannot load plugins as configuration has not been loaded.');
    });

    it('does nothing if no plugins found in config', () => {
      builder.tool.config = { plugins: [] };
      builder.loadPlugins();

      expect(builder.tool.plugins).toEqual([]);
    });

    // TODO test plugins
  });

  describe('setCommand()', () => {
    it('errors if command options have been set', () => {
      builder.setCommand({});

      expect(() => {
        builder.setCommand({});
      }).toThrowError('Command options have already been defined, cannot redefine.');
    });

    it('sets default command options', () => {
      builder.setCommand();

      expect(builder.tool.command).toEqual({ options: {} });
    });

    it('inherits custom command options', () => {
      builder.setCommand({
        options: { force: true },
        path: './src',
      });

      expect(builder.tool.command).toEqual({
        options: { force: true },
        path: './src',
      });
    });
  });

  describe('setRenderer()', () => {
    it('errors if not an instance of Renderer', () => {
      expect(() => {
        builder.setRenderer(123);
      }).toThrowError('Invalid rendered, must be an instance of `Renderer`.');
    });

    it('sets the renderer', () => {
      const renderer = new Renderer();

      builder.setRenderer(renderer);

      expect(builder.tool.renderer).toBe(renderer);
    });
  });
});
