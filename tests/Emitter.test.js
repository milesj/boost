/* eslint-disable no-param-reassign */

import Event from '../src/Event';
import Emitter from '../src/Emitter';

describe('Emitter', () => {
  let emitter;

  beforeEach(() => {
    emitter = new Emitter();
  });

  describe('emit()', () => {
    it('errors if a non-Event object is passed', () => {
      expect(() => emitter.emit(123))
        .toThrowError('Invalid event, must be an instance of `Event`.');
    });

    it('errors if a non-array arguments is passed', () => {
      expect(() => emitter.emit(new Event('foo'), 123))
        .toThrowError('Invalid arguments for event "foo", must be an array.');
    });

    it('returns an event object', () => {
      const event = new Event('foo');

      expect(emitter.emit(event)).toBe(event);
    });

    it('executes listeners in order', () => {
      let output = '';

      emitter.on('foo', () => { output += 'A'; });
      emitter.on('foo', () => { output += 'B'; });
      emitter.on('foo', () => { output += 'C'; });
      emitter.emit(new Event('foo'));

      expect(output).toBe('ABC');
    });

    it('execution can be stopped', () => {
      let count = 0;

      emitter.on('foo', () => { count += 1; });
      emitter.on('foo', (event) => { event.stop(); });
      emitter.on('foo', () => { count += 1; });
      emitter.emit(new Event('foo'));

      expect(count).toBe(1);
    });

    it('passes event to listeners', () => {
      const baseEvent = new Event('foo');
      let event;

      emitter.on('foo', (e) => { event = e; });
      emitter.emit(baseEvent);

      expect(event).toBe(baseEvent);
    });

    it('passes arguments to listeners', () => {
      const baseArgs = [1, 2, 3];
      let args;

      emitter.on('foo', (event, ...eventArgs) => { args = eventArgs; });
      emitter.emit(new Event('foo'), baseArgs);

      expect(args).toEqual(baseArgs);
    });

    describe('cascading', () => {
      it('can pass value by returning', () => {
        /* eslint-disable no-return-assign */
        emitter.on('foo', event => (event.value += 1));
        emitter.on('foo', event => (event.value += 1));
        emitter.on('foo', event => (event.value += 1));
        /* eslint-enable no-return-assign */

        const event = emitter.emit(new Event('foo'), [], true);

        expect(event.value).toBe(3);
      });

      it('can pass value by modifying event object', () => {
        emitter.on('foo', (event) => { event.value += 1; });
        emitter.on('foo', (event) => { event.value += 1; });
        emitter.on('foo', (event) => { event.value += 1; });

        const event = emitter.emit(new Event('foo'), [], true);

        expect(event.value).toBe(3);
      });
    });
  });

  describe('emitAsync()', () => {
    it('returns an event object', () => {
      expect(emitter.emitAsync('foo')).toBeInstanceOf(Event);
    });

    it('executes listeners asyncronously', (done) => {
      let output = '';

      emitter.on('foo', () => { output += 'A'; });
      emitter.on('foo', () => { output += 'B'; });
      emitter.on('foo', () => { output += 'C'; });
      emitter.emitAsync('foo');

      expect(output).toBe('');

      setTimeout(() => {
        expect(output).toBe('ABC');
        done();
      }, 0);
    });

    it('executes listeners asyncronously with arguments', (done) => {
      const output = [];

      emitter.on('foo', (event, a, b) => { output.push(a, b * 2); });
      emitter.on('foo', (event, a, b) => { output.push(a * 3, b * 4); });
      emitter.on('foo', (event, a, b) => { output.push(a * 5, b * 6); });
      emitter.emitAsync('foo', [2, 3]);

      expect(output).toEqual([]);

      setTimeout(() => {
        expect(output).toEqual([
          2,
          6,
          6,
          12,
          10,
          18,
        ]);
        done();
      });
    });
  });

  describe('emitAsyncCascade()', () => {
    it('returns an event object', () => {
      expect(emitter.emitAsyncCascade('foo')).toBeInstanceOf(Event);
    });

    it('executes listeners asyncronously while passing values to each', (done) => {
      emitter.on('foo', event => event.value.toUpperCase());
      emitter.on('foo', event => event.value.split('').reverse().join(''));
      emitter.on('foo', event => `${event.value}-${event.value}`);

      const event = emitter.emitAsyncCascade('foo', 'foo');

      expect(event.value).toBe('foo');

      setTimeout(() => {
        expect(event.value).toBe('OOF-OOF');
        done();
      }, 0);
    });

    it('executes listeners asyncronously with arguments while passing values to each', (done) => {
      emitter.on('foo', (event, a, b, c) => { event.value.push(a.repeat(3)); });
      emitter.on('foo', (event, a, b, c) => { event.value.push(b.repeat(2)); });
      emitter.on('foo', (event, a, b, c) => { event.value.push(c.repeat(1)); });

      const event = emitter.emitAsyncCascade('foo', [], ['foo', 'bar', 'baz']);

      expect(event.value).toEqual([]);

      setTimeout(() => {
        expect(event.value).toEqual([
          'foofoofoo',
          'barbar',
          'baz',
        ]);
        done();
      }, 0);
    });
  });

  describe('emitSync()', () => {
    it('returns an event object', () => {
      expect(emitter.emitSync('foo')).toBeInstanceOf(Event);
    });

    it('executes listeners syncronously', () => {
      let output = '';

      emitter.on('foo', () => { output += 'A'; });
      emitter.on('foo', () => { output += 'B'; });
      emitter.on('foo', () => { output += 'C'; });
      emitter.emitSync('foo');

      expect(output).toBe('ABC');
    });

    it('executes listeners syncronously with arguments', () => {
      const output = [];

      emitter.on('foo', (event, a, b) => { output.push(a, b * 2); });
      emitter.on('foo', (event, a, b) => { output.push(a * 3, b * 4); });
      emitter.on('foo', (event, a, b) => { output.push(a * 5, b * 6); });
      emitter.emitSync('foo', [2, 3]);

      expect(output).toEqual([
        2,
        6,
        6,
        12,
        10,
        18,
      ]);
    });
  });

  describe('emitSyncCascade()', () => {
    it('returns an event object', () => {
      expect(emitter.emitSyncCascade('foo')).toBeInstanceOf(Event);
    });

    it('executes listeners syncronously while passing values to each', () => {
      emitter.on('foo', event => event.value.toUpperCase());
      emitter.on('foo', event => event.value.split('').reverse().join(''));
      emitter.on('foo', event => `${event.value}-${event.value}`);

      const event = emitter.emitSyncCascade('foo', 'foo');

      expect(event.value).toBe('OOF-OOF');
    });

    it('executes listeners syncronously with arguments while passing values to each', () => {
      emitter.on('foo', (event, a, b, c) => { event.value.push(a.repeat(3)); });
      emitter.on('foo', (event, a, b, c) => { event.value.push(b.repeat(2)); });
      emitter.on('foo', (event, a, b, c) => { event.value.push(c.repeat(1)); });

      const event = emitter.emitSyncCascade('foo', [], ['foo', 'bar', 'baz']);

      expect(event.value).toEqual([
        'foofoofoo',
        'barbar',
        'baz',
      ]);
    });
  });

  describe('getEventNames()', () => {
    it('returns an array of event names', () => {
      emitter.getListeners('foo');
      emitter.getListeners('bar');
      emitter.getListeners('baz');

      expect(emitter.getEventNames()).toEqual(['foo', 'bar', 'baz']);
    });
  });

  describe('getListeners()', () => {
    it('errors if name contains invalid characters', () => {
      expect(() => emitter.getListeners('foo.bar'))
        .toThrowError('Invalid event name "foo.bar". May only contain dashes and lowercase characters.');
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
