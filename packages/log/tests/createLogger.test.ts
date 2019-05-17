import chalk from 'chalk';
import createLogger, { LoggerOptions } from '../src/createLogger';
import { Logger } from '../src/types';

describe('createLogger()', () => {
  let logger: Logger;
  let outStream: { write: jest.Mock };
  let errStream: { write: jest.Mock };

  function mockLogger(options?: LoggerOptions) {
    return createLogger({
      stderr: errStream as any,
      stdout: outStream as any,
      ...options,
    });
  }

  beforeEach(() => {
    errStream = { write: jest.fn() };
    outStream = { write: jest.fn() };

    logger = mockLogger();
  });

  it('writes `log` level by default', () => {
    logger('Hello');

    expect(outStream.write).toHaveBeenCalledWith('Hello');
  });

  it('writes to custom default level', () => {
    logger = mockLogger({ defaultLevel: 'debug' });
    logger('Hello');

    expect(errStream.write).toHaveBeenCalledWith(`${chalk.gray('[debug]')} Hello`);
  });

  it('writes `debug` to stream', () => {
    logger.debug('Message');

    expect(errStream.write).toHaveBeenCalledWith(`${chalk.gray('[debug]')} Message`);
  });

  it('writes `error` to stream', () => {
    logger.error('Message');

    expect(errStream.write).toHaveBeenCalledWith(`${chalk.red('[error]')} Message`);
  });

  it('writes `log` to stream', () => {
    logger.log('Message');

    expect(outStream.write).toHaveBeenCalledWith('Message');
  });

  it('writes `info` to stream', () => {
    logger.info('Message');

    expect(outStream.write).toHaveBeenCalledWith(`${chalk.cyan('[info]')} Message`);
  });

  it('writes `trace` to stream', () => {
    logger.trace('Message');

    expect(outStream.write).toHaveBeenCalledWith(`${chalk.magenta('[trace]')} Message`);
  });

  it('writes `warn` to stream', () => {
    logger.warn('Message');

    expect(errStream.write).toHaveBeenCalledWith(`${chalk.yellow('[warn]')} Message`);
  });

  it('doesnt write levels below max level', () => {
    logger = mockLogger({ maxLevel: 'debug' });
    logger.log('Log');
    logger.trace('Trace');
    logger.debug('Debug');
    logger.info('Info');

    expect(outStream.write).toHaveBeenCalledWith('Log');
    expect(outStream.write).toHaveBeenCalledWith(`${chalk.magenta('[trace]')} Trace`);
    expect(outStream.write).not.toHaveBeenCalledWith(`${chalk.cyan('[info]')} Info`);
    expect(errStream.write).toHaveBeenCalledWith(`${chalk.gray('[debug]')} Debug`);
  });

  it('can interpolate values', () => {
    logger('String %s, number %d, object %j', 'foo', 123, { bar: true });

    expect(outStream.write).toHaveBeenCalledWith('String foo, number 123, object {"bar":true}');
  });

  it('can customize labels', () => {
    logger = mockLogger({
      labels: {
        debug: 'diagnose',
        error: 'fail',
        info: 'notice',
        trace: 'inspect',
        warn: 'alert',
      },
    });
    logger.debug('Debug');
    logger.error('Error');
    logger.log('Log');
    logger.info('Info');
    logger.trace('Trace');
    logger.warn('Warning');

    expect(errStream.write).toHaveBeenCalledWith(`${chalk.gray('[diagnose]')} Debug`);
    expect(errStream.write).toHaveBeenCalledWith(`${chalk.red('[fail]')} Error`);
    expect(outStream.write).toHaveBeenCalledWith('Log');
    expect(outStream.write).toHaveBeenCalledWith(`${chalk.cyan('[notice]')} Info`);
    expect(outStream.write).toHaveBeenCalledWith(`${chalk.magenta('[inspect]')} Trace`);
    expect(errStream.write).toHaveBeenCalledWith(`${chalk.yellow('[alert]')} Warning`);
  });

  it('can customize colors', () => {
    logger = mockLogger({
      colors: {
        debug: chalk.white,
        error: chalk.white,
        info: chalk.white,
        trace: chalk.white,
        warn: chalk.white,
      },
    });
    logger.debug('Debug');
    logger.error('Error');
    logger.log('Log');
    logger.info('Info');
    logger.trace('Trace');
    logger.warn('Warning');

    expect(errStream.write).toHaveBeenCalledWith(`${chalk.white('[debug]')} Debug`);
    expect(errStream.write).toHaveBeenCalledWith(`${chalk.white('[error]')} Error`);
    expect(outStream.write).toHaveBeenCalledWith('Log');
    expect(outStream.write).toHaveBeenCalledWith(`${chalk.white('[info]')} Info`);
    expect(outStream.write).toHaveBeenCalledWith(`${chalk.white('[trace]')} Trace`);
    expect(errStream.write).toHaveBeenCalledWith(`${chalk.white('[warn]')} Warning`);
  });
});
