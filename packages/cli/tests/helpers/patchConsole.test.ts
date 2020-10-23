import chalk from 'chalk';
import debug from 'debug';
import { createLogger, Loggable, StreamTransport, formats } from '@boost/log';
import LogBuffer from '../../src/LogBuffer';
import patchConsole from '../../src/helpers/patchConsole';
import { mockStreams } from '../../src/test';

describe('patchConsole()', () => {
  let errBuffer: LogBuffer;
  let outBuffer: LogBuffer;
  let logger: Loggable;
  let unpatch: () => void;

  beforeEach(() => {
    const { stderr, stdout } = mockStreams();

    errBuffer = new LogBuffer(stderr);
    outBuffer = new LogBuffer(stdout);

    // Match Program usage
    logger = createLogger({
      name: 'cli',
      transports: [
        new StreamTransport({
          format: formats.console,
          levels: ['error', 'trace', 'warn'],
          stream: errBuffer,
        }),
        new StreamTransport({
          format: formats.console,
          levels: ['debug', 'info', 'log'],
          stream: outBuffer,
        }),
      ],
    });

    unpatch = patchConsole(logger, errBuffer);
  });

  afterEach(() => {
    unpatch();
  });

  it('wraps `console.log`', () => {
    const spy = jest.fn();

    outBuffer.on(spy);
    console.log('Hello');

    expect(spy).toHaveBeenCalledWith(expect.stringContaining(`Hello`));
  });

  it('wraps `console.info`', () => {
    const spy = jest.fn();

    outBuffer.on(spy);
    console.info('Hello');

    expect(spy).toHaveBeenCalledWith(expect.stringContaining(`${chalk.cyan('info')} Hello`));
  });

  it('wraps `console.debug`', () => {
    const spy = jest.fn();

    outBuffer.on(spy);
    console.debug('Hello');

    expect(spy).toHaveBeenCalledWith(expect.stringContaining(`${chalk.gray('debug')} Hello`));
  });

  it('wraps `console.error`', () => {
    const spy = jest.fn();

    errBuffer.on(spy);
    console.error('Hello');

    expect(spy).toHaveBeenCalledWith(expect.stringContaining(`${chalk.red('error')} Hello`));
  });

  it('wraps `console.trace`', () => {
    const spy = jest.fn();

    errBuffer.on(spy);
    console.trace('Hello');

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining(`${chalk.magenta('trace')} Trace: Hello`),
    );
  });

  it('wraps `console.warn`', () => {
    const spy = jest.fn();

    errBuffer.on(spy);
    console.warn('Hello');

    expect(spy).toHaveBeenCalledWith(expect.stringContaining(`${chalk.yellow('warn')} Hello`));
  });

  it('wraps `console.assert`', () => {
    const spy = jest.fn();

    errBuffer.on(spy);
    console.assert(true, 'does nothing');
    console.assert(false, 'does something');

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining(`${chalk.red('error')} Assertion failed: does something`),
    );
  });

  it('wraps `console.count`', () => {
    const spy = jest.fn();

    outBuffer.on(spy);
    console.count('foo');

    expect(spy).toHaveBeenCalledWith(expect.stringContaining(`foo: 1`));
  });

  it('wraps `console.dir`', () => {
    const spy = jest.fn();

    outBuffer.on(spy);
    console.dir({ foo: 'bar' });

    expect(spy).toHaveBeenCalledWith(expect.stringContaining(`{ foo: 'bar' }`));
  });

  it('wraps `console.dirxml`', () => {
    const spy = jest.fn();

    outBuffer.on(spy);
    console.dirxml({ foo: 'bar' });

    expect(spy).toHaveBeenCalledWith(expect.stringContaining(`{ foo: 'bar' }`));
  });

  it('wraps `console.time` and `console.timeLog`', () => {
    const spy = jest.fn();

    outBuffer.on(spy);
    console.time('foo');
    console.timeLog('foo');

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('foo: 0.'));
  });

  it('wraps `console.time` and `console.timeEnd`', () => {
    const spy = jest.fn();

    outBuffer.on(spy);
    console.time('foo');
    console.timeEnd('foo');

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('foo: 0.'));
  });

  it('wraps `debug`', () => {
    unpatch();

    // We need to set env var before hand
    process.env.DEBUG = '*';

    const inst = debug('boostcli:test');

    unpatch = patchConsole(logger, errBuffer);

    const spy = jest.fn();

    errBuffer.on(spy);

    debug.enable('boostcli:*');
    inst('Debugging');

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('boostcli:test Debugging'));
  });
});
