import chalk from 'chalk';
import Console from '../src/Console';
import Reporter from '../src/Reporter';
import Task from '../src/Task';

describe('Console', () => {
  let cli;

  beforeEach(() => {
    cli = new Console(new Reporter());
  });

  describe('debug()', () => {
    it('adds to debug log', () => {
      cli.debug('message');

      expect(cli.debugs).toEqual([
        `${chalk.gray('[debug]')} message`,
      ]);
    });

    it('indents when within a group', () => {
      cli.startDebugGroup('one');
      cli.startDebugGroup('two');
      cli.debug('message');

      expect(cli.debugs).toEqual([
        `${chalk.gray('[debug]')} ${chalk.white('[one]')}`,
        `${chalk.gray('[debug]')}   ${chalk.cyan('[two]')}`,
        `${chalk.gray('[debug]')}     message`,
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

  describe('start()', () => {
    it('calls start on the reporter', () => {
      const spy = jest.fn();
      const task = new Task('Foo', () => {});

      cli.reporter.start = spy;
      cli.start([task]);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('startDebugGroup()', () => {
    it('logs a message and appends a group name', () => {
      cli.startDebugGroup('foo');

      expect(cli.debugGroups).toEqual(['foo']);
      expect(cli.debugs).toEqual([
        `${chalk.gray('[debug]')} ${chalk.white('[foo]')}`,
      ]);
    });

    it('cycles through all colors', () => {
      cli.startDebugGroup('1');
      cli.startDebugGroup('2');
      cli.startDebugGroup('3');
      cli.startDebugGroup('4');
      cli.startDebugGroup('5');
      cli.startDebugGroup('6');
      cli.startDebugGroup('7');
      cli.startDebugGroup('8');

      expect(cli.debugs).toEqual([
        `${chalk.gray('[debug]')} ${chalk.white('[1]')}`,
        `${chalk.gray('[debug]')}   ${chalk.cyan('[2]')}`,
        `${chalk.gray('[debug]')}     ${chalk.blue('[3]')}`,
        `${chalk.gray('[debug]')}       ${chalk.magenta('[4]')}`,
        `${chalk.gray('[debug]')}         ${chalk.red('[5]')}`,
        `${chalk.gray('[debug]')}           ${chalk.yellow('[6]')}`,
        `${chalk.gray('[debug]')}             ${chalk.green('[7]')}`,
        `${chalk.gray('[debug]')}               ${chalk.white('[8]')}`,
      ]);
    });
  });

  describe('stop()', () => {
    it('calls stop on the reporter', () => {
      const spy = jest.fn();

      cli.reporter.stop = spy;
      cli.stop();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('stopDebugGroup()', () => {
    it('removes the group name from the list', () => {
      cli.startDebugGroup('foo');

      expect(cli.debugGroups).toEqual(['foo']);

      cli.stopDebugGroup();

      expect(cli.debugGroups).toEqual([]);
    });

    it('cycles through all colors', () => {
      cli.startDebugGroup('1');
      cli.startDebugGroup('2');
      cli.startDebugGroup('3');
      cli.startDebugGroup('4');
      cli.startDebugGroup('5');
      cli.startDebugGroup('6');
      cli.startDebugGroup('7');
      cli.startDebugGroup('8');
      cli.stopDebugGroup();
      cli.stopDebugGroup();
      cli.stopDebugGroup();
      cli.stopDebugGroup();
      cli.stopDebugGroup();
      cli.stopDebugGroup();
      cli.stopDebugGroup();
      cli.stopDebugGroup();

      expect(cli.debugs).toEqual([
        `${chalk.gray('[debug]')} ${chalk.white('[1]')}`,
        `${chalk.gray('[debug]')}   ${chalk.cyan('[2]')}`,
        `${chalk.gray('[debug]')}     ${chalk.blue('[3]')}`,
        `${chalk.gray('[debug]')}       ${chalk.magenta('[4]')}`,
        `${chalk.gray('[debug]')}         ${chalk.red('[5]')}`,
        `${chalk.gray('[debug]')}           ${chalk.yellow('[6]')}`,
        `${chalk.gray('[debug]')}             ${chalk.green('[7]')}`,
        `${chalk.gray('[debug]')}               ${chalk.white('[8]')}`,
        `${chalk.gray('[debug]')}               ${chalk.white('[/8]')}`,
        `${chalk.gray('[debug]')}             ${chalk.green('[/7]')}`,
        `${chalk.gray('[debug]')}           ${chalk.yellow('[/6]')}`,
        `${chalk.gray('[debug]')}         ${chalk.red('[/5]')}`,
        `${chalk.gray('[debug]')}       ${chalk.magenta('[/4]')}`,
        `${chalk.gray('[debug]')}     ${chalk.blue('[/3]')}`,
        `${chalk.gray('[debug]')}   ${chalk.cyan('[/2]')}`,
        `${chalk.gray('[debug]')} ${chalk.white('[/1]')}`,
      ]);
    });
  });

  describe('update()', () => {
    it('calls update on the reporter', () => {
      const spy = jest.fn();

      cli.reporter.update = spy;
      cli.update();

      expect(spy).toHaveBeenCalled();
    });
  });
});
