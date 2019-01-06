import cliSize from 'term-size';
import ansiEscapes from 'ansi-escapes';
import Console from '../src/Console';
import Output from '../src/Output';
import { createTestTool } from './helpers';

describe('Console', () => {
  let cli: Console;
  let err: jest.Mock;
  let out: jest.Mock;

  beforeEach(() => {
    err = jest.fn();
    out = jest.fn();
    cli = new Console(createTestTool(), {
      stderr: err,
      stdout: out,
    });
  });

  describe('createOutput()', () => {
    it('returns an `Output` instance', () => {
      expect(cli.createOutput(() => 'foo')).toBeInstanceOf(Output);
    });
  });

  describe('displayFooter()', () => {
    it('displays nothing if no footer', () => {
      cli.displayFooter();

      expect(out).not.toHaveBeenCalled();
    });

    it('displays the footer', () => {
      cli.tool.options.footer = 'Powered by Boost';
      cli.displayFooter();

      expect(out).toHaveBeenCalledWith('Powered by Boost\n');
    });
  });

  describe('displayHeader()', () => {
    it('displays nothing if no header', () => {
      cli.displayHeader();

      expect(out).not.toHaveBeenCalled();
    });

    it('displays the header', () => {
      cli.tool.options.header = 'Powered by Boost';
      cli.displayHeader();

      expect(out).toHaveBeenCalledWith('Powered by Boost\n');
    });
  });

  describe('err()', () => {
    it('writes a message to `stderr`', () => {
      cli.err('Hello');

      expect(err).toHaveBeenCalledWith('Hello');
    });

    it('doesnt write to `stderr` if config is silent', () => {
      cli.tool.config.silent = true;
      cli.err('Hello');

      expect(err).not.toHaveBeenCalled();
    });

    it('can customize the number of trailing newlines', () => {
      cli.err('Hello', 3);
      cli.err('Hello', 1);

      expect(err).toHaveBeenCalledWith('Hello\n\n\n');
      expect(err).toHaveBeenCalledWith('Hello\n');
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

  describe('flushOutputQueue()', () => {
    it('flushes buffered streams', () => {
      const spy = jest.spyOn(cli, 'flushBufferedStreams');

      cli.flushOutputQueue();

      expect(spy).toHaveBeenCalled();
    });

    it('renders an output', () => {
      const output = new Output(cli, () => 'foo');
      const eraseSpy = jest.spyOn(output, 'erasePrevious');
      const renderSpy = jest.spyOn(output, 'render');

      cli.outputQueue.push(output);
      cli.flushOutputQueue();

      expect(eraseSpy).toHaveBeenCalled();
      expect(renderSpy).toHaveBeenCalled();
    });

    it('only renders the first output', () => {
      const o1 = new Output(cli, () => 'foo');
      const o2 = new Output(cli, () => 'bar');
      const eraseSpy = jest.spyOn(o2, 'erasePrevious');
      const renderSpy = jest.spyOn(o2, 'render');

      cli.outputQueue.push(o1, o2);
      cli.flushOutputQueue();

      expect(eraseSpy).not.toHaveBeenCalled();
      expect(renderSpy).not.toHaveBeenCalled();
    });

    it('removes the output when complete', () => {
      const output = new Output(cli, () => 'foo');
      output.enqueue(true);

      cli.outputQueue.push(output);
      cli.flushOutputQueue();

      expect(cli.outputQueue).toEqual([]);
    });

    it('re-flushes the queue when output is complete', () => {
      const spy = jest.spyOn(cli, 'flushOutputQueue');
      const output = new Output(cli, () => 'foo');
      output.enqueue(true);

      cli.outputQueue.push(output);
      cli.flushOutputQueue();

      expect(spy).not.toHaveBeenCalledTimes(1);
    });
  });

  describe('handleFailure()', () => {
    it('calls exit with error', () => {
      const error = new Error('Oops');

      cli.stop = jest.fn();
      cli.handleFailure(error);

      expect(cli.stop).toHaveBeenCalledWith(error, true);
    });
  });

  describe('handleSignal()', () => {
    it('calls exit with error', () => {
      cli.stop = jest.fn();
      cli.handleSignal();

      expect(cli.stop).toHaveBeenCalledWith('Process has been terminated.', true);
    });
  });

  describe('hideCursor()', () => {
    it('writes ansi escape code', () => {
      cli.hideCursor();

      expect(out).toHaveBeenCalledWith(ansiEscapes.cursorHide);
    });

    it('sets restore flag', () => {
      cli.hideCursor();

      expect(cli.restoreCursorOnExit).toBe(true);
    });

    it('doesnt set restore flag if config is silent', () => {
      cli.tool.config.silent = true;
      cli.hideCursor();

      expect(cli.restoreCursorOnExit).toBe(false);
    });
  });

  describe('isSilent()', () => {
    it('returns value from config', () => {
      expect(cli.isSilent()).toBe(false);

      cli.tool.config.silent = true;

      expect(cli.isSilent()).toBe(true);
    });
  });

  describe('log()', () => {
    it('adds a log', () => {
      expect(cli.logs).toEqual([]);

      cli.log('foo');

      expect(cli.logs).toEqual(['foo']);
    });
  });

  describe('logLive()', () => {
    it('adds a log via `console.log`', () => {
      const spy = jest.spyOn(process.stdout, 'write');

      cli.logLive('foo');

      expect(spy).toHaveBeenCalledWith('foo');

      spy.mockRestore();
    });
  });

  describe('logError()', () => {
    it('adds a log', () => {
      expect(cli.errorLogs).toEqual([]);

      cli.logError('foo');

      expect(cli.errorLogs).toEqual(['foo']);
    });
  });

  describe('out()', () => {
    it('writes a message to `stdout`', () => {
      cli.out('Hello');

      expect(out).toHaveBeenCalledWith('Hello');
    });

    it('doesnt write to `stdout` if config is silent', () => {
      cli.tool.config.silent = true;
      cli.out('Hello');

      expect(out).not.toHaveBeenCalled();
    });

    it('can customize the number of trailing newlines', () => {
      cli.out('Hello', 3);
      cli.out('Hello', 1);

      expect(out).toHaveBeenCalledWith('Hello\n\n\n');
      expect(out).toHaveBeenCalledWith('Hello\n');
    });
  });

  describe('render()', () => {
    it('enqueues an `Output` and doesnt duplicate', () => {
      expect(cli.outputQueue).toEqual([]);

      const output = new Output(cli, () => 'foo');

      cli.render(output);

      expect(cli.outputQueue).toEqual([output]);

      cli.render(output);

      expect(cli.outputQueue).toEqual([output]);
    });
  });

  describe.skip('renderFinalOutput()', () => {
    // TODO
  });

  describe('resetCursor()', () => {
    it('writes ansi escape code', () => {
      cli.resetCursor();

      expect(out).toHaveBeenCalledWith(ansiEscapes.cursorTo(0, cliSize().rows));
    });
  });

  describe('showCursor()', () => {
    it('writes ansi escape code', () => {
      cli.showCursor();

      expect(out).toHaveBeenCalledWith(ansiEscapes.cursorShow);
    });

    it('sets restore flag to off', () => {
      cli.showCursor();

      expect(cli.restoreCursorOnExit).toBe(false);
    });
  });

  describe('start()', () => {
    it('triggers the initial process methods', () => {
      cli.wrapStreams = jest.fn();
      cli.displayHeader = jest.fn();
      cli.startRenderLoop = jest.fn();
      cli.start([]);

      expect(cli.wrapStreams).toHaveBeenCalled();
      expect(cli.displayHeader).toHaveBeenCalled();
      expect(cli.startRenderLoop).toHaveBeenCalled();
    });

    it('emits `start` event', () => {
      const spy = jest.fn();

      cli.on('start', spy);
      cli.wrapStreams = jest.fn();
      cli.displayHeader = jest.fn();
      cli.startRenderLoop = jest.fn();
      cli.start([1, 2, 3]);

      expect(spy).toHaveBeenCalledWith(1, 2, 3);
    });
  });

  describe('startRenderLoop()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('sets a timer', () => {
      expect(cli.renderTimer).toBeNull();

      cli.startRenderLoop();

      expect(cli.renderTimer).not.toBeNull();
    });

    it('flushes output queue and restarts loop', () => {
      cli.flushOutputQueue = jest.fn();
      cli.startRenderLoop();

      const id = cli.renderTimer;

      jest.advanceTimersByTime(100);

      expect(cli.flushOutputQueue).toHaveBeenCalled();
      expect(cli.renderTimer).not.toEqual(id);
    });
  });

  describe('stop()', () => {
    it('sets `stopping` flag', () => {
      expect(cli.stopping).toBe(false);

      cli.stop();

      expect(cli.stopping).toBe(true);
    });

    it('only triggers once if stopping', () => {
      const spy = jest.spyOn(cli, 'renderFinalOutput');

      cli.stop();
      cli.stop();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('calls `stop` with null (no error)', () => {
      const spy = jest.fn();

      cli.on('stop', spy);
      cli.stop();

      expect(spy).toHaveBeenCalledWith(null);
    });

    it('calls `stop` with string', () => {
      const spy = jest.fn();

      cli.on('stop', spy);
      cli.stop('Oops');

      expect(spy).toHaveBeenCalledWith(new Error('Oops'));
    });

    it('calls `stop` with error', () => {
      const spy = jest.fn();
      const error = new Error('Oops');

      cli.on('stop', spy);
      cli.stop(error);

      expect(spy).toHaveBeenCalledWith(error);
    });

    it('renders final output', () => {
      const spy = jest.spyOn(cli, 'renderFinalOutput');

      cli.stop();

      expect(spy).toHaveBeenCalledWith(null);
    });

    it('renders final output with an error', () => {
      const spy = jest.spyOn(cli, 'renderFinalOutput');

      cli.stop('Oops');

      expect(spy).toHaveBeenCalledWith(new Error('Oops'));
    });

    it('unwraps streams', () => {
      const spy = jest.spyOn(cli, 'unwrapStreams');

      cli.stop();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('throws the error if forced', () => {
      expect(() => {
        cli.stop('Thrown', true);
      }).toThrowError('Thrown');
    });

    it('copies logs to error logs if persist is true', () => {
      cli.logs.push('Hello');

      expect(cli.errorLogs).toEqual([]);

      cli.stop(new Error('Oops'));

      expect(cli.logs).toEqual([]);
      expect(cli.errorLogs).toEqual(['Hello']);
    });

    it('doesnt copy logs if not an error', () => {
      cli.logs.push('Hello');

      expect(cli.errorLogs).toEqual([]);

      cli.stop();

      expect(cli.logs).toEqual(['Hello']);
      expect(cli.errorLogs).toEqual([]);
    });
  });

  describe('stopRenderLoop()', () => {
    it('it clears the timer', () => {
      // @ts-ignore
      cli.renderTimer = 123;
      cli.stopRenderLoop();

      expect(cli.renderTimer).toBeNull();
    });
  });
});
