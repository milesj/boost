import Emitter from '../src/Emitter';

describe('Emitter', () => {
  let emitter: Emitter<{
    foo: [number, number, number?];
    bar: [string, string, string];
    baz: [];
    qux: () => number;
    'ns.one': [boolean];
    'ns.two': [];
  }>;

  beforeEach(() => {
    emitter = new Emitter();
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

    it('executes listeners syncronously with arguments', () => {
      const output: number[] = [];

      emitter.on('foo', (a, b) => {
        output.push(a, b * 2);
      });
      emitter.on('foo', (a, b) => {
        output.push(a * 3, b * 4);
      });
      emitter.on('foo', (a, b) => {
        output.push(a * 5, b * 6);
      });
      emitter.emit('foo', [2, 3]);

      expect(output).toEqual([2, 6, 6, 12, 10, 18]);
    });

    it('executes listeners syncronously while passing values to each', () => {
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

    it('executes listeners syncronously with arguments while passing values to each', () => {
      const value: string[] = [];

      emitter.on('bar', a => {
        value.push(a.repeat(3));
      });
      emitter.on('bar', (a, b) => {
        value.push(b.repeat(2));
      });
      emitter.on('bar', (a, b, c) => {
        value.push(c.repeat(1));
      });

      emitter.emit('bar', ['foo', 'bar', 'baz']);

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
      emitter.emit('baz', []);

      expect(count).toBe(1);
    });

    it('passes arguments to listeners', () => {
      const baseArgs: [number, number, number] = [1, 2, 3];
      let args;

      emitter.on('foo', (...eventArgs) => {
        args = eventArgs;
      });
      emitter.emit('foo', baseArgs);

      expect(args).toEqual(baseArgs);
    });

    it('passes value by modifying event object', () => {
      let value = 0;

      emitter.on('baz', () => {
        value += 1;
      });
      emitter.on('baz', () => {
        value += 1;
      });
      emitter.on('baz', () => {
        value += 1;
      });

      emitter.emit('baz', []);

      expect(value).toBe(3);
    });

    describe('with namespace', () => {
      it('executes listeners in order', () => {
        let output = '';

        emitter.on('ns.one', () => {
          output += 'A';
        });
        emitter.on('ns.one', () => {
          output += 'B';
        });
        emitter.on('ns.one', () => {
          output += 'C';
        });
        emitter.emit('ns.one', [true]);

        expect(output).toBe('ABC');
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
      expect(emitter.listeners.has('foo')).toBe(false);

      const set = emitter.getListeners('foo');

      expect(set).toBeInstanceOf(Set);
      expect(emitter.listeners.has('foo')).toBe(true);
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
