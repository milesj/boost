import LogBuffer from '../src/LogBuffer';

function sleep(delay: number = 250) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

describe('LogBuffer', () => {
  let buffer: LogBuffer;

  beforeEach(() => {
    buffer = new LogBuffer('stdout');
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
    buffer.write('foo');
    buffer.write('bar');
    buffer.write('baz');

    await sleep();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(['foo', 'bar', 'baz']);
    expect(buffer.logs).toEqual([]);
  });

  it('calls native `console.log` when flushed and no listener defined', async () => {
    const spy = jest.fn();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    buffer.on(spy);
    buffer.off(); // Test this

    buffer.write('foo');
    buffer.write('bar');
    buffer.write('baz');

    await sleep();

    expect(spy).toHaveBeenCalledTimes(0);
    expect(logSpy).toHaveBeenCalledTimes(3);
    expect(logSpy).toHaveBeenCalledWith('foo');
    expect(logSpy).toHaveBeenCalledWith('bar');
    expect(logSpy).toHaveBeenCalledWith('baz');
    expect(buffer.logs).toEqual([]);

    logSpy.mockRestore();
  });

  it('calls native `console.error` when flushed and no listener defined (stderr)', async () => {
    buffer = new LogBuffer('stderr');

    const spy = jest.fn();
    const logSpy = jest.spyOn(console, 'error').mockImplementation();

    buffer.on(spy);
    buffer.off(); // Test this

    buffer.write('foo');
    buffer.write('bar');
    buffer.write('baz');

    await sleep();

    expect(spy).toHaveBeenCalledTimes(0);
    expect(logSpy).toHaveBeenCalledTimes(3);
    expect(logSpy).toHaveBeenCalledWith('foo');
    expect(logSpy).toHaveBeenCalledWith('bar');
    expect(logSpy).toHaveBeenCalledWith('baz');
    expect(buffer.logs).toEqual([]);

    logSpy.mockRestore();
  });

  it('flushes when being unwrapped', () => {
    const spy = jest.spyOn(buffer, 'flush');

    buffer.unwrap();

    expect(spy).toHaveBeenCalled();
  });
});
