import chalk from 'chalk';
import mfs from 'mock-fs';
import Tool from '../src/Tool';
import { DEFAULT_TOOL_CONFIG, DEFAULT_PACKAGE_CONFIG } from '../src/constants';

describe('Tool', () => {
  let tool;

  beforeEach(() => {
    tool = new Tool('boost');
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
      tool = new Tool('boost');

      mfs({
        'package.json': JSON.stringify({ name: 'boost' }),
        'config/boost.json': JSON.stringify({ foo: 'bar' }),
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

  describe.skip('loadPlugins()');

  describe.skip('render()');

  describe('setCommand()', () => {
    it('sets default command options', () => {
      tool.setCommand();

      expect(tool.command).toEqual({ options: {} });
    });

    it('inherits custom command options', () => {
      tool.setCommand({
        options: { force: true },
        path: './src',
      });

      expect(tool.command).toEqual({
        options: { force: true },
        path: './src',
      });
    });

    it('errors if command options have been set', () => {
      tool.setCommand({});

      expect(() => {
        tool.setCommand({});
      }).toThrowError('Command options have already been defined, cannot redefine.');
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
