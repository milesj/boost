import { expect } from 'chai';
import executeSequentially from '../src/executeSequentially';

describe('executeSequentially()', () => {
  it('returns initial value if no processes', () => {
    return executeSequentially(123, [])
      .then((value) => {
        expect(value).to.equal(123);
      });
  });

  it('passes strings down the chain in order', () => {
    return executeSequentially('', ['foo', 'bar', 'baz'], (prev, next) => prev + next)
      .then((value) => {
        expect(value).to.equal('foobarbaz');
      });
  });

  it('passes numbers down the chain in order', () => {
    return executeSequentially(0, [1, 2, 3], (prev, next) => prev + (next * 2))
      .then((value) => {
        expect(value).to.equal(12);
      });
  });

  it('passes promises down the chain in order', () => {
    return executeSequentially([], [
      value => Promise.resolve([...value, 'foo']),
      value => new Promise(resolve => resolve(['bar', ...value])),
      value => new Promise((resolve) => {
        setTimeout(() => {
          resolve(value.concat(['baz']));
        }, 15);
      }),
    ], (value, func) => func(value))
      .then((value) => {
        expect(value).to.deep.equal([
          'bar',
          'foo',
          'baz',
        ]);
      });
  });

  it('handles buffers', () => {
    return executeSequentially(Buffer.alloc(9), [
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
        expect(buffer.toString('utf8')).to.equal('foobarbaz');
      });
  });
});
