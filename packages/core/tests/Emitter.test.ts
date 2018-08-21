import Emitter from '../src/Emitter';

describe('Emitter', () => {
  let emitter: Emitter;

  beforeEach(() => {
    emitter = new Emitter();
  });

  it('toggles event namespace', () => {
    expect(emitter.namespace).toBe('');

    emitter.setEventNamespace('ns');

    expect(emitter.namespace).toBe('ns');

    emitter.removeEventNamespace();

    expect(emitter.namespace).toBe('');
  });

  describe('createEventName()', () => {
    it('returns name as-is if no namespace', () => {
      expect(emitter.createEventName('foo')).toBe('foo');
    });

    it('prepends namespace', () => {
      emitter.setEventNamespace('ns');

      expect(emitter.createEventName('foo')).toBe('ns.foo');
    });

    it('doesnt prepend namespace if already prefixed', () => {
      emitter.setEventNamespace('ns');

      expect(emitter.createEventName('ns.foo')).toBe('ns.foo');
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
      emitter.emit('foo');

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

      emitter.on('foo', () => {
        value = value.toUpperCase();
      });
      emitter.on('foo', () => {
        value = value
          .split('')
          .reverse()
          .join('');
      });
      emitter.on('foo', () => {
        value = `${value}-${value}`;
      });

      emitter.emit('foo');

      expect(value).toBe('OOF-OOF');
    });

    it('executes listeners syncronously with arguments while passing values to each', () => {
      const value: string[] = [];

      emitter.on('foo', (a, b, c) => {
        value.push(a.repeat(3));
      });
      emitter.on('foo', (a, b, c) => {
        value.push(b.repeat(2));
      });
      emitter.on('foo', (a, b, c) => {
        value.push(c.repeat(1));
      });

      emitter.emit('foo', ['foo', 'bar', 'baz']);

      expect(value).toEqual(['foofoofoo', 'barbar', 'baz']);
    });

    it('execution can be stopped', () => {
      let count = 0;

      emitter.on('foo', () => {
        count += 1;
      });
      emitter.on('foo', () => false);
      emitter.on('foo', () => {
        count += 1;
      });
      emitter.emit('foo');

      expect(count).toBe(1);
    });

    it('passes arguments to listeners', () => {
      const baseArgs = [1, 2, 3];
      let args;

      emitter.on('foo', (...eventArgs) => {
        args = eventArgs;
      });
      emitter.emit('foo', baseArgs);

      expect(args).toEqual(baseArgs);
    });

    it('passes value by modifying event object', () => {
      let value = 0;

      emitter.on('foo', () => {
        value += 1;
      });
      emitter.on('foo', () => {
        value += 1;
      });
      emitter.on('foo', () => {
        value += 1;
      });

      emitter.emit('foo');

      expect(value).toBe(3);
    });

    describe('with namespace', () => {
      beforeEach(() => {
        emitter.setEventNamespace('ns');
      });

      afterEach(() => {
        emitter.removeEventNamespace();
      });

      it('executes listeners in order', () => {
        let output = '';

        emitter.on('ns.foo', () => {
          output += 'A';
        });
        emitter.on('ns.foo', () => {
          output += 'B';
        });
        emitter.on('ns.foo', () => {
          output += 'C';
        });
        emitter.emit('foo');

        expect(output).toBe('ABC');
      });
    });
  });

  describe('getEventNames()', () => {
    it('returns an array of event names', () => {
      emitter.getListeners('foo');
      emitter.getListeners('bar');
      emitter.getListeners('baz');
      emitter.getListeners('ns.qux');

      expect(emitter.getEventNames()).toEqual(['foo', 'bar', 'baz', 'ns.qux']);
    });
  });

  describe('getListeners()', () => {
    it('errors if name contains invalid characters', () => {
      expect(() => emitter.getListeners('foo+bar')).toThrowError(
        'Invalid event name "foo+bar". May only contain dashes, periods, and lowercase characters.',
      );
    });

    it('creates the listeners set if it does not exist', () => {
      expect(emitter.listeners.foo).toBeUndefined();

      const set = emitter.getListeners('foo');

      expect(set).toBeInstanceOf(Set);
      expect(emitter.listeners.foo).toBeDefined();
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
        // @ts-ignore
        emitter.on('foo', 123);
      }).toThrowError('Invalid event listener for "foo", must be a function.');
    });

    it('adds a listener to the set', () => {
      const listener = () => {};

      expect(emitter.getListeners('foo').has(listener)).toBe(false);

      emitter.on('foo', listener);

      expect(emitter.getListeners('foo').has(listener)).toBe(true);
    });
  });
});
