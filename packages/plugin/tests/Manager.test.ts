import { copyFixtureToNodeModule } from '@boost/test-utils';
import { Renderable, Renderer, createRendererManager } from './__mocks__/Renderer';
import { Manager, DEFAULT_PRIORITY } from '../src';

describe('Manager', () => {
  let fixtures: Function[];
  let manager: Manager<Renderable>;

  beforeEach(() => {
    fixtures = [];
    manager = createRendererManager();
  });

  afterEach(() => {
    fixtures.forEach(fixture => fixture());
  });

  it('sets correct properties', () => {
    expect(manager.projectName).toBe('boost-test');
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

  describe('loadMany()', () => {
    function createClass(name: string, options?: { value: string }) {
      const renderer = new Renderer(options);

      renderer.name = name;

      return renderer;
    }

    it('loads plugins based on name', () => {
      fixtures.push(
        copyFixtureToNodeModule('plugin-renderer-object', 'boost-test-renderer-foo'),
        copyFixtureToNodeModule('plugin-renderer-object', '@boost-test/renderer-bar'),
        copyFixtureToNodeModule('plugin-renderer-object', '@test/boost-test-renderer-baz'),
      );

      manager.loadMany(
        [
          // Short names
          'foo',
          'bar',
          // Full names
          'boost-test-renderer-foo',
          '@boost-test/renderer-bar',
          // Full name with custom scope
          '@test/boost-test-renderer-baz',
        ],
        {},
      );

      // @ts-ignore Allow access
      expect(manager.plugins).toEqual([
        {
          name: 'boost-test-renderer-foo',
          plugin: expect.any(Object),
          priority: DEFAULT_PRIORITY,
        },
        {
          name: '@boost-test/renderer-bar',
          plugin: expect.any(Object),
          priority: DEFAULT_PRIORITY,
        },
        {
          name: 'boost-test-renderer-foo',
          plugin: expect.any(Object),
          priority: DEFAULT_PRIORITY,
        },
        {
          name: '@boost-test/renderer-bar',
          plugin: expect.any(Object),
          priority: DEFAULT_PRIORITY,
        },
        {
          name: '@test/boost-test-renderer-baz',
          plugin: expect.any(Object),
          priority: DEFAULT_PRIORITY,
        },
      ]);
    });

    it('loads plugins based on name with options and priority', () => {
      fixtures.push(
        copyFixtureToNodeModule('plugin-renderer-object', 'boost-test-renderer-foo'),
        copyFixtureToNodeModule('plugin-renderer-object', '@boost-test/renderer-bar'),
        copyFixtureToNodeModule('plugin-renderer-object', '@test/boost-test-renderer-baz'),
      );

      manager.loadMany(
        [
          // Short names
          ['foo', { value: 'foo' }, 3],
          // Full names
          ['@boost-test/renderer-bar', { value: 'bar' }, 2],
          // Full name with shorthand scope
          ['@test/baz', { value: 'baz' }, 1],
        ],
        {},
      );

      // @ts-ignore Allow access
      expect(manager.plugins).toEqual([
        {
          name: 'boost-test-renderer-foo',
          plugin: expect.objectContaining({
            options: { value: 'foo' },
          }),
          priority: 3,
        },
        {
          name: '@boost-test/renderer-bar',
          plugin: expect.objectContaining({
            options: { value: 'bar' },
          }),
          priority: 2,
        },
        {
          name: '@test/boost-test-renderer-baz',
          plugin: expect.objectContaining({
            options: { value: 'baz' },
          }),
          priority: 1,
        },
      ]);
    });

    it('uses objects as is', () => {
      const render = () => 'test';

      manager.loadMany(
        [
          // Basic
          { name: 'boost-test-renderer-foo', render },
          // With options
          // @ts-ignore
          { name: '@boost-test/renderer-bar', options: { value: 'bar' }, render },
          // With options and priority
          // @ts-ignore
          { name: '@test/boost-test-renderer-baz', options: { value: 'baz' }, priority: 1, render },
        ],
        {},
      );

      // @ts-ignore Allow access
      expect(manager.plugins).toEqual([
        {
          name: 'boost-test-renderer-foo',
          plugin: expect.objectContaining({ render }),
          priority: DEFAULT_PRIORITY,
        },
        {
          name: '@boost-test/renderer-bar',
          plugin: expect.objectContaining({
            options: { value: 'bar' },
            render,
          }),
          priority: DEFAULT_PRIORITY,
        },
        {
          name: '@test/boost-test-renderer-baz',
          plugin: expect.objectContaining({
            options: { value: 'baz' },
            render,
          }),
          priority: 1,
        },
      ]);
    });

    it('uses class instances as is', () => {
      // Basic
      const foo = createClass('boost-test-renderer-foo');
      // With options
      const bar = createClass('@boost-test/renderer-bar', { value: 'bar' });
      // With options and custom scope
      const baz = createClass('@test/boost-test-renderer-baz', { value: 'baz' });

      manager.loadMany([foo, bar, baz], {});

      // @ts-ignore Allow access
      expect(manager.plugins).toEqual([
        {
          name: 'boost-test-renderer-foo',
          plugin: foo,
          priority: DEFAULT_PRIORITY,
        },
        {
          name: '@boost-test/renderer-bar',
          plugin: bar,
          priority: DEFAULT_PRIORITY,
        },
        {
          name: '@test/boost-test-renderer-baz',
          plugin: baz,
          priority: 1,
        },
      ]);
    });

    it('supports all the patterns at once', () => {
      fixtures.push(
        copyFixtureToNodeModule('plugin-renderer-object', 'boost-test-renderer-foo'),
        copyFixtureToNodeModule('plugin-renderer-object', '@boost-test/renderer-bar'),
        copyFixtureToNodeModule('plugin-renderer-object', '@test/boost-test-renderer-baz'),
      );

      manager.loadMany(
        [
          'foo',
          ['@boost-test/renderer-bar', { value: 'bar' }],
          {
            name: '@test/boost-test-renderer-baz',
            priority: 1,
            render: () => 'test',
          },
          createClass('boost-test-renderer-qux', { value: 'qux' }),
        ],
        {},
      );

      const qux = new Renderer({ value: 'qux' });
      qux.name = 'boost-test-renderer-qux';

      // @ts-ignore Allow access
      expect(manager.plugins).toEqual([
        {
          name: 'boost-test-renderer-foo',
          plugin: expect.any(Object),
          priority: DEFAULT_PRIORITY,
        },
        {
          name: '@boost-test/renderer-bar',
          plugin: expect.objectContaining({
            options: { value: 'bar' },
          }),
          priority: DEFAULT_PRIORITY,
        },
        {
          name: '@test/boost-test-renderer-baz',
          plugin: expect.any(Object),
          priority: 1,
        },
        {
          name: 'boost-test-renderer-qux',
          plugin: qux,
          priority: DEFAULT_PRIORITY,
        },
      ]);
    });

    it('errors if unsupported setting passed', () => {
      expect(() => {
        manager.loadMany(
          [
            // @ts-ignore Allow invalid type
            123,
          ],
          {},
        );
      }).toThrow('Unknown plugin setting: 123');
    });

    it('errors if object is passed without a name', () => {
      expect(() => {
        manager.loadMany(
          [
            // @ts-ignore Allow invalid type
            {},
          ],
          {},
        );
      }).toThrow('Plugin object or class instance found without a `name` property.');
    });

    it('errors if class instance is passed without a name', () => {
      expect(() => {
        manager.loadMany(
          [
            // @ts-ignore Allow invalid type
            new Renderer(),
          ],
          {},
        );
      }).toThrow('Plugin object or class instance found without a `name` property.');
    });
  });

  describe('isRegistered()', () => {
    it('returns false if plugin not found', () => {
      expect(manager.isRegistered('foo')).toBe(false);
    });

    it('returns true if plugin is found', () => {
      manager.register('foo', new Renderer(), {});

      expect(manager.isRegistered('foo')).toBe(true);
    });
  });

  describe('register()', () => {
    it('errors if no name provided', () => {
      expect(() => {
        manager.register('', new Renderer(), {});
      }).toThrow('A fully qualified module name is required for renderers.');
    });

    it('errors if plugin is not an object', () => {
      expect(() => {
        manager.register(
          'foo',
          // @ts-ignore Allow invalid type
          123,
          {},
        );
      }).toThrow('Expected an object or class instance for the renderer, found number.');
    });

    it('errors if `validate` option fails', () => {
      expect(() => {
        manager.register(
          'foo',
          // @ts-ignore Allow invalid type
          {},
          {},
        );
      }).toThrow('Renderer requires a `render()` method.');
    });

    it('triggers `startup` lifecycle with tool', () => {
      const plugin = new Renderer();
      const spy = jest.spyOn(plugin, 'startup');

      manager.register('foo', plugin, {}, { tool: true });

      expect(spy).toHaveBeenCalledWith({ tool: true });
    });

    it('triggers `beforeStartup` and `afterStartup` events', () => {
      const beforeSpy = jest.fn();
      const afterSpy = jest.fn();

      manager.configure({
        beforeStartup: beforeSpy,
        afterStartup: afterSpy,
      });

      manager.register('foo', new Renderer(), {});

      expect(beforeSpy).toHaveBeenCalled();
      expect(afterSpy).toHaveBeenCalled();
    });

    it('adds plugin and its metadata to the list', () => {
      const result = { name: 'foo', plugin: new Renderer(), priority: 1 };

      manager.register('foo', result.plugin, {}, { priority: 1 });

      // @ts-ignore Allow access
      expect(manager.plugins).toEqual([result]);
    });
  });

  describe('unregister()', () => {
    beforeEach(() => {
      manager.register('foo', new Renderer(), {}, { priority: 1 });
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
