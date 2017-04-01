import executeSequentially from '../src/executeSequentially';

describe('executeSequentially()', () => {
  it('returns initial value if no processes', () => {
    executeSequentially(123, [])
      .then((value) => {
        expect(value).toBe(123);
      });
  });

  it('passes strings down the chain in order', () => {
    executeSequentially('', ['foo', 'bar', 'baz'], (prev, next) => prev + next)
      .then((value) => {
        expect(value).toBe('foobarbaz');
      });
  });

  it('passes numbers down the chain in order', () => {
    executeSequentially(0, [1, 2, 3], (prev, next) => prev + (next * 2))
      .then((value) => {
        expect(value).toBe(12);
      });
  });

  it('passes promises down the chain in order', () => {
    executeSequentially(Promise.resolve([]), [
      value => Promise.resolve([...value, 'foo']),
      value => new Promise(resolve => resolve(['bar', ...value])),
      value => new Promise(resolve => resolve(value.concat(['baz']))),
    ], (value, func) => func(value))
      .then((value) => {
        expect(value).toEqual([
          'bar',
          'foo',
          'baz',
        ]);
      });
  });

  it('handles buffers', () => {
    executeSequentially(Buffer.alloc(9), [
      (buffer) => {
        buffer.write('foo', 0, 3);
        return buffer;
      },
      (buffer) => {
        buffer.write('bar', 3, 3);
        return buffer;
      },
      (buffer) => {
        buffer.write('baz', 6, 3);
        return buffer;
      },
    ], (buffer, func) => func(buffer))
      .then((buffer) => {
        expect(buffer.toString('utf8')).toBe('foobarbaz');
      });
  });
});
