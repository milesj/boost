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
    fixtures.forEach((fixture) => fixture());
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

  describe('get()', () => {
    const foo = new Renderer();
    const barBaz = new Renderer();
    const qux = new Renderer();

    beforeEach(() => {
      registry.register('boost-test-renderer-foo', foo, tool);
      registry.register('@boost-test/renderer-bar-baz', barBaz, tool);
      registry.register('@test/boost-test-renderer-qux', qux, tool);
    });

    it('errors if name is not registered', () => {
      expect(() => {
        registry.get('unknown');
      }).toThrow('Failed to find renderer "unknown". Have you installed it?');
    });

    it('returns plugin by short name (public)', () => {
      expect(registry.get('foo')).toBe(foo);
    });

    it('returns plugin by short name (internal)', () => {
      expect(registry.get('bar-baz')).toBe(barBaz);
    });

    it('returns plugin by qualified public name', () => {
      expect(registry.get('boost-test-renderer-foo')).toBe(foo);
    });

    it('returns plugin by qualified internal name', () => {
      expect(registry.get('@boost-test/renderer-bar-baz')).toBe(barBaz);
    });

    it('returns plugin by qualified custom scope name', () => {
      expect(registry.get('@test/boost-test-renderer-qux')).toBe(qux);
    });
  });

  describe('getAll()', () => {
    const foo = new Renderer();
    const bar = new Renderer();
    const baz = new Renderer();

    beforeEach(() => {
      registry.register('boost-test-renderer-foo', foo, tool);
      registry.register('boost-test-renderer-bar', bar, tool);
      registry.register('boost-test-renderer-baz', baz, tool);
    });

    it('returns all registered plugins', () => {
      expect(registry.getAll()).toEqual([foo, bar, baz]);
    });
  });

  describe('getMany()', () => {
    const foo = new Renderer();
    const bar = new Renderer();
    const baz = new Renderer();

    beforeEach(() => {
      registry.register('boost-test-renderer-foo', foo, tool);
      registry.register('@boost-test/renderer-bar', bar, tool);
      registry.register('@test/boost-test-renderer-baz', baz, tool);
    });

    it('returns all by short name', () => {
      expect(registry.getMany(['foo', 'bar'])).toEqual([foo, bar]);
    });

    it('returns all by qualified name', () => {
      expect(
        registry.getMany(['@test/boost-test-renderer-baz', '@boost-test/renderer-bar']),
      ).toEqual([baz, bar]);
    });

    it('returns all by mixed names', () => {
      expect(
        registry.getMany([
          '@test/boost-test-renderer-baz',
          'foo',
          '@boost-test/renderer-bar',
          'bar',
          'boost-test-renderer-foo',
        ]),
      ).toEqual([baz, foo, bar, bar, foo]);
    });
  });

  describe('loadMany()', () => {
    function createClass(name: string, options?: { value: string }) {
      const renderer = new Renderer(options);

      renderer.name = name;

      return renderer;
    }

    it('emits `onLoad` event for each plugin', async () => {
      fixtures.push(
        copyFixtureToNodeModule('plugin-renderer-object', 'boost-test-renderer-foo'),
        copyFixtureToNodeModule('plugin-renderer-object', '@boost-test/renderer-bar'),
        copyFixtureToNodeModule('plugin-renderer-object', '@test/boost-test-renderer-baz'),
      );

      const spy = jest.fn();

      registry.onLoad.listen(spy);

      await registry.loadMany(['foo', 'bar'], tool);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith('foo', {});
      expect(spy).toHaveBeenCalledWith('bar', {});
    });

    it('loads plugins based on name', async () => {
      fixtures.push(
        copyFixtureToNodeModule('plugin-renderer-object', 'boost-test-renderer-foo'),
        copyFixtureToNodeModule('plugin-renderer-object', '@boost-test/renderer-bar'),
        copyFixtureToNodeModule('plugin-renderer-object', '@test/boost-test-renderer-baz'),
      );

      await registry.loadMany(
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

      // @ts-expect-error
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

    it('loads plugins based on name with options and priority', async () => {
      fixtures.push(
        copyFixtureToNodeModule('plugin-renderer-object', 'boost-test-renderer-foo'),
        copyFixtureToNodeModule('plugin-renderer-object', '@boost-test/renderer-bar'),
        copyFixtureToNodeModule('plugin-renderer-object', '@test/boost-test-renderer-baz'),
      );

      await registry.loadMany(
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

      // @ts-expect-error
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

    it('uses objects as is', async () => {
      const render = () => 'test';

      await registry.loadMany(
        [
          // Basic
          { name: 'boost-test-renderer-foo', render },
          // With options
          // @ts-expect-error
          { name: '@boost-test/renderer-bar', options: { value: 'bar' }, render },
          // With options and priority
          // @ts-expect-error
          { name: '@test/boost-test-renderer-baz', options: { value: 'baz' }, priority: 1, render },
        ],
        {},
      );

      // @ts-expect-error
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

    it('uses class instances as is', async () => {
      // Basic
      const foo = createClass('boost-test-renderer-foo');
      // With options
      const bar = createClass('@boost-test/renderer-bar', { value: 'bar' });
      // With options and custom scope
      const baz = createClass('@test/boost-test-renderer-baz', { value: 'baz' });
      baz.priority = 1;

      await registry.loadMany([foo, bar, baz], tool);

      // @ts-expect-error
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

    it('supports all the patterns at once', async () => {
      fixtures.push(
        copyFixtureToNodeModule('plugin-renderer-object', 'boost-test-renderer-foo'),
        copyFixtureToNodeModule('plugin-renderer-object', '@boost-test/renderer-bar'),
        copyFixtureToNodeModule('plugin-renderer-object', '@test/boost-test-renderer-baz'),
      );

      await registry.loadMany(
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

      // @ts-expect-error
      expect(registry.plugins).toEqual([
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
      ]);
    });

    it('errors if unsupported setting passed', async () => {
      await expect(
        registry.loadMany(
          [
            // @ts-expect-error
            123,
          ],
          {},
        ),
      ).rejects.toThrow('Unknown plugin setting "123". [PLG:SETTING_UNKNOWN]');
    });

    it('errors if object is passed without a name', async () => {
      await expect(
        registry.loadMany(
          [
            // @ts-expect-error
            {},
          ],
          {},
        ),
      ).rejects.toThrow('Plugin object or class instance found without a `name` property.');
    });

    it('errors if class instance is passed without a name', async () => {
      await expect(registry.loadMany([new Renderer()], tool)).rejects.toThrow(
        'Plugin object or class instance found without a `name` property.',
      );
    });
  });

  describe('isRegistered()', () => {
    it('returns false if plugin not found', () => {
      expect(registry.isRegistered('foo')).toBe(false);
    });

    it('returns true if plugin is found', async () => {
      await registry.register('foo', new Renderer());

      expect(registry.isRegistered('foo')).toBe(true);
    });
  });

  describe('register()', () => {
    it('errors if no name provided', async () => {
      await expect(registry.register('', new Renderer())).rejects.toThrow(
        'A fully qualified module name is required for renderers.',
      );
    });

    it('errors if plugin is not an object', async () => {
      await expect(
        registry.register(
          'foo',
          // @ts-expect-error
          123,
        ),
      ).rejects.toThrow('Renderers expect an object or class instance, found number.');
    });

    it('errors if `validate` option fails', async () => {
      await expect(
        registry.register(
          'foo',
          // @ts-expect-error
          {},
        ),
      ).rejects.toThrow('Renderer requires a `render()` method.');
    });

    it('triggers `startup` lifecycle with tool', async () => {
      const plugin = new Renderer();
      const spy = jest.spyOn(plugin, 'startup');

      await registry.register('foo', plugin, tool);

      expect(spy).toHaveBeenCalledWith(tool);
    });

    it('triggers `beforeStartup` and `afterStartup` events', async () => {
      const beforeSpy = jest.fn();
      const afterSpy = jest.fn();

      registry.configure({
        beforeStartup: beforeSpy,
        afterStartup: afterSpy,
      });

      await registry.register('foo', new Renderer());

      expect(beforeSpy).toHaveBeenCalled();
      expect(afterSpy).toHaveBeenCalled();
    });

    it('adds plugin and its metadata to the list', async () => {
      const result = { name: 'foo', plugin: new Renderer(), priority: 1 };

      await registry.register('foo', result.plugin, tool, { priority: 1 });

      // @ts-expect-error
      expect(registry.plugins).toEqual([result]);
    });

    it('emits `onRegister` event', async () => {
      const plugin = new Renderer();
      const spy = jest.fn();

      registry.onRegister.listen(spy);

      await registry.register('foo', plugin, tool);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(plugin);
    });
  });

  describe('unregister()', () => {
    beforeEach(async () => {
      await registry.register('foo', new Renderer(), tool, { priority: 1 });
    });

    it('errors if name not found', async () => {
      await expect(registry.unregister('unknown')).rejects.toThrow(
        'Failed to find renderer "unknown". Have you installed it?',
      );
    });

    it('triggers `shutdown` lifecycle with tool', async () => {
      const spy = jest.spyOn(registry.get('foo'), 'shutdown');

      await registry.unregister('foo', tool);

      expect(spy).toHaveBeenCalledWith(tool);
    });

    it('triggers `beforeShutdown` and `afterShutdown` events', async () => {
      const beforeSpy = jest.fn();
      const afterSpy = jest.fn();

      registry.configure({
        beforeShutdown: beforeSpy,
        afterShutdown: afterSpy,
      });

      await registry.unregister('foo');

      expect(beforeSpy).toHaveBeenCalled();
      expect(afterSpy).toHaveBeenCalled();
    });

    it('removes a plugin by name', async () => {
      await registry.unregister('foo');

      // @ts-expect-error
      expect(registry.plugins).toEqual([]);
    });

    it('emits `onUnregister` event', async () => {
      const spy = jest.fn();

      registry.onUnregister.listen(spy);

      await registry.unregister('foo');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(new Renderer());
    });
  });
});
