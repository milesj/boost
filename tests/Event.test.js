import Event from '../src/Event';

describe('Event', () => {
  describe('constructor()', () => {
    it('errors if name is falsy', () => {
      expect(() => new Event('')).toThrowError('A valid event name is required.');
    });

    it('errors if name is not a string', () => {
      expect(() => new Event(123)).toThrowError('A valid event name is required.');
    });

    it('sets name, value, and time', () => {
      const event = new Event('foo', 123);

      expect(event.name).toBe('foo');
      expect(event.value).toBe(123);
    });
  });

  describe('stop()', () => {
    it('marks an event as stopped', () => {
      const event = new Event('foo');

      expect(event.stopped).toBe(false);

      event.stop();

      expect(event.stopped).toBe(true);
    });
  });
});
