import exit from 'exit';
import { mockTool } from '../src/tests';
import Console, { WRAPPED_STREAMS } from '../src/Console';
import Output from '../src/Output';
import { SignalError } from '../src';

jest.mock('exit');

describe('Console', () => {
  let cli: Console;
  let err: jest.Mock;
  let out: jest.Mock;

  beforeEach(() => {
    err = jest.fn();
    out = jest.fn();
    cli = new Console(mockTool(), {
      stderr: err,
      stdout: out,
    });
  });

  describe('disable()', () => {
    it('marks as disabled', () => {
      expect(cli.isDisabled()).toBe(false);

      cli.disable();

      expect(cli.isDisabled()).toBe(true);
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

  describe('enable()', () => {
    it('marks as enabled', () => {
      cli.disable();

      expect(cli.isDisabled()).toBe(true);

      cli.enable();

      expect(cli.isDisabled()).toBe(false);
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

    it('re-flushes the queue when output is complete and queue isnt empty', () => {
      const loopSpy = jest.spyOn(cli, 'startRenderLoop');
      const o1 = new Output(cli, () => 'foo');
      const o2 = new Output(cli, () => 'bar');

      o1.enqueue(true);

      cli.outputQueue.push(o1, o2);
      cli.flushOutputQueue();

      expect(loopSpy).toHaveBeenCalledTimes(2);
      expect(out).toHaveBeenCalledWith('foo\n');
      expect(cli.outputQueue).toEqual([o2]);
    });

    it('stops the loop when output is complete and queue is empty', () => {
      const loopSpy = jest.spyOn(cli, 'stopRenderLoop');
      const output = new Output(cli, () => 'foo');

      output.enqueue(true);

      cli.outputQueue.push(output);
      cli.flushOutputQueue();

      expect(loopSpy).toHaveBeenCalledTimes(1);
      expect(out).toHaveBeenCalledWith('foo\n');
      expect(cli.outputQueue).toEqual([]);
    });

    describe('non-concurrent', () => {
      it('renders an output', () => {
        const output = new Output(cli, () => 'foo');
        const eraseSpy = jest.spyOn(output, 'erasePrevious');
        const renderSpy = jest.spyOn(output, 'render');

        cli.outputQueue.push(output);
        cli.flushOutputQueue();

        expect(eraseSpy).toHaveBeenCalled();
        expect(renderSpy).toHaveBeenCalled();
        expect(out).toHaveBeenCalledWith('foo\n');
        expect(cli.outputQueue).toEqual([output]);
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
        expect(out).toHaveBeenCalledWith('foo\n');
        expect(cli.outputQueue).toEqual([o1, o2]);
      });

      it('removes the output when complete', () => {
        const output = new Output(cli, () => 'foo');
        output.enqueue(true);

        cli.outputQueue.push(output);
        cli.flushOutputQueue();

        expect(out).toHaveBeenCalledWith('foo\n');
        expect(cli.outputQueue).toEqual([]);
      });
    });

    describe('concurrent', () => {
      it('renders first output and concurrent outputs', () => {
        const o1 = new Output(cli, () => 'foo');
        const o2 = new Output(cli, () => 'bar');
        const o3 = new Output(cli, () => 'baz').concurrent();

        cli.outputQueue.push(o1, o2, o3);
        cli.flushOutputQueue();

        expect(out).toHaveBeenCalledWith('foo\n');
        expect(out).toHaveBeenCalledWith('baz\n');
        expect(cli.outputQueue).toEqual([o1, o2, o3]);
      });

      it('renders all concurrent outputs', () => {
        const o1 = new Output(cli, () => 'foo');
        const o2 = new Output(cli, () => 'bar');
        const o3 = new Output(cli, () => 'baz').concurrent();
        const o4 = new Output(cli, () => 'qux');
        const o5 = new Output(cli, () => 'wtf').concurrent();

        cli.outputQueue.push(o1, o2, o3, o4, o5);
        cli.flushOutputQueue();

        expect(out).toHaveBeenCalledWith('foo\n');
        expect(out).toHaveBeenCalledWith('baz\n');
        expect(out).toHaveBeenCalledWith('wtf\n');
        expect(cli.outputQueue).toEqual([o1, o2, o3, o4, o5]);
      });

      it('removes all concurrent outputs that are completed', () => {
        const o1 = new Output(cli, () => 'foo');
        const o2 = new Output(cli, () => 'bar');
        const o3 = new Output(cli, () => 'baz').concurrent();
        const o4 = new Output(cli, () => 'qux');
        const o5 = new Output(cli, () => 'wtf').concurrent();

        o1.enqueue(true);
        o5.enqueue(true);

        cli.outputQueue.push(o1, o2, o3, o4, o5);
        cli.flushOutputQueue();

        expect(out).toHaveBeenCalledWith('foo\n');
        expect(out).toHaveBeenCalledWith('baz\n');
        expect(out).toHaveBeenCalledWith('wtf\n');
        expect(cli.outputQueue).toEqual([o2, o3, o4]);
      });
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
      cli.handleSignal('SIGINT');

      expect(cli.stop).toHaveBeenCalledWith(
        new SignalError('Process has been terminated.', 'SIGINT'),
      );
    });

    it('exits with a code of 2', () => {
      cli.handleSignal('SIGTERM');

      expect(exit).toHaveBeenCalledWith(2);
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
      const old = process.stdout.write.bind(process.stdout);
      const spy = jest.fn();

      process.stdout.write = spy;

      cli.logLive('foo');

      expect(spy).toHaveBeenCalledWith('foo');

      // @ts-ignore
      process.stdout.write = old;
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

    it('throws an error when render loop is disabled', () => {
      cli.disable();

      expect(() => {
        cli.render(new Output(cli, () => 'foo'));
      }).toThrowErrorMatchingSnapshot();
    });

    it('starts the render loop', () => {
      const spy = jest.spyOn(cli, 'startRenderLoop');

      cli.render(new Output(cli, () => 'foo'));

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('renderFinalOutput()', () => {
    it('flushes and stops loop', () => {
      const queueSpy = jest.spyOn(cli, 'flushOutputQueue');
      const streamSpy = jest.spyOn(cli, 'flushBufferedStreams');
      const loopSpy = jest.spyOn(cli, 'stopRenderLoop');

      cli.renderFinalOutput(null);

      expect(queueSpy).not.toHaveBeenCalled();
      expect(streamSpy).toHaveBeenCalled();
      expect(loopSpy).toHaveBeenCalled();
    });

    it('marks all output as final and renders', () => {
      const queueSpy = jest.spyOn(cli, 'flushOutputQueue');
      const foo = new Output(cli, () => 'foo');
      const bar = new Output(cli, () => 'bar');
      const baz = new Output(cli, () => 'baz');

      cli.outputQueue.push(foo, bar, baz);
      cli.renderFinalOutput(null);

      expect(queueSpy).toHaveBeenCalled();

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

      expect(out).not.toHaveBeenCalledWith('\nfoo\nbar\nbaz\n');
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
      cli.tool.options.footer = 'Footer';

      cli.renderFinalOutput(null);

      expect(out).toHaveBeenCalledWith('Footer\n');
    });

    it('doesnt display footer on failure', () => {
      cli.tool.options.footer = 'Footer';

      cli.renderFinalOutput(new Error());

      expect(out).not.toHaveBeenCalledWith('Footer');
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

  describe('start()', () => {
    it('sets `started` flag', () => {
      // @ts-ignore Allow access
      expect(cli.state.started).toBe(false);

      cli.start();

      // @ts-ignore Allow access
      expect(cli.state.started).toBe(true);
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
      cli.start([]);

      expect(cli.wrapStreams).toHaveBeenCalled();
      expect(cli.displayHeader).toHaveBeenCalled();
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
    it('sets a timer', () => {
      // @ts-ignore Allow access
      expect(cli.renderTimer).toBeNull();

      cli.startRenderLoop();

      // @ts-ignore Allow access
      expect(cli.renderTimer).not.toBeNull();
    });

    it('doesnt set a timer if disabled', () => {
      cli.disable();
      cli.startRenderLoop();

      // @ts-ignore Allow access
      expect(cli.renderTimer).toBeNull();
    });

    it('doesnt set a timer if silent', () => {
      cli.tool.config.silent = true;
      cli.startRenderLoop();

      // @ts-ignore Allow access
      expect(cli.renderTimer).toBeNull();
    });

    it('flushes output and resets timer', () => {
      const spy = jest.spyOn(cli, 'flushOutputQueue');

      cli.startRenderLoop();

      // @ts-ignore Allow access
      expect(cli.renderTimer).not.toBeNull();

      jest.advanceTimersByTime(200);

      expect(spy).toHaveBeenCalledWith();

      // @ts-ignore Allow access
      expect(cli.renderTimer).toBeNull();
    });
  });

  describe('stop()', () => {
    it('sets `stopped` flag', () => {
      // @ts-ignore Allow access
      expect(cli.state.stopped).toBe(false);

      cli.stop();

      // @ts-ignore Allow access
      expect(cli.state.stopped).toBe(true);
    });

    it('sets `started` flag', () => {
      cli.start();

      // @ts-ignore Allow access
      expect(cli.state.started).toBe(true);

      cli.stop();

      // @ts-ignore Allow access
      expect(cli.state.started).toBe(false);
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

  describe('streams', () => {
    const oldErr = process.stderr.write;
    const oldOut = process.stdout.write;

    beforeEach(() => {
      process.env.NODE_ENV = 'test-streams';
    });

    afterEach(() => {
      process.env.NODE_ENV = 'test';

      process.stderr.write = oldErr;
      process.stdout.write = oldOut;

      WRAPPED_STREAMS.stderr = false;
      WRAPPED_STREAMS.stdout = false;
    });

    describe('unwrapStreams()', () => {
      it('sets process streams to defined writes', () => {
        cli.wrapStreams();
        cli.unwrapStreams();

        expect(process.stderr.write).toBe(err);
        expect(process.stdout.write).toBe(out);

        expect(cli.isStreamWrapped('stderr')).toBe(false);
        expect(cli.isStreamWrapped('stdout')).toBe(false);
      });

      it('doesnt set process streams to defined writes when silent', () => {
        cli.tool.config.silent = true;
        cli.wrapStreams();
        cli.unwrapStreams();

        expect(process.stderr.write).not.toBe(err);
        expect(process.stdout.write).not.toBe(out);
      });
    });

    describe('wrapStreams()', () => {
      it('sets process streams to custom writers', () => {
        cli.wrapStreams();

        expect(process.stderr.write).not.toBe(oldErr);
        expect(process.stdout.write).not.toBe(oldOut);

        expect(cli.isStreamWrapped('stderr')).toBe(true);
        expect(cli.isStreamWrapped('stdout')).toBe(true);
      });

      it('only wraps once per stream', () => {
        cli.wrapStreams();
        cli.wrapStreams();
        cli.wrapStreams();

        expect(cli.bufferedStreams).toHaveLength(2);
      });

      it('doesnt set process streams to custom writers when silent', () => {
        cli.tool.config.silent = true;
        cli.wrapStreams();

        expect(cli.bufferedStreams).toHaveLength(0);
      });

      it('doesnt set process streams to custom writers when disabled', () => {
        cli.disable();
        cli.wrapStreams();

        expect(cli.bufferedStreams).toHaveLength(0);
      });

      it('calls stream directly when queue is empty', () => {
        cli.wrapStreams();

        process.stdout.write('foo');

        expect(out).toHaveBeenCalledWith('foo');
      });

      it('buffers stream when queue is not empty', () => {
        cli.wrapStreams();
        cli.outputQueue.push(new Output(cli, () => 'test'));

        process.stdout.write('foo');

        expect(out).not.toHaveBeenCalledWith('foo');
      });
    });
  });
});
