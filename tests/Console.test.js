import chalk from 'chalk';
import Console from '../src/Console';
import Reporter from '../src/Reporter';

describe('Console', () => {
  let cli;

  beforeEach(() => {
    cli = new Console(new Reporter());
  });

  describe('debug()', () => {
    it('adds to debug log', () => {
      cli.debug('message');

      expect(cli.debugs).toEqual([
        `${chalk.blue('[debug]')} message`,
      ]);
    });

    it('indents when within a group', () => {
      cli.startDebugGroup('one');
      cli.startDebugGroup('two');
      cli.debug('message');

      expect(cli.debugs).toEqual([
        `${chalk.blue('[debug]')} ${chalk.gray('[one]')}`,
        `${chalk.blue('[debug]')}     ${chalk.gray('[two]')}`,
        `${chalk.blue('[debug]')}         message`,
      ]);
    });
  });

  describe('log()', () => {
    it('adds to output log', () => {
      cli.log('foo');

      expect(cli.logs).toEqual(['foo']);
    });
  });

  describe('error()', () => {
    it('adds to error log', () => {
      cli.error('foo');

      expect(cli.errors).toEqual(['foo']);
    });
  });

  describe('startDebugGroup()', () => {
    it('logs a message and appends a group name', () => {
      cli.startDebugGroup('foo');

      expect(cli.debugGroups).toEqual(['foo']);
      expect(cli.debugs).toEqual([
        `${chalk.blue('[debug]')} ${chalk.gray('[foo]')}`,
      ]);
    });
  });

  describe('stopDebugGroup()', () => {
    it('removes the group name from the list', () => {
      cli.startDebugGroup('foo');

      expect(cli.debugGroups).toEqual(['foo']);

      cli.stopDebugGroup();

      expect(cli.debugGroups).toEqual([]);
    });
  });
});
