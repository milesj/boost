import { copyFixtureToNodeModule } from '@boost/test-utils';
import { Renderable, Renderer, createRendererRegistry } from './__mocks__/Renderer';
import { Registry, DEFAULT_PRIORITY } from '../src';

describe('Registry', () => {
  const tool = { name: 'Tool', tool: true };
  let fixtures: Function[];
  let registry: Registry<Renderable, typeof tool>;

  beforeEach(() => {
    fixtures = [];
    registry = createRendererRegistry();
  });

  afterEach(() => {
    fixtures.forEach(fixture => fixture());
  });

  it('sets correct properties', () => {
    expect(registry.projectName).toBe('boost-test');
    expect(registry.singularName).toBe('renderer');
    expect(registry.pluralName).toBe('renderers');
  });

  describe('formatModuleName()', () => {
    it('allows a custom name', () => {
      expect(registry.formatModuleName('bar')).toBe('boost-test-renderer-bar');
    });

    it('lowercases plugin name', () => {
      expect(registry.formatModuleName('BAR')).toBe('boost-test-renderer-bar');
    });

    it('supports dashes', () => {
      expect(registry.formatModuleName('bar-baz')).toBe('boost-test-renderer-bar-baz');
    });

    it('supports scoped', () => {
      expect(registry.formatModuleName('bar', true)).toBe('@boost-test/renderer-bar');
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

      registry.loadMany(
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
        tool,
      );

      // @ts-ignore Allow access
      expect(registry.plugins).toEqual([
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

      registry.loadMany(
        [
          // Short names
          ['foo', { value: 'foo' }, { priority: 3 }],
          // Full names
          ['@boost-test/renderer-bar', { value: 'bar' }, { priority: 2 }],
          // Full name with shorthand scope
          ['@test/baz', { value: 'baz' }, { priority: 1 }],
        ],
        tool,
      );

      // @ts-ignore Allow access
      expect(registry.plugins).toEqual([
        {
          name: '@test/boost-test-renderer-baz',
          plugin: expect.objectContaining({
            options: { value: 'baz' },
          }),
          priority: 1,
        },
        {
          name: '@boost-test/renderer-bar',
          plugin: expect.objectContaining({
            options: { value: 'bar' },
          }),
          priority: 2,
        },
        {
          name: 'boost-test-renderer-foo',
          plugin: expect.objectContaining({
            options: { value: 'foo' },
          }),
          priority: 3,
        },
      ]);
    });

    it('uses objects as is', () => {
      const render = () => 'test';

      registry.loadMany(
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
      expect(registry.plugins).toEqual([
        {
          name: '@test/boost-test-renderer-baz',
          plugin: expect.objectContaining({
            options: { value: 'baz' },
            render,
          }),
          priority: 1,
        },
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
      ]);
    });

    it('uses class instances as is', () => {
      // Basic
      const foo = createClass('boost-test-renderer-foo');
      // With options
      const bar = createClass('@boost-test/renderer-bar', { value: 'bar' });
      // With options and custom scope
      const baz = createClass('@test/boost-test-renderer-baz', { value: 'baz' });
      baz.priority = 1;

      registry.loadMany([foo, bar, baz], tool);

      // @ts-ignore Allow access
      expect(registry.plugins).toEqual([
        {
          name: '@test/boost-test-renderer-baz',
          plugin: baz,
          priority: 1,
        },
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
      ]);
    });

    it('supports all the patterns at once', () => {
      fixtures.push(
        copyFixtureToNodeModule('plugin-renderer-object', 'boost-test-renderer-foo'),
        copyFixtureToNodeModule('plugin-renderer-object', '@boost-test/renderer-bar'),
        copyFixtureToNodeModule('plugin-renderer-object', '@test/boost-test-renderer-baz'),
      );

      registry.loadMany(
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
        tool,
      );

      const qux = new Renderer({ value: 'qux' });
      qux.name = 'boost-test-renderer-qux';

      // @ts-ignore Allow access
      expect(registry.plugins).toEqual([
        {
          name: '@test/boost-test-renderer-baz',
          plugin: expect.any(Object),
          priority: 1,
        },
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
          name: 'boost-test-renderer-qux',
          plugin: qux,
          priority: DEFAULT_PRIORITY,
        },
      ]);
    });

    it('errors if unsupported setting passed', () => {
      expect(() => {
        registry.loadMany(
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
        registry.loadMany(
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
        registry.loadMany(
          [
            // @ts-ignore Allow invalid type
            new Renderer(),
          ],
          tool,
        );
      }).toThrow('Plugin object or class instance found without a `name` property.');
    });
  });

  describe('isRegistered()', () => {
    it('returns false if plugin not found', () => {
      expect(registry.isRegistered('foo')).toBe(false);
    });

    it('returns true if plugin is found', () => {
      registry.register('foo', new Renderer());

      expect(registry.isRegistered('foo')).toBe(true);
    });
  });

  describe('register()', () => {
    it('errors if no name provided', () => {
      expect(() => {
        registry.register('', new Renderer());
      }).toThrow('A fully qualified module name is required for renderers.');
    });

    it('errors if plugin is not an object', () => {
      expect(() => {
        registry.register(
          'foo',
          // @ts-ignore Allow invalid type
          123,
        );
      }).toThrow('Renderers expect an object or class instance, found number.');
    });

    it('errors if `validate` option fails', () => {
      expect(() => {
        registry.register(
          'foo',
          // @ts-ignore Allow invalid type
          {},
        );
      }).toThrow('Renderer requires a `render()` method.');
    });

    it('triggers `startup` lifecycle with tool', () => {
      const plugin = new Renderer();
      const spy = jest.spyOn(plugin, 'startup');

      registry.register('foo', plugin, tool);

      expect(spy).toHaveBeenCalledWith(tool);
    });

    it('triggers `beforeStartup` and `afterStartup` events', () => {
      const beforeSpy = jest.fn();
      const afterSpy = jest.fn();

      registry.configure({
        beforeStartup: beforeSpy,
        afterStartup: afterSpy,
      });

      registry.register('foo', new Renderer());

      expect(beforeSpy).toHaveBeenCalled();
      expect(afterSpy).toHaveBeenCalled();
    });

    it('adds plugin and its metadata to the list', () => {
      const result = { name: 'foo', plugin: new Renderer(), priority: 1 };

      registry.register('foo', result.plugin, tool, { priority: 1 });

      // @ts-ignore Allow access
      expect(registry.plugins).toEqual([result]);
    });
  });

  describe('unregister()', () => {
    beforeEach(() => {
      registry.register('foo', new Renderer(), tool, { priority: 1 });
    });

    it('errors if name not found', () => {
      expect(() => {
        registry.unregister('unknown');
      }).toThrow('Failed to find renderer "unknown". Have you installed it?');
    });

    it('triggers `shutdown` lifecycle with tool', () => {
      const spy = jest.spyOn(registry.get('foo'), 'shutdown');

      registry.unregister('foo', tool);

      expect(spy).toHaveBeenCalledWith(tool);
    });

    it('triggers `beforeShutdown` and `afterShutdown` events', () => {
      const beforeSpy = jest.fn();
      const afterSpy = jest.fn();

      registry.configure({
        beforeShutdown: beforeSpy,
        afterShutdown: afterSpy,
      });

      registry.unregister('foo');

      expect(beforeSpy).toHaveBeenCalled();
      expect(afterSpy).toHaveBeenCalled();
    });

    it('removes a plugin by name', () => {
      registry.unregister('foo');

      // @ts-ignore Allow access
      expect(registry.plugins).toEqual([]);
    });
  });
});
