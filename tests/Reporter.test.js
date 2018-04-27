/* eslint-disable unicorn/no-hex-escape */

import chalk from 'chalk';
import Reporter from '../src/Reporter';

describe('Reporter', () => {
  let reporter;

  beforeEach(() => {
    reporter = new Reporter();
    reporter.err = jest.fn();
    reporter.out = jest.fn();
  });

  describe('bootstrap()', () => {
    it('sets start and stop events', () => {
      const cli = { on: jest.fn() };

      reporter.bootstrap(cli);

      expect(cli.on).toHaveBeenCalledWith('start', expect.anything());
      expect(cli.on).toHaveBeenCalledWith('stop', expect.anything());
    });
  });

  describe('addLine()', () => {
    it('adds a line to the list', () => {
      expect(reporter.lines).toEqual([]);

      reporter.addLine('foo');

      expect(reporter.lines).toEqual(['foo']);
    });
  });

  describe('clearOutput()', () => {
    it('writes ansi escape code', () => {
      reporter.clearOutput();

      expect(reporter.out).toHaveBeenCalledWith('\x1Bc');
    });

    it('resets last output height', () => {
      reporter.lastOutputHeight = 10;
      reporter.clearOutput();

      expect(reporter.lastOutputHeight).toBe(0);
    });
  });

  describe('clearLinesOutput()', () => {
    it('writes ansi escape code for each line height', () => {
      reporter.lastOutputHeight = 10;
      reporter.clearLinesOutput();

      expect(reporter.out).toHaveBeenCalledWith('\x1B[1A\x1B[K'.repeat(10));
    });

    it('resets last output height', () => {
      reporter.lastOutputHeight = 10;
      reporter.clearLinesOutput();

      expect(reporter.lastOutputHeight).toBe(0);
    });
  });

  describe('debounceRender()', () => {
    let spy;

    beforeEach(() => {
      jest.useFakeTimers();
      spy = jest.spyOn(global, 'setTimeout');
    });

    afterEach(() => {
      spy.mockRestore();
      jest.useRealTimers();
    });

    it('schedules a timer', () => {
      expect(reporter.renderScheduled).toBe(false);

      reporter.debounceRender();

      expect(reporter.renderScheduled).toBe(true);
      expect(spy).toHaveBeenCalled();
    });

    it('doesnt schedule if already set', () => {
      reporter.debounceRender();
      reporter.debounceRender();
      reporter.debounceRender();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('displayError()', () => {
    it('writes to stderr', () => {
      reporter.displayError(new Error('Oops'));

      expect(reporter.err).toHaveBeenCalledTimes(3);
    });
  });

  describe('displayFinalOutput()', () => {
    let clearSpy;

    beforeEach(() => {
      clearSpy = jest.spyOn(global, 'clearTimeout');
    });

    afterEach(() => {
      clearSpy.mockRestore();
    });

    it('calls clearTimeout if timer set', () => {
      reporter.displayFinalOutput();

      expect(clearSpy).not.toHaveBeenCalled();

      reporter.renderTimer = 1;
      reporter.displayFinalOutput();

      expect(clearSpy).toHaveBeenCalledWith(1);
    });

    it('triggers final render', () => {
      const spy = jest.spyOn(reporter, 'handleRender');

      reporter.displayFinalOutput();

      expect(spy).toHaveBeenCalled();
    });

    it('displays error if provided', () => {
      const spy = jest.spyOn(reporter, 'displayError');
      const error = new Error('Oops');

      reporter.displayFinalOutput(error);

      expect(spy).toHaveBeenCalledWith(error);
    });

    it('displays footer if no error provided', () => {
      const spy = jest.spyOn(reporter, 'displayFooter');

      reporter.displayFinalOutput();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('displayFooter()', () => {
    it('displays default message', () => {
      reporter.displayFooter();

      expect(reporter.out).toHaveBeenCalledWith(expect.stringContaining('Ran in 0.00s'));
    });

    it('displays custom footer message', () => {
      reporter.options.footer = 'Powered by Boost';
      reporter.displayFooter();

      expect(reporter.out).toHaveBeenCalledWith(expect.stringContaining('Powered by Boost'));
    });
  });

  describe('flushBufferedOutput()', () => {
    it('doesnt output if no buffer', () => {
      reporter.flushBufferedOutput();

      expect(reporter.out).not.toHaveBeenCalled();
    });

    it('output if buffer is not empty', () => {
      reporter.bufferedOutput = 'foo\nbar\nbaz';
      reporter.flushBufferedOutput();

      expect(reporter.out).toHaveBeenCalledWith('foo\nbar\nbaz');
    });

    it('sets last output height', () => {
      reporter.bufferedOutput = 'foo\nbar\nbaz';
      reporter.flushBufferedOutput();

      expect(reporter.lastOutputHeight).toBe(2);
    });
  });

  describe('flushBufferedStreams()', () => {
    it('calls all buffer callbacks', () => {
      const spy1 = jest.fn();
      const spy2 = jest.fn();

      reporter.bufferedStreams.push(spy1, spy2);
      reporter.flushBufferedStreams();

      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });
  });

  describe('getElapsedTime()', () => {
    it('returns numbers in seconds', () => {
      expect(reporter.getElapsedTime(1000, 5000)).toBe('4.00s');
    });

    it('colors red if higher than slow threshold', () => {
      reporter.options.slowThreshold = 3000;

      expect(reporter.getElapsedTime(1000, 5000)).toBe(chalk.red('4.00s'));
    });

    it('doesnt color if highlight is false', () => {
      reporter.options.slowThreshold = 3000;

      expect(reporter.getElapsedTime(1000, 5000, false)).toBe('4.00s');
    });
  });

  describe('hideCursor()', () => {
    it('writes ansi escape code', () => {
      reporter.hideCursor();

      expect(reporter.out).toHaveBeenCalledWith('\x1B[?25l');
    });
  });

  describe('indent()', () => {
    it('indents based on length', () => {
      expect(reporter.indent()).toBe('');
      expect(reporter.indent(1)).toBe(' ');
      expect(reporter.indent(3)).toBe('   ');
    });
  });

  describe('log()', () => {
    it('adds to buffered output', () => {
      reporter.log('foo');
      reporter.log('bar');

      expect(reporter.bufferedOutput).toBe('foobar');
    });

    it('can control newlines', () => {
      reporter.log('foo', 1);
      reporter.log('bar', 2);

      expect(reporter.bufferedOutput).toBe('foo\nbar\n\n');
    });

    it('doesnt log if silent', () => {
      reporter.options.silent = true;
      reporter.log('foo');
      reporter.log('bar');

      expect(reporter.bufferedOutput).toBe('');
    });
  });

  describe('removeLine()', () => {
    it('removes a line', () => {
      reporter.lines.push('foo', 'bar', 'baz');
      reporter.removeLine(line => line === 'foo');

      expect(reporter.lines).toEqual(['bar', 'baz']);
    });
  });

  describe('render()', () => {
    it('logs each line', () => {
      reporter.lines.push('foo', 'bar', 'baz');
      reporter.render();

      expect(reporter.bufferedOutput).toBe('foo\nbar\nbaz\n');
    });
  });

  describe('resetCursor()', () => {
    it('writes ansi escape code', () => {
      reporter.resetCursor();

      expect(reporter.out).toHaveBeenCalledWith(expect.stringContaining('0H'));
    });
  });

  describe('showCursor()', () => {
    it('writes ansi escape code', () => {
      reporter.showCursor();

      expect(reporter.out).toHaveBeenCalledWith('\x1B[?25h');
    });
  });
});
