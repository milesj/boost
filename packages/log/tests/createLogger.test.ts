import { env } from '@boost/internal';
import createLogger from '../src/createLogger';
import { DEFAULT_LABELS } from '../src/constants';
import * as formats from '../src/formats';
import StreamTransport from '../src/StreamTransport';
import { LoggerFunction, LoggerOptions } from '../src/types';

describe('createLogger()', () => {
  let logger: LoggerFunction;
  let outStream: { write: jest.Mock };
  let errStream: { write: jest.Mock };

  function mockLogger(options?: Partial<LoggerOptions>) {
    return createLogger({
      name: 'test',
      transports: [
        new StreamTransport({
          format: formats.console,
          levels: ['debug', 'warn', 'error'],
          stream: errStream,
        }),
        new StreamTransport({
          format: formats.console,
          levels: ['log', 'trace', 'info'],
          stream: outStream,
        }),
      ],
      ...options,
    });
  }

  beforeEach(() => {
    errStream = { write: jest.fn() };
    outStream = { write: jest.fn() };

    logger = mockLogger();
  });

  afterEach(() => {
    env('LOG_DEFAULT_LEVEL', null);
    env('LOG_MAX_LEVEL', null);
  });

  it('hooks up to console by default', () => {
    logger = createLogger({ name: 'test' });

    const outSpy = jest.spyOn(console, 'log').mockImplementation(() => true);
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => true);

    logger('Hello');
    logger.error('Oops');

    expect(outSpy).toHaveBeenCalledWith('Hello');
    expect(errSpy).toHaveBeenCalledWith(`${DEFAULT_LABELS.error} Oops`);

    outSpy.mockRestore();
    errSpy.mockRestore();
  });

  it('writes `log` level by default', () => {
    logger('Hello');

    expect(outStream.write).toHaveBeenCalledWith('Hello\n');
  });

  it('writes to custom default level', () => {
    env('LOG_DEFAULT_LEVEL', 'trace');

    logger('Hello');

    expect(outStream.write).toHaveBeenCalledWith(`${DEFAULT_LABELS.trace} Hello\n`);
  });

  it('writes `debug` to stream', () => {
    logger.debug('Message');

    expect(errStream.write).toHaveBeenCalledWith(`${DEFAULT_LABELS.debug} Message\n`);
  });

  it('writes `error` to stream', () => {
    logger.error('Message');

    expect(errStream.write).toHaveBeenCalledWith(`${DEFAULT_LABELS.error} Message\n`);
  });

  it('writes `log` to stream', () => {
    logger.log('Message');

    expect(outStream.write).toHaveBeenCalledWith('Message\n');
  });

  it('writes `info` to stream', () => {
    logger.info('Message');

    expect(outStream.write).toHaveBeenCalledWith(`${DEFAULT_LABELS.info} Message\n`);
  });

  it('writes `trace` to stream', () => {
    logger.trace('Message');

    expect(outStream.write).toHaveBeenCalledWith(`${DEFAULT_LABELS.trace} Message\n`);
  });

  it('writes `warn` to stream', () => {
    logger.warn('Message');

    expect(errStream.write).toHaveBeenCalledWith(`${DEFAULT_LABELS.warn} Message\n`);
  });

  it('doesnt write levels below max level', () => {
    env('LOG_MAX_LEVEL', 'debug');

    logger.log('Log');
    logger.trace('Trace');
    logger.debug('Debug');
    logger.info('Info');

    expect(outStream.write).toHaveBeenCalledWith('Log\n');
    expect(outStream.write).toHaveBeenCalledWith(`${DEFAULT_LABELS.trace} Trace\n`);
    expect(outStream.write).not.toHaveBeenCalledWith(`${DEFAULT_LABELS.info} Info\n`);
    expect(errStream.write).toHaveBeenCalledWith(`${DEFAULT_LABELS.debug} Debug\n`);
  });

  it('can interpolate values', () => {
    logger('String %s, number %d, object %j', 'foo', 123, { bar: true });

    expect(outStream.write).toHaveBeenCalledWith('String foo, number 123, object {"bar":true}\n');
  });

  it('can customize labels', () => {
    logger = mockLogger({
      labels: {
        debug: '[diagnose]',
        error: '[fail]',
        info: '[notice]',
        trace: '[inspect]',
        warn: '[alert]',
      },
    });
    logger.debug('Debug');
    logger.error('Error');
    logger.log('Log');
    logger.info('Info');
    logger.trace('Trace');
    logger.warn('Warning');

    expect(errStream.write).toHaveBeenCalledWith('[diagnose] Debug\n');
    expect(errStream.write).toHaveBeenCalledWith('[fail] Error\n');
    expect(outStream.write).toHaveBeenCalledWith('Log\n');
    expect(outStream.write).toHaveBeenCalledWith('[notice] Info\n');
    expect(outStream.write).toHaveBeenCalledWith('[inspect] Trace\n');
    expect(errStream.write).toHaveBeenCalledWith('[alert] Warning\n');
  });

  it('can silence output', () => {
    logger = mockLogger();
    logger.debug('Debug');
    logger.error('Error');
    logger.log('Log');
    logger.info('Info');
    logger.trace('Trace');
    logger.warn('Warning');

    expect(errStream.write).toHaveBeenCalledTimes(3);
    expect(outStream.write).toHaveBeenCalledTimes(3);

    logger.disable();
    logger.debug('Debug');
    logger.error('Error');
    logger.log('Log');
    logger.info('Info');
    logger.trace('Trace');
    logger.warn('Warning');

    expect(errStream.write).toHaveBeenCalledTimes(3);
    expect(outStream.write).toHaveBeenCalledTimes(3);

    logger.enable();
    logger.debug('Debug');
    logger.error('Error');
    logger.log('Log');
    logger.info('Info');
    logger.trace('Trace');
    logger.warn('Warning');

    expect(errStream.write).toHaveBeenCalledTimes(6);
    expect(outStream.write).toHaveBeenCalledTimes(6);
  });
});
