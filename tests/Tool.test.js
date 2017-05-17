import chalk from 'chalk';
import Tool from '../src/Tool';

describe('Tool', () => {
  let tool;

  beforeEach(() => {
    tool = new Tool();
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

  describe.skip('loadConfig()');

  describe.skip('loadPlugins()');

  describe.skip('render()');

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
