import chalk from 'chalk';
import Console from '../src/Console';

jest.mock('readline');

describe('Pipeline', () => {
  let con;

  beforeEach(() => {
    con = new Console({ config: {} });
    con.io = {
      close() {},
      question() {},
      write() {},
    };
  });

  describe('ask()', () => {
    it('triggers callback with answer', async () => {
      con.io.question = jest.fn((question, callback) => {
        callback('answer');
      });

      expect(await con.ask('question')).toBe('answer');
      expect(con.io.question).toBeCalledWith(chalk.magenta('question\n'), expect.any(Function));
    });
  });

  describe('close()', () => {
    it('closes connection', () => {
      const spy = jest.spyOn(con.io, 'close');

      con.close();

      expect(spy).toBeCalled();
    });
  });

  describe('debug()', () => {
    it('doesnt log if debug is false', () => {
      const spy = jest.spyOn(con.io, 'write');

      con.debug('message');

      expect(spy).not.toBeCalled();
    });

    it('logs if debug is true', () => {
      const spy = jest.spyOn(con.io, 'write');

      con.global.config.debug = true;
      con.debug('message');

      expect(spy).toBeCalledWith(`${chalk.blue('[debug]')} message\n`);
    });

    it('indents when within a group', () => {
      const spy = jest.spyOn(con.io, 'write');

      con.global.config.debug = true;
      con.groupStart('one').groupStart('two');
      con.debug('message');

      expect(spy).toBeCalledWith(`${chalk.blue('[debug]')}         message\n`);
    });
  });

  describe('groupStart()', () => {
    it('logs a message and appends a group name', () => {
      const spy = jest.spyOn(con.io, 'write');

      con.global.config.debug = true;
      con.groupStart('foo');

      expect(spy).toBeCalledWith(`${chalk.blue('[debug]')} ${chalk.gray('[foo]')}\n`);
      expect(con.groups).toEqual(['foo']);
    });
  });

  describe('groupStop()', () => {
    it('removes the group name from the list', () => {
      con.global.config.debug = true;
      con.groupStart('foo');

      expect(con.groups).toEqual(['foo']);

      con.groupStop();

      expect(con.groups).toEqual([]);
    });
  });

  describe('indent()', () => {
    it('indents with spaces', () => {
      expect(con.indent(0)).toBe('');
      expect(con.indent(1)).toBe('    ');
      expect(con.indent(3)).toBe('            ');
    });
  });

  describe('invariant()', () => {
    it('doesnt log if debug is false', () => {
      const spy = jest.spyOn(con.io, 'write');

      con.invariant(true, 'message', 'foo', 'bar');

      expect(spy).not.toBeCalled();
    });

    it('logs green if true', () => {
      const spy = jest.spyOn(con.io, 'write');

      con.global.config.debug = true;
      con.invariant(true, 'message', 'foo', 'bar');

      expect(spy).toBeCalledWith(`${chalk.blue('[debug]')} message: ${chalk.green('foo')}\n`);
    });

    it('logs red if false', () => {
      const spy = jest.spyOn(con.io, 'write');

      con.global.config.debug = true;
      con.invariant(false, 'message', 'foo', 'bar');

      expect(spy).toBeCalledWith(`${chalk.blue('[debug]')} message: ${chalk.red('bar')}\n`);
    });
  });

  describe('log()', () => {
    it('logs a message', () => {
      const spy = jest.spyOn(con.io, 'write');

      con.log('message');

      expect(spy).toBeCalledWith('message\n');
    });

    it('can customize new lines', () => {
      const spy = jest.spyOn(con.io, 'write');

      con.log('message', 0);

      expect(spy).toBeCalledWith('message');

      con.log('message', 3);

      expect(spy).toBeCalledWith('message\n\n\n');
    });
  });
});
