/* eslint-disable unicorn/no-hex-escape */

import Console from '../src/Console';

describe('Console', () => {
  let cli: Console;

  beforeEach(() => {
    cli = new Console();
    cli.err = jest.fn();
    cli.out = jest.fn();
  });

  describe('clearOutput()', () => {
    it('writes ansi escape code', () => {
      cli.clearOutput();

      expect(cli.out).toHaveBeenCalledWith('\x1Bc');
    });

    it('resets last output height', () => {
      cli.lastOutputHeight = 10;
      cli.clearOutput();

      expect(cli.lastOutputHeight).toBe(0);
    });
  });

  describe('clearLinesOutput()', () => {
    it('writes ansi escape code for each line height', () => {
      cli.lastOutputHeight = 10;
      cli.clearLinesOutput();

      expect(cli.out).toHaveBeenCalledWith('\x1B[1A\x1B[K'.repeat(10));
    });

    it('resets last output height', () => {
      cli.lastOutputHeight = 10;
      cli.clearLinesOutput();

      expect(cli.lastOutputHeight).toBe(0);
    });
  });

  describe('displayLogs()', () => {
    it('displays nothing if no logs', () => {
      cli.displayLogs([]);

      expect(cli.bufferedOutput).toBe('');
    });

    it('displays the logs', () => {
      cli.displayLogs(['foo', 'bar']);

      expect(cli.bufferedOutput).toBe('\nfoo\nbar\n');
    });
  });

  describe('exit()', () => {
    const oldExit = process.exit.bind(process);

    beforeEach(() => {
      // @ts-ignore
      process.exit = jest.fn();
      cli.on('stop', jest.fn());
      cli.emit = jest.fn();
    });

    afterEach(() => {
      process.exit = oldExit;
    });

    it('calls `stop` with null', done => {
      cli.exit(null, 2, true);

      process.nextTick(() => {
        expect(process.exit).toHaveBeenCalledWith(2);
        expect(cli.emit).toHaveBeenCalledWith('stop', [null, 2]);
        done();
      });
    });

    it('calls `stop` with string', done => {
      cli.exit('Oops', 2, true);

      process.nextTick(() => {
        expect(process.exit).toHaveBeenCalledWith(2);
        expect(cli.emit).toHaveBeenCalledWith('stop', [new Error('Oops'), 2]);
        done();
      });
    });

    it('calls `stop` with error', done => {
      const error = new Error('Oops');

      cli.exit(error, 2, true);

      process.nextTick(() => {
        expect(process.exit).toHaveBeenCalledWith(2);
        expect(cli.emit).toHaveBeenCalledWith('stop', [error, 2]);
        done();
      });
    });

    it('unwraps streams', done => {
      const spy = jest.spyOn(cli, 'unwrapStream');

      cli.exit(null, 2, true);

      process.nextTick(() => {
        expect(spy).toHaveBeenCalledTimes(2);
        done();
      });
    });

    it('displays logs on success', () => {
      cli.logs.push('foo');

      const spy = jest.spyOn(cli, 'displayLogs');

      cli.exit(null);

      expect(spy).toHaveBeenCalledWith(['foo']);
    });

    it('displays error logs on failure', () => {
      cli.errorLogs.push('foo');

      const spy = jest.spyOn(cli, 'displayLogs');

      cli.exit(null);

      expect(spy).toHaveBeenCalledWith(['foo']);
    });

    it('doesnt display either logs when an error', () => {
      cli.logs.push('foo');
      cli.errorLogs.push('foo');

      const spy = jest.spyOn(cli, 'displayLogs');

      cli.exit(new Error('Oops'));

      expect(spy).not.toHaveBeenCalled();
    });

    it('triggers a final render', () => {
      const spy = jest.fn();

      cli.handleRender = spy;
      cli.exit(new Error('Oops'));

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('flushBufferedOutput()', () => {
    it('doesnt output if no buffer', () => {
      cli.flushBufferedOutput();

      expect(cli.out).not.toHaveBeenCalled();
    });

    it('output if buffer is not empty', () => {
      cli.bufferedOutput = 'foo\nbar\nbaz';
      cli.flushBufferedOutput();

      expect(cli.out).toHaveBeenCalledWith('foo\nbar\nbaz');
    });

    it('sets last output height', () => {
      cli.bufferedOutput = 'foo\nbar\nbaz';
      cli.flushBufferedOutput();

      expect(cli.lastOutputHeight).toBe(2);
    });
  });

  describe('flushBufferedStreams()', () => {
    it('calls all buffer callbacks', () => {
      const spy1 = jest.fn();
      const spy2 = jest.fn();

      cli.bufferedStreams.push(spy1, spy2);
      cli.flushBufferedStreams();

      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });
  });

  describe('handleFailure()', () => {
    it('calls exit with error', () => {
      const error = new Error('Oops');

      cli.exit = jest.fn();
      cli.handleFailure(error);

      expect(cli.exit).toHaveBeenCalledWith(error, 1, true);
    });
  });

  describe('handleSignal()', () => {
    it('calls exit with error', () => {
      cli.exit = jest.fn();
      cli.handleSignal();

      expect(cli.exit).toHaveBeenCalledWith('Process has been terminated.', 1, true);
    });
  });

  describe('handleRender()', () => {
    let timeoutSpy: jest.SpyInstance;

    beforeEach(() => {
      timeoutSpy = jest.spyOn(global, 'clearTimeout');
    });

    afterEach(() => {
      timeoutSpy.mockRestore();
    });

    it('calls clearTimeout if render timer set', () => {
      // @ts-ignore
      cli.renderTimer = 1;
      cli.handleRender();

      expect(timeoutSpy).toHaveBeenCalled();
    });

    it('calls clearTimeout if refresh timer set', () => {
      // @ts-ignore
      cli.refreshTimer = 1;
      cli.handleRender();

      expect(timeoutSpy).toHaveBeenCalled();
    });

    it('triggers `render` event', () => {
      const spy = jest.spyOn(cli, 'emit');

      cli.handleRender();

      expect(spy).toHaveBeenCalledWith('render');
    });

    it('triggers `error` event if an error', () => {
      const spy = jest.spyOn(cli, 'emit');
      const error = new Error('Oops');

      cli.handleRender(error);

      expect(spy).toHaveBeenCalledWith('error', [error]);
    });

    it('doesnt trigger `error` event if no error', () => {
      const spy = jest.spyOn(cli, 'emit');
      const error = new Error('Oops');

      cli.handleRender();

      expect(spy).not.toHaveBeenCalledWith('error', [error]);
    });
  });

  describe('hideCursor()', () => {
    it('writes ansi escape code', () => {
      cli.hideCursor();

      expect(cli.out).toHaveBeenCalledWith('\x1B[?25l');
    });
  });

  describe('log()', () => {
    it('adds a log', () => {
      expect(cli.logs).toEqual([]);

      cli.log('foo');

      expect(cli.logs).toEqual(['foo']);
    });
  });

  describe('logError()', () => {
    it('adds a log', () => {
      expect(cli.errorLogs).toEqual([]);

      cli.logError('foo');

      expect(cli.errorLogs).toEqual(['foo']);
    });
  });

  describe('render()', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      jest.useFakeTimers();
      spy = jest.spyOn(global, 'setTimeout');
    });

    afterEach(() => {
      spy.mockRestore();
      jest.useRealTimers();
    });

    it('schedules a timer', () => {
      expect(cli.renderTimer).toBeNull();

      cli.render();

      expect(cli.renderTimer).not.toBeNull();
      expect(spy).toHaveBeenCalled();
    });

    it('doesnt schedule if already set', () => {
      cli.render();
      cli.render();
      cli.render();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('resetCursor()', () => {
    it('writes ansi escape code', () => {
      cli.resetCursor();

      expect(cli.out).toHaveBeenCalledWith(expect.stringContaining('0H'));
    });
  });

  describe('showCursor()', () => {
    it('writes ansi escape code', () => {
      cli.showCursor();

      expect(cli.out).toHaveBeenCalledWith('\x1B[?25h');
    });
  });

  describe('write()', () => {
    it('adds to buffered output', () => {
      cli.write('foo');
      cli.write('bar');

      expect(cli.bufferedOutput).toBe('foobar');
    });

    it('can control newlines', () => {
      cli.write('foo', 1);
      cli.write('bar', 2);

      expect(cli.bufferedOutput).toBe('foo\nbar\n\n');
    });

    // TODO
    it.skip('doesnt log if silent', () => {
      // cli.options.silent = true;
      cli.write('foo');
      cli.write('bar');

      expect(cli.bufferedOutput).toBe('');
    });
  });
});
