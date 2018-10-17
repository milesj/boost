/* eslint-disable unicorn/no-hex-escape */

import Console from '../src/Console';
import { createTestTool } from './helpers';

describe('Console', () => {
  let cli: Console;

  beforeEach(() => {
    cli = new Console(createTestTool());
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

  describe('displayFooter()', () => {
    it('displays nothing if no footer', () => {
      cli.displayFooter();

      expect(cli.bufferedOutput).toBe('');
    });

    it('displays the footer', () => {
      cli.tool.options.footer = 'Powered by Boost';
      cli.displayFooter();

      expect(cli.bufferedOutput).toBe('Powered by Boost\n');
    });
  });

  describe('displayHeader()', () => {
    it('displays nothing if no header', () => {
      cli.displayHeader();

      expect(cli.bufferedOutput).toBe('');
    });

    it('displays the header', () => {
      cli.tool.options.header = 'Powered by Boost';
      cli.displayHeader();

      expect(cli.bufferedOutput).toBe('Powered by Boost\n');
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
      process.exit = jest.fn() as any;
      cli.on('stop', jest.fn());
      cli.emit = jest.fn();
    });

    afterEach(() => {
      process.exit = oldExit;
    });

    it('calls `stop` with null', () => {
      cli.exit(null, 2);

      expect(process.exit).toHaveBeenCalledWith(2);
      expect(cli.emit).toHaveBeenCalledWith('stop', [null, 2]);
    });

    it('calls `stop` with string', () => {
      cli.exit('Oops', 2);

      expect(process.exit).toHaveBeenCalledWith(2);
      expect(cli.emit).toHaveBeenCalledWith('stop', [new Error('Oops'), 2]);
    });

    it('calls `stop` with error', () => {
      const error = new Error('Oops');

      cli.exit(error, 2);

      expect(process.exit).toHaveBeenCalledWith(2);
      expect(cli.emit).toHaveBeenCalledWith('stop', [error, 2]);
    });

    it('unwraps streams', () => {
      const spy = jest.spyOn(cli, 'unwrapStream');

      cli.exit(null, 2);

      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('displays logs on success', () => {
      cli.logs.push('foo');

      const spy = jest.spyOn(cli, 'displayLogs');

      cli.exit(null, 0);

      expect(spy).toHaveBeenCalledWith(['foo']);
    });

    it('displays error logs on failure', () => {
      cli.errorLogs.push('foo');

      const spy = jest.spyOn(cli, 'displayLogs');

      cli.exit(new Error('Oops'), 1);

      expect(spy).toHaveBeenCalledWith(['foo']);
    });

    it('triggers a final render', () => {
      const spy = jest.fn();
      const error = new Error('Oops');

      cli.handleFinalRender = spy;
      cli.exit(error, 1);

      expect(spy).toHaveBeenCalledWith(error);
    });

    it('copies logs to error logs if persist is true', () => {
      cli.logs.push('Hello');

      expect(cli.errorLogs).toEqual([]);

      cli.exit(new Error('Oops'), 2, true);

      expect(cli.logs).toEqual([]);
      expect(cli.errorLogs).toEqual(['Hello']);
    });

    it('doesnt copy logs if not an error', () => {
      cli.logs.push('Hello');

      expect(cli.errorLogs).toEqual([]);

      cli.exit(null, 0, true);

      expect(cli.logs).toEqual(['Hello']);
      expect(cli.errorLogs).toEqual([]);
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

    it('doesnt append a footer if not final', () => {
      cli.tool.options.footer = 'Footer';
      cli.handleRender();

      expect(cli.out).toHaveBeenCalledWith('');
    });

    it('doesnt prepend a header if not final', () => {
      cli.tool.options.header = 'Header';
      cli.handleRender();

      expect(cli.out).toHaveBeenCalledWith('');
    });

    it('doesnt display logs if not final', () => {
      cli.logs.push('Log');
      cli.errorLogs.push('Error log');
      cli.handleRender();

      expect(cli.out).toHaveBeenCalledWith('');
    });

    it('doesnt clear render listeners', () => {
      cli.on('render', () => {
        cli.write('Rendering something...', 1);
      });
      cli.handleRender();

      expect(cli.getListeners('render').size).toBe(1);
    });
  });

  describe('handleFinalRender()', () => {
    beforeEach(() => {
      cli.on('render', () => {
        cli.write('Rendering something...', 1);
      });

      cli.on('error', (error: Error) => {
        cli.write(error.message, 1);
      });
    });

    it('displays final output', () => {
      cli.handleFinalRender();

      expect(cli.out).toHaveBeenCalledWith('Rendering something...\n');
    });

    it('displays an error after the output', () => {
      cli.handleFinalRender(new Error('Oops'));

      expect(cli.out).toHaveBeenCalledWith('Rendering something...\nOops\n');
    });

    it('appends a footer', () => {
      cli.tool.options.footer = 'Footer';
      cli.handleFinalRender();

      expect(cli.out).toHaveBeenCalledWith('Rendering something...\nFooter\n');
    });

    it('prepends a header', () => {
      cli.tool.options.header = 'Header';
      cli.handleFinalRender();

      expect(cli.out).toHaveBeenCalledWith('Header\nRendering something...\n');
    });

    it('displays logs', () => {
      cli.logs.push('Log');
      cli.handleFinalRender();

      expect(cli.out).toHaveBeenCalledWith('Rendering something...\n\nLog\n');
    });

    it('clears render listeners', () => {
      cli.handleFinalRender();

      expect(cli.getListeners('render').size).toBe(0);
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
    let clearSpy: jest.SpyInstance;

    beforeEach(() => {
      jest.useFakeTimers();
      spy = jest.spyOn(global, 'setTimeout');
      clearSpy = jest.spyOn(global, 'clearTimeout');
    });

    afterEach(() => {
      spy.mockRestore();
      clearSpy.mockRestore();
      jest.useRealTimers();
    });

    it('clears refresh timer', () => {
      cli.refreshTimer = 1 as any;
      cli.render();

      expect(clearSpy).toHaveBeenCalled();
      expect(cli.refreshTimer).toBeNull();
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

    it('calls handleRender() after timeout', () => {
      const renderSpy = jest.fn();

      cli.handleRender = renderSpy;
      cli.render();

      expect(renderSpy).not.toHaveBeenCalled();

      jest.runOnlyPendingTimers();

      expect(renderSpy).toHaveBeenCalled();
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

  describe('startBackgroundTimer()', () => {
    let spy: jest.SpyInstance;
    let clearSpy: jest.SpyInstance;

    beforeEach(() => {
      jest.useFakeTimers();
      spy = jest.spyOn(global, 'setTimeout');
      clearSpy = jest.spyOn(global, 'clearTimeout');
    });

    afterEach(() => {
      spy.mockRestore();
      clearSpy.mockRestore();
      jest.useRealTimers();
    });

    it('clears refresh timer', () => {
      cli.refreshTimer = 1 as any;
      cli.startBackgroundTimer();

      expect(clearSpy).toHaveBeenCalled();
      expect(cli.refreshTimer).not.toBe(1);
    });

    it('schedules a timer', () => {
      expect(cli.refreshTimer).toBeNull();

      cli.startBackgroundTimer();

      expect(cli.refreshTimer).not.toBeNull();
      expect(spy).toHaveBeenCalled();
    });

    it('calls handleRender() after timeout', () => {
      const renderSpy = jest.fn();

      cli.handleRender = renderSpy;
      cli.render();

      expect(renderSpy).not.toHaveBeenCalled();

      jest.runOnlyPendingTimers();

      expect(renderSpy).toHaveBeenCalled();
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

    it('doesnt log if silent', () => {
      cli.tool.config.silent = true;
      cli.write('foo');
      cli.write('bar');

      expect(cli.bufferedOutput).toBe('');
    });

    it('supports prepending', () => {
      cli.write('foo');
      cli.write('bar', 0, true);

      expect(cli.bufferedOutput).toBe('barfoo');
    });
  });
});
