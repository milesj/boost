import Emitter from '../src/Emitter';
import { BaseListener, Listener, ParallelListener, WaterfallListener } from '../src/types';

describe('Emitter', () => {
  let emitter: Emitter<{
    foo: Listener<number, number>;
    bar: Listener<string, string, string>;
    baz: Listener;
    qux: BaseListener<number>;
    'ns.one': Listener<boolean>;
    'ns.two': Listener;
    parallel: ParallelListener<number>;
    waterfall: WaterfallListener<string>;
    'waterfall.array': WaterfallListener<string[]>;
    'waterfall.object': WaterfallListener<{ [key: string]: string }>;
  }>;

  beforeEach(() => {
    emitter = new Emitter();
  });

  it('passes arguments to listeners', () => {
    const baseArgs: [number, number] = [1, 2];
    let args;

    emitter.on('foo', (...eventArgs: any[]) => {
      args = eventArgs;
    });

    emitter.emit('foo', baseArgs);

    expect(args).toEqual(baseArgs);
  });

  describe('clearListeners()', () => {
    it('deletes all listeners', () => {
      emitter.on('foo', () => {});
      emitter.on('foo', () => {});

      expect(emitter.getListeners('foo').size).toBe(2);

      emitter.clearListeners('foo');

      expect(emitter.getListeners('foo').size).toBe(0);
    });
  });

  describe('emit()', () => {
    it('executes listeners in order', () => {
      let output = '';

      emitter.on('foo', () => {
        output += 'A';
      });
      emitter.on('foo', () => {
        output += 'B';
      });
      emitter.on('foo', () => {
        output += 'C';
      });
      emitter.emit('foo', [0, 0]);

      expect(output).toBe('ABC');
    });

    it('executes listeners synchronously with arguments', () => {
      const output: number[] = [];

      emitter.on('foo', (a: number, b: number) => {
        output.push(a, b * 2);
      });
      emitter.on('foo', (a: number, b: number) => {
        output.push(a * 3, b * 4);
      });
      emitter.on('foo', (a: number, b: number) => {
        output.push(a * 5, b * 6);
      });
      emitter.emit('foo', [2, 3]);

      expect(output).toEqual([2, 6, 6, 12, 10, 18]);
    });

    it('executes listeners synchronously while passing values to each', () => {
      let value = 'foo';

      emitter.on('baz', () => {
        value = value.toUpperCase();
      });
      emitter.on('baz', () => {
        value = value
          .split('')
          .reverse()
          .join('');
      });
      emitter.on('baz', () => {
        value = `${value}-${value}`;
      });

      emitter.emit('baz', []);

      expect(value).toBe('OOF-OOF');
    });

    it('executes listeners synchronously with arguments while passing values to each', () => {
      const value: string[] = [];

      emitter.on('bar', (a: string) => {
        value.push(a.repeat(3));
      });
      emitter.on('bar', (a: string, b: string) => {
        value.push(b.repeat(2));
      });
      emitter.on('bar', (a: string, b: string, c: string) => {
        value.push(c.repeat(1));
      });

      emitter.emit('bar', ['foo', 'bar', 'baz']);

      expect(value).toEqual(['foofoofoo', 'barbar', 'baz']);
    });

    it('execution can be not be stopped (bailed)', () => {
      let count = 0;

      emitter.on('baz', () => {
        count += 1;
      });
      emitter.on('baz', () => false);
      emitter.on('baz', () => {
        count += 1;
      });
      emitter.on('baz', () => {
        count += 1;
      });

      emitter.emit('baz', []);

      expect(count).toBe(3);
    });
  });

  describe('emitBail()', () => {
    it('executes listeners in order', () => {
      let output = '';

      emitter.on('foo', () => {
        output += 'A';
      });
      emitter.on('foo', () => {
        output += 'B';
      });
      emitter.on('foo', () => {
        output += 'C';
      });

      emitter.emitBail('foo', [0, 0]);

      expect(output).toBe('ABC');
    });

    it('executes listeners synchronously with arguments', () => {
      const output: number[] = [];

      emitter.on('foo', (a: number, b: number) => {
        output.push(a, b * 2);
      });
      emitter.on('foo', (a: number, b: number) => {
        output.push(a * 3, b * 4);
      });
      emitter.on('foo', (a: number, b: number) => {
        output.push(a * 5, b * 6);
      });

      emitter.emitBail('foo', [2, 3]);

      expect(output).toEqual([2, 6, 6, 12, 10, 18]);
    });

    it('executes listeners synchronously while passing values to each', () => {
      let value = 'foo';

      emitter.on('baz', () => {
        value = value.toUpperCase();
      });
      emitter.on('baz', () => {
        value = value
          .split('')
          .reverse()
          .join('');
      });
      emitter.on('baz', () => {
        value = `${value}-${value}`;
      });

      emitter.emitBail('baz', []);

      expect(value).toBe('OOF-OOF');
    });

    it('executes listeners synchronously with arguments while passing values to each', () => {
      const value: string[] = [];

      emitter.on('bar', (a: string) => {
        value.push(a.repeat(3));
      });
      emitter.on('bar', (a: string, b: string) => {
        value.push(b.repeat(2));
      });
      emitter.on('bar', (a: string, b: string, c: string) => {
        value.push(c.repeat(1));
      });

      emitter.emitBail('bar', ['foo', 'bar', 'baz']);

      expect(value).toEqual(['foofoofoo', 'barbar', 'baz']);
    });

    it('execution can be stopped', () => {
      let count = 0;

      emitter.on('baz', () => {
        count += 1;
      });
      emitter.on('baz', () => false);
      emitter.on('baz', () => {
        count += 1;
      });
      emitter.on('baz', () => {
        count += 1;
      });

      emitter.emitBail('baz', []);

      expect(count).toBe(1);
    });
  });

  describe('emitParallel()', () => {
    beforeEach(() => {
      jest.useRealTimers();
    });

    afterEach(() => {
      jest.useFakeTimers();
    });

    it('returns a promise', () => {
      expect(emitter.emitParallel('parallel', [0])).toBeInstanceOf(Promise);
    });

    it('executes listeners asynchronously with arguments', async () => {
      const output: number[] = [];

      function getRandom() {
        return Math.round(Math.random() * (500 - 0) + 0);
      }

      emitter.on(
        'parallel',
        (value: number) =>
          new Promise<number>(resolve => {
            setTimeout(() => {
              resolve(value * 2);
            }, getRandom());
          }),
      );
      emitter.on(
        'parallel',
        (value: number) =>
          new Promise<number>(resolve => {
            setTimeout(() => {
              resolve(value * 3);
            }, getRandom());
          }),
      );
      emitter.on(
        'parallel',
        (value: number) =>
          new Promise<number>(resolve => {
            setTimeout(() => {
              resolve(value * 4);
            }, getRandom());
          }),
      );

      await emitter.emitParallel('parallel', [1]);

      expect(output).not.toEqual([2, 3, 4]);
    });
  });

  describe('emitWaterfall()', () => {
    it('executes listeners in order with the value being passed to each function', () => {
      emitter.on('waterfall', (value: string) => `${value}B`);
      emitter.on('waterfall', (value: string) => `${value}C`);
      emitter.on('waterfall', (value: string) => `${value}D`);

      const output = emitter.emitWaterfall('waterfall', 'A');

      expect(output).toBe('ABCD');
    });

    it('supports arrays', () => {
      emitter.on('waterfall.array', (value: string[]) => [...value, 'B']);
      emitter.on('waterfall.array', (value: string[]) => [...value, 'C']);
      emitter.on('waterfall.array', (value: string[]) => [...value, 'D']);

      const output = emitter.emitWaterfall('waterfall.array', ['A']);

      expect(output).toEqual(['A', 'B', 'C', 'D']);
    });

    it('supports objects', () => {
      emitter.on('waterfall.object', (value: { [key: string]: string }) => ({ ...value, B: 'B' }));
      emitter.on('waterfall.object', (value: { [key: string]: string }) => ({ ...value, C: 'C' }));
      emitter.on('waterfall.object', (value: { [key: string]: string }) => ({ ...value, D: 'D' }));

      const output = emitter.emitWaterfall('waterfall.object', { A: 'A' });

      expect(output).toEqual({
        A: 'A',
        B: 'B',
        C: 'C',
        D: 'D',
      });
    });
  });

  describe('getEventNames()', () => {
    it('returns an array of event names', () => {
      emitter.getListeners('foo');
      emitter.getListeners('bar');
      emitter.getListeners('baz');
      emitter.getListeners('ns.two');

      expect(emitter.getEventNames()).toEqual(['foo', 'bar', 'baz', 'ns.two']);
    });
  });

  describe('getListeners()', () => {
    it('errors if name contains invalid characters', () => {
      expect(() => {
        // @ts-ignore Allow invalid name
        emitter.getListeners('foo+bar');
      }).toThrowErrorMatchingSnapshot();
    });

    it('creates the listeners set if it does not exist', () => {
      expect(emitter.listeners.foo).toBeUndefined();

      const set = emitter.getListeners('foo');

      expect(set).toBeInstanceOf(Set);
      expect(emitter.listeners.foo).toBeUndefined();
    });
  });

  describe('off()', () => {
    it('removes a listener from the set', () => {
      const listener = () => {};

      emitter.on('foo', listener);

      expect(emitter.getListeners('foo').has(listener)).toBe(true);

      emitter.off('foo', listener);

      expect(emitter.getListeners('foo').has(listener)).toBe(false);
    });
  });

  describe('on()', () => {
    it('errors if listener is not a function', () => {
      expect(() => {
        // @ts-ignore Allow invalid type
        emitter.on('foo', 123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('adds a listener to the set', () => {
      const listener = () => {};

      expect(emitter.getListeners('foo').has(listener)).toBe(false);

      emitter.on('foo', listener);

      expect(emitter.getListeners('foo').has(listener)).toBe(true);
    });
  });

  describe('once()', () => {
    it('errors if listener is not a function', () => {
      expect(() => {
        // @ts-ignore Allow invalid type
        emitter.once('foo', 123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('adds a listener to the set', () => {
      const listener = () => {};

      expect(emitter.getListeners('foo').has(listener)).toBe(false);
      expect(emitter.getListeners('foo').size).toBe(0);

      emitter.once('foo', listener);

      // Gets wrapped
      expect(emitter.getListeners('foo').has(listener)).toBe(false);
      expect(emitter.getListeners('foo').size).toBe(1);
    });

    it('only executes once and removes the listener', () => {
      let count = 0;

      const listener = () => {
        count += 1;
      };

      emitter.once('baz', listener);

      expect(emitter.getListeners('baz').size).toBe(1);

      emitter.emit('baz', []);
      emitter.emit('baz', []);
      emitter.emit('baz', []);

      expect(count).toBe(1);
      expect(emitter.getListeners('baz').size).toBe(0);
    });
  });
});
