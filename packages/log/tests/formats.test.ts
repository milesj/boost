import * as formats from '../src/formats';
import { LogItem } from '../lib/types';

describe('formats', () => {
  const item: LogItem = {
    host: 'machine.local',
    label: 'Error',
    level: 'error',
    message: 'Hello there!',
    name: 'test',
    pid: 1,
    time: new Date(),
  };

  describe('console()', () => {
    it('includes label when not log level', () => {
      expect(formats.console(item)).toBe('Error Hello there!');
    });

    it('doesnt include label when log level', () => {
      expect(
        formats.console({
          ...item,
          level: 'log',
        }),
      ).toBe('Hello there!');
    });
  });

  describe('debug()', () => {
    it('includes all item fields', () => {
      expect(formats.debug(item)).toBe(
        `[${item.time.toISOString()}] ERROR Hello there! (name=test, host=machine.local, pid=1)`,
      );
    });
  });

  describe('json()', () => {
    it('serializes all item fields', () => {
      expect(formats.json(item)).toBe(JSON.stringify(item));
    });
  });

  describe('message()', () => {
    it('includes only the message', () => {
      expect(formats.message(item)).toBe('Hello there!');
    });
  });
});
