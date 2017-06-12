import Plugin from '../src/Plugin';
import { DEFAULT_PLUGIN_PRIORITY } from '../src/constants';

describe('Plugin', () => {
  describe('constructor()', () => {
    it('can set configuration', () => {
      const plugin = new Plugin({ foo: 123 });

      expect(plugin.config).toEqual({ foo: 123 });
    });

    it('defines a default priority', () => {
      const plugin = new Plugin();

      expect(plugin.priority).toBe(DEFAULT_PLUGIN_PRIORITY);
    });
  });
});
