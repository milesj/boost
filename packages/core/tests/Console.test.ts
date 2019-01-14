import exit from 'exit';
import cliSize from 'term-size';
import ansiEscapes from 'ansi-escapes';
import Console from '../src/Console';
import Output from '../src/Output';
import { createTestTool } from './helpers';

jest.mock('exit');

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

      expect(cli.stop).toHaveBeenCalledWith(error);
    });

    it('exits with a code of 2', () => {
      cli.handleFailure(new Error('Oops'));

      expect(exit).toHaveBeenCalledWith(2);
    });
  });

  describe('handleSignal()', () => {
    it('calls exit with error', () => {
      cli.stop = jest.fn();
      cli.handleSignal();

      expect(cli.stop).toHaveBeenCalledWith(new Error('Process has been terminated.'));
    });

    it('exits with a code of 2', () => {
      cli.handleSignal();

      expect(exit).toHaveBeenCalledWith(2);
    });
  });

  describe('hideCursor()', () => {
    it('writes ansi escape code', () => {
      cli.hideCursor();

      expect(out).toHaveBeenCalledWith(ansiEscapes.cursorHide);
    });

    it('sets restore flag', () => {
      cli.hideCursor();

      // @ts-ignore Allow access
      expect(cli.restoreCursorOnExit).toBe(true);
    });

    it('doesnt set restore flag if config is silent', () => {
      cli.tool.config.silent = true;
      cli.hideCursor();

      // @ts-ignore Allow access
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

  describe('renderFinalOutput()', () => {
    it('flushes and stops loop', () => {
      const queueSpy = jest.spyOn(cli, 'flushOutputQueue');
      const streamSpy = jest.spyOn(cli, 'flushBufferedStreams');
      const loopSpy = jest.spyOn(cli, 'stopRenderLoop');

      cli.renderFinalOutput(null);

      expect(queueSpy).toHaveBeenCalled();
      expect(streamSpy).toHaveBeenCalled();
      expect(loopSpy).toHaveBeenCalled();
    });

    it('marks all output as final and renders', () => {
      const foo = new Output(cli, () => 'foo');
      const bar = new Output(cli, () => 'bar');
      const baz = new Output(cli, () => 'baz');

      cli.outputQueue.push(foo, bar, baz);
      cli.renderFinalOutput(null);

      expect(foo.isFinal()).toBe(true);
      expect(bar.isFinal()).toBe(true);
      expect(baz.isFinal()).toBe(true);

      expect(foo.isComplete()).toBe(true);
      expect(bar.isComplete()).toBe(true);
      expect(baz.isComplete()).toBe(true);

      expect(out).toHaveBeenCalledWith('foo\n');
      expect(out).toHaveBeenCalledWith('bar\n');
      expect(out).toHaveBeenCalledWith('baz\n');
    });

    it('displays logs on success', () => {
      cli.log('foo');
      cli.log('bar');
      cli.log('baz');

      cli.renderFinalOutput(null);

      expect(out).toHaveBeenCalledWith('\nfoo\nbar\nbaz\n');
    });

    it('doesnt display logs on failure', () => {
      cli.log('foo');
      cli.log('bar');
      cli.log('baz');

      cli.renderFinalOutput(new Error());

      expect(out).not.toHaveBeenCalled();
    });

    it('displays error logs on failure', () => {
      cli.logError('foo');
      cli.logError('bar');
      cli.logError('baz');

      cli.renderFinalOutput(new Error());

      expect(err).toHaveBeenCalledWith('\nfoo\nbar\nbaz\n');
    });

    it('doesnt display error logs on success', () => {
      cli.logError('foo');
      cli.logError('bar');
      cli.logError('baz');

      cli.renderFinalOutput(null);

      expect(err).not.toHaveBeenCalled();
    });

    it('displays footer on success', () => {
      cli.log('foo');
      cli.log('bar');
      cli.log('baz');

      cli.renderFinalOutput(null);

      expect(out).toHaveBeenCalledWith('\nfoo\nbar\nbaz\n');
    });

    it('doesnt display footer on failure', () => {
      cli.log('foo');
      cli.log('bar');
      cli.log('baz');

      cli.renderFinalOutput(new Error());

      expect(out).not.toHaveBeenCalled();
    });

    it('emits `error` event on failure', () => {
      const spy = jest.fn();
      const error = new Error('Stop');

      cli.on('error', spy);
      cli.renderFinalOutput(error);

      expect(spy).toHaveBeenCalledWith(error);
    });

    it('doesnt emit `error` event on success', () => {
      const spy = jest.fn();

      cli.on('error', spy);
      cli.renderFinalOutput(null);

      expect(spy).not.toHaveBeenCalled();
    });

    it('sets `final` flag', () => {
      expect(cli.isFinalRender()).toBe(false);

      cli.renderFinalOutput(null);

      expect(cli.isFinalRender()).toBe(true);
    });
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

      // @ts-ignore Allow access
      expect(cli.restoreCursorOnExit).toBe(false);
    });
  });

  describe('start()', () => {
    it('sets `started` flag', () => {
      // @ts-ignore Allow access
      expect(cli.started).toBe(false);

      cli.start();

      // @ts-ignore Allow access
      expect(cli.started).toBe(true);
    });

    it('only triggers once if started', () => {
      const spy = jest.spyOn(cli, 'wrapStreams');

      cli.start();
      cli.start();

      expect(spy).toHaveBeenCalledTimes(1);
    });

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
      // @ts-ignore Allow access
      expect(cli.renderTimer).toBeNull();

      cli.startRenderLoop();

      // @ts-ignore Allow access
      expect(cli.renderTimer).not.toBeNull();
    });

    it('flushes output queue and restarts loop', () => {
      cli.flushOutputQueue = jest.fn();
      cli.startRenderLoop();

      // @ts-ignore Allow access
      const id = cli.renderTimer;

      jest.advanceTimersByTime(100);

      expect(cli.flushOutputQueue).toHaveBeenCalled();
      // @ts-ignore Allow access
      expect(cli.renderTimer).not.toEqual(id);
    });
  });

  describe('stop()', () => {
    it('sets `stopped` flag', () => {
      // @ts-ignore Allow access
      expect(cli.stopped).toBe(false);

      cli.stop();

      // @ts-ignore Allow access
      expect(cli.stopped).toBe(true);
    });

    it('sets `started` flag', () => {
      cli.start();

      // @ts-ignore Allow access
      expect(cli.started).toBe(true);

      cli.stop();

      // @ts-ignore Allow access
      expect(cli.started).toBe(false);
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

      cli.stop(new Error('Oops'));

      expect(spy).toHaveBeenCalledWith(new Error('Oops'));
    });

    it('unwraps streams', () => {
      const spy = jest.spyOn(cli, 'unwrapStreams');

      cli.stop();

      expect(spy).toHaveBeenCalledTimes(1);
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

      // @ts-ignore Allow access
      expect(cli.renderTimer).toBeNull();
    });
  });
});
