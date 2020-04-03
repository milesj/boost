import LogBuffer from '../src/LogBuffer';

function sleep(delay: number = 250) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

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

    buffer.wrap();

    expect(console.info).not.toEqual(original);

    buffer.unwrap();

    expect(console.info).toEqual(original);
  });

  it('calls listener when logs are flushed', async () => {
    const spy = jest.fn();

    buffer.on(spy);
    buffer.wrap();
    buffer.write('foo');
    buffer.write('bar');
    buffer.write('baz');

    await sleep();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(['foo', 'bar', 'baz']);
    expect(buffer.logs).toEqual([]);
  });

  it('calls native stream when flushed and no listener defined', async () => {
    const spy = jest.fn();
    const logSpy = jest.spyOn(process.stdout, 'write').mockImplementation();

    buffer.on(spy);
    buffer.off(); // Test this
    buffer.wrap();

    buffer.write('foo');
    buffer.write('bar');
    buffer.write('baz');

    await sleep();

    expect(spy).toHaveBeenCalledTimes(0);
    expect(logSpy).toHaveBeenCalledTimes(3);
    expect(logSpy).toHaveBeenCalledWith('foo\n');
    expect(logSpy).toHaveBeenCalledWith('bar\n');
    expect(logSpy).toHaveBeenCalledWith('baz\n');
    expect(buffer.logs).toEqual([]);

    logSpy.mockRestore();
  });

  it('calls native stream when flushed and no listener defined (stderr)', async () => {
    buffer = new LogBuffer('stderr', process.stderr);

    const spy = jest.fn();
    const logSpy = jest.spyOn(process.stderr, 'write').mockImplementation();

    buffer.on(spy);
    buffer.off(); // Test this
    buffer.wrap();

    buffer.write('foo');
    buffer.write('bar');
    buffer.write('baz');

    await sleep();

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
});
