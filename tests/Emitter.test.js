/* eslint-disable no-param-reassign */

import Event from '../src/Event';
import Emitter from '../src/Emitter';

describe('Emitter', () => {
  let emitter;

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
    it('returns an event object', () => {
      expect(emitter.emit('foo')).toBeInstanceOf(Event);
    });

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
      const output = [];

      emitter.on('foo', (event, a, b) => {
        output.push(a, b * 2);
      });
      emitter.on('foo', (event, a, b) => {
        output.push(a * 3, b * 4);
      });
      emitter.on('foo', (event, a, b) => {
        output.push(a * 5, b * 6);
      });
      emitter.emit('foo', [2, 3]);

      expect(output).toEqual([2, 6, 6, 12, 10, 18]);
    });

    it('executes listeners syncronously while passing values to each', () => {
      emitter.on('foo', event => {
        event.value = event.value.toUpperCase();
      });
      emitter.on('foo', event => {
        event.value = event.value
          .split('')
          .reverse()
          .join('');
      });
      emitter.on('foo', event => {
        event.value = `${event.value}-${event.value}`;
      });

      const event = emitter.emit('foo', [], 'foo');

      expect(event.value).toBe('OOF-OOF');
    });

    it('executes listeners syncronously with arguments while passing values to each', () => {
      emitter.on('foo', (event, a, b, c) => {
        event.value.push(a.repeat(3));
      });
      emitter.on('foo', (event, a, b, c) => {
        event.value.push(b.repeat(2));
      });
      emitter.on('foo', (event, a, b, c) => {
        event.value.push(c.repeat(1));
      });

      const event = emitter.emit('foo', ['foo', 'bar', 'baz'], []);

      expect(event.value).toEqual(['foofoofoo', 'barbar', 'baz']);
    });

    it('execution can be stopped', () => {
      let count = 0;

      emitter.on('foo', () => {
        count += 1;
      });
      emitter.on('foo', event => {
        event.stop();
      });
      emitter.on('foo', () => {
        count += 1;
      });
      emitter.emit('foo');

      expect(count).toBe(1);
    });

    it('passes event to listeners', () => {
      let event;

      emitter.on('foo', e => {
        event = e;
      });
      emitter.emit('foo');

      const actualEvent = new Event('foo');
      actualEvent.time = event.time;

      expect(event).toEqual(actualEvent);
    });

    it('passes arguments to listeners', () => {
      const baseArgs = [1, 2, 3];
      let args;

      emitter.on('foo', (event, ...eventArgs) => {
        args = eventArgs;
      });
      emitter.emit('foo', baseArgs);

      expect(args).toEqual(baseArgs);
    });

    it('passes value by modifying event object', () => {
      emitter.on('foo', event => {
        event.value += 1;
      });
      emitter.on('foo', event => {
        event.value += 1;
      });
      emitter.on('foo', event => {
        event.value += 1;
      });

      const event = emitter.emit('foo', [], 0);

      expect(event.value).toBe(3);
    });

    describe('with namespace', () => {
      beforeEach(() => {
        emitter.setEventNamespace('ns');
      });

      afterEach(() => {
        emitter.removeEventNamespace();
      });

      it('returns an event object', () => {
        const event = emitter.emit('foo');

        expect(event).toBeInstanceOf(Event);
        expect(event.name).toBe('ns.foo');
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

  describe('emitCascade()', () => {
    it('returns an event object', () => {
      expect(emitter.emitCascade('foo')).toBeInstanceOf(Event);
    });

    it('executes listeners in order', () => {
      let output = '';

      emitter.on('foo', event => {
        output += 'A';
        event.next();
      });
      emitter.on('foo', event => {
        output += 'B';
        event.next();
      });
      emitter.on('foo', event => {
        output += 'C';
        event.next();
      });
      emitter.emitCascade('foo');

      expect(output).toBe('ABC');
    });

    it('executes listeners asyncronously with arguments', () => {
      const output = [];

      emitter.on('foo', (event, a, b) => {
        output.push(a, b * 2);
        event.next();
      });
      emitter.on('foo', (event, a, b) => {
        output.push(a * 3, b * 4);
        event.next();
      });
      emitter.on('foo', (event, a, b) => {
        output.push(a * 5, b * 6);
        event.next();
      });
      emitter.emitCascade('foo', [2, 3]);

      expect(output).toEqual([2, 6, 6, 12, 10, 18]);
    });

    it('executes listeners asyncronously while passing values to each', () => {
      emitter.on('foo', event => {
        event.value = event.value.toUpperCase();
        event.next();
      });

      emitter.on('foo', event => {
        event.value = event.value
          .split('')
          .reverse()
          .join('');
        event.next();
      });

      emitter.on('foo', event => {
        event.value = `${event.value}-${event.value}`;
        event.next();
      });

      const event = emitter.emitCascade('foo', [], 'foo');

      expect(event.value).toBe('OOF-OOF');
    });

    it('executes listeners syncronously with arguments while passing values to each', () => {
      emitter.on('foo', (event, a, b, c) => {
        event.value.push(a.repeat(3));
        event.next();
      });
      emitter.on('foo', (event, a, b, c) => {
        event.value.push(b.repeat(2));
        event.next();
      });
      emitter.on('foo', (event, a, b, c) => {
        event.value.push(c.repeat(1));
        event.next();
      });

      const event = emitter.emitCascade('foo', ['foo', 'bar', 'baz'], []);

      expect(event.value).toEqual(['foofoofoo', 'barbar', 'baz']);
    });

    it('execution can be stopped with stop', () => {
      let count = 0;

      emitter.on('foo', event => {
        count += 1;
        event.next();
      });
      emitter.on('foo', event => {
        event.stop();
        event.next();
      });
      emitter.on('foo', event => {
        count += 1;
        event.next();
      });
      emitter.emitCascade('foo');

      expect(count).toBe(1);
    });

    it('execution can be stopped by not calling next', () => {
      let count = 0;

      emitter.on('foo', event => {
        count += 1;
        event.next();
      });
      emitter.on('foo', event => {
        count += 1;
      });
      emitter.on('foo', event => {
        count += 1;
        event.next();
      });
      emitter.emitCascade('foo');

      expect(count).toBe(2);
    });

    it('passes event to listeners', () => {
      let event;

      emitter.on('foo', e => {
        event = e;
        event.next();
      });
      emitter.emitCascade('foo');

      const actualEvent = new Event('foo');

      actualEvent.time = event.time;
      event.next = null;

      expect(event).toEqual(actualEvent);
    });

    it('passes arguments to listeners', () => {
      const baseArgs = [1, 2, 3];
      let args;

      emitter.on('foo', (event, ...eventArgs) => {
        args = eventArgs;
        event.next();
      });
      emitter.emitCascade('foo', baseArgs);

      expect(args).toEqual(baseArgs);
    });

    it('passes value by modifying event object', () => {
      emitter.on('foo', event => {
        event.value += 1;
        event.next();
      });
      emitter.on('foo', event => {
        event.value += 1;
        event.next();
      });
      emitter.on('foo', event => {
        event.value += 1;
        event.next();
      });

      const event = emitter.emitCascade('foo', [], 0);

      expect(event.value).toBe(3);
    });

    describe('with namespace', () => {
      beforeEach(() => {
        emitter.setEventNamespace('ns');
      });

      afterEach(() => {
        emitter.removeEventNamespace();
      });

      it('returns an event object', () => {
        const event = emitter.emitCascade('foo');

        expect(event).toBeInstanceOf(Event);
        expect(event.name).toBe('ns.foo');
      });

      it('executes listeners in order', () => {
        let output = '';

        emitter.on('ns.foo', event => {
          output += 'A';
          event.next();
        });
        emitter.on('ns.foo', event => {
          output += 'B';
          event.next();
        });
        emitter.on('ns.foo', event => {
          output += 'C';
          event.next();
        });
        emitter.emitCascade('foo');

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
