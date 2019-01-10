import { string, number } from 'optimal';
import Plugin from '../src/Plugin';

describe('Plugin', () => {
  class TestPlugin extends Plugin {
    blueprint() {
      return {
        foo: string().empty(),
        bar: number(),
      };
    }
  }

  describe('constructor()', () => {
    it('can set options', () => {
      const plugin = new TestPlugin({ bar: 123 });

      expect(plugin.options).toEqual({ foo: '', bar: 123 });
    });

    it('defines a default priority', () => {
      const plugin = new TestPlugin();

      expect(plugin.priority).toBe(100);
    });
  });
});
