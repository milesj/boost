import { Renderable, Renderer, createRendererManager } from './__mocks__/Renderer';
import { Manager } from '../src';

describe('Manager', () => {
  let manager: Manager<Renderable>;

  beforeEach(() => {
    manager = createRendererManager();
  });

  it('sets correct properties', () => {
    expect(manager.toolName).toBe('boost-test');
    expect(manager.singularName).toBe('renderer');
    expect(manager.pluralName).toBe('renderers');
  });

  describe('formatModuleName()', () => {
    it('allows a custom name', () => {
      expect(manager.formatModuleName('bar')).toBe('boost-test-renderer-bar');
    });

    it('lowercases plugin name', () => {
      expect(manager.formatModuleName('BAR')).toBe('boost-test-renderer-bar');
    });

    it('supports dashes', () => {
      expect(manager.formatModuleName('bar-baz')).toBe('boost-test-renderer-bar-baz');
    });

    it('supports scoped', () => {
      expect(manager.formatModuleName('bar', true)).toBe('@boost-test/renderer-bar');
    });
  });

  describe('isRegistered()', () => {
    it('returns false if plugin not found', () => {
      expect(manager.isRegistered('foo')).toBe(false);
    });

    it('returns true if plugin is found', () => {
      manager.register({ name: 'foo', plugin: new Renderer(), priority: 1 }, {});

      expect(manager.isRegistered('foo')).toBe(true);
    });
  });

  describe('register()', () => {
    it('errors if no name provided', () => {
      expect(() => {
        manager.register({ name: '', plugin: new Renderer(), priority: 1 }, {});
      }).toThrow('A fully qualified module name is required for renderers.');
    });

    it('errors if plugin is not an object', () => {
      expect(() => {
        manager.register(
          {
            name: 'foo',
            // @ts-ignore Allow invalid type
            plugin: 123,
            priority: 1,
          },
          {},
        );
      }).toThrow('Expected an object or class instance for the renderer, found number.');
    });

    it('errors if `validate` option fails', () => {
      expect(() => {
        manager.register(
          {
            name: 'foo',
            // @ts-ignore Allow invalid type
            plugin: {},
            priority: 1,
          },
          {},
        );
      }).toThrow('Renderer requires a `render()` method.');
    });

    it('triggers `startup` lifecycle with tool', () => {
      const plugin = new Renderer();
      const spy = jest.spyOn(plugin, 'startup');

      manager.register({ name: 'foo', plugin, priority: 1 }, { tool: true });

      expect(spy).toHaveBeenCalledWith({ tool: true });
    });

    it('triggers `beforeStartup` and `afterStartup` events', () => {
      const beforeSpy = jest.fn();
      const afterSpy = jest.fn();

      manager.configure({
        beforeStartup: beforeSpy,
        afterStartup: afterSpy,
      });

      manager.register({ name: 'foo', plugin: new Renderer(), priority: 1 }, {});

      expect(beforeSpy).toHaveBeenCalled();
      expect(afterSpy).toHaveBeenCalled();
    });

    it('adds plugin and its metadata to the list', () => {
      const result = { name: 'foo', plugin: new Renderer(), priority: 1 };

      manager.register(result, {});

      // @ts-ignore Allow access
      expect(manager.plugins).toEqual([result]);
    });
  });

  describe('unregister()', () => {
    beforeEach(() => {
      manager.register({ name: 'foo', plugin: new Renderer(), priority: 1 }, {});
    });

    it('errors if name not found', () => {
      expect(() => {
        manager.unregister('unknown', {});
      }).toThrow('Failed to find renderer "unknown". Have you installed it?');
    });

    it('triggers `shutdown` lifecycle with tool', () => {
      const spy = jest.spyOn(manager.get('foo'), 'shutdown');

      manager.unregister('foo', { tool: true });

      expect(spy).toHaveBeenCalledWith({ tool: true });
    });

    it('triggers `beforeShutdown` and `afterShutdown` events', () => {
      const beforeSpy = jest.fn();
      const afterSpy = jest.fn();

      manager.configure({
        beforeShutdown: beforeSpy,
        afterShutdown: afterSpy,
      });

      manager.unregister('foo', {});

      expect(beforeSpy).toHaveBeenCalled();
      expect(afterSpy).toHaveBeenCalled();
    });

    it('removes a plugin by name', () => {
      manager.unregister('foo', {});

      // @ts-ignore Allow access
      expect(manager.plugins).toEqual([]);
    });
  });
});
