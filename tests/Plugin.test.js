import Plugin from '../src/Plugin';

describe('Plugin', () => {
  describe('constructor()', () => {
    it('can set options', () => {
      const plugin = new Plugin({ foo: 123 });

      expect(plugin.options).toEqual({ foo: 123 });
    });

    it('defines a default priority', () => {
      const plugin = new Plugin();

      expect(plugin.priority).toBe(100);
    });
  });
});
