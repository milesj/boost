import { mockLogger } from '@boost/log/test';
import LogBuffer from '../src/LogBuffer';

describe('LogBuffer', () => {
  let buffer: LogBuffer;

  beforeEach(() => {
    buffer = new LogBuffer('stdout', process.stdout);
  });

  afterEach(() => {
    buffer.unwrap();
  });

  it('can wrap and unwrap console methods', () => {
    const original = console.info;

    buffer.wrap(mockLogger());

    expect(console.info).not.toEqual(original);

    buffer.unwrap();

    expect(console.info).toEqual(original);
  });

  it('can set and unset a listener', () => {
    const spy = jest.fn();

    buffer.on(spy);

    // @ts-expect-error
    expect(buffer.listener).toBe(spy);

    buffer.off();

    // @ts-expect-error
    expect(buffer.listener).not.toBe(spy);
  });

  it('calls listener when logs are flushed', () => {
    const spy = jest.fn();
    const logSpy = jest.spyOn(process.stdout, 'write').mockImplementation();

    buffer.on(spy);
    buffer.wrap(mockLogger());
    buffer.write('foo');
    buffer.write('bar');
    buffer.write('baz');
    buffer.unwrap();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(['foo\n', 'bar\n', 'baz\n']);
    expect(buffer.logs).toEqual([]);

    logSpy.mockRestore();
  });

  it('writes to native stream when flushed', () => {
    const spy = jest.fn();
    const logSpy = jest.spyOn(process.stdout, 'write').mockImplementation();

    buffer.wrap(mockLogger());
    buffer.write('foo');
    buffer.write('bar');
    buffer.write('baz');
    buffer.unwrap();

    expect(spy).toHaveBeenCalledTimes(0);
    expect(logSpy).toHaveBeenCalledTimes(3);
    expect(logSpy).toHaveBeenCalledWith('foo\n');
    expect(logSpy).toHaveBeenCalledWith('bar\n');
    expect(logSpy).toHaveBeenCalledWith('baz\n');
    expect(buffer.logs).toEqual([]);

    logSpy.mockRestore();
  });

  it('writes to native stream when flushed (stderr)', () => {
    buffer = new LogBuffer('stderr', process.stderr);

    const spy = jest.fn();
    const logSpy = jest.spyOn(process.stderr, 'write').mockImplementation();

    buffer.wrap(mockLogger());
    buffer.write('foo');
    buffer.write('bar');
    buffer.write('baz');
    buffer.unwrap();

    expect(spy).toHaveBeenCalledTimes(0);
    expect(logSpy).toHaveBeenCalledTimes(3);
    expect(logSpy).toHaveBeenCalledWith('foo\n');
    expect(logSpy).toHaveBeenCalledWith('bar\n');
    expect(logSpy).toHaveBeenCalledWith('baz\n');
    expect(buffer.logs).toEqual([]);

    logSpy.mockRestore();
  });

  it('flushes when being unwrapped', () => {
    const spy = jest.spyOn(buffer, 'flush');

    buffer.unwrap();

    expect(spy).toHaveBeenCalled();
  });

  it('writes to stream immediately if not wrapped', () => {
    const spy = jest.spyOn(process.stdout, 'write').mockImplementation();

    buffer.write('Yup');

    expect(spy).toHaveBeenCalledWith('Yup\n');

    spy.mockRestore();
  });

  it('logs a message if wrapped', () => {
    const spy = jest.spyOn(process.stdout, 'write').mockImplementation();

    buffer.wrap(mockLogger());
    buffer.write('Yup\n');

    expect(buffer.logs).toEqual(['Yup\n']);

    buffer.unwrap();
    spy.mockRestore();
  });
});
