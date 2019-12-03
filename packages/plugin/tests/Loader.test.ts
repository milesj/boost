import { copyFixtureToNodeModule } from '@boost/test-utils';
import { Renderable, Renderer, createRendererManager } from './__mocks__/Renderer';
import { DEFAULT_PRIORITY } from '../src';
import Loader from '../src/Loader';

describe('Loader', () => {
  let fixtures: Function[];
  let loader: Loader<Renderable>;

  beforeEach(() => {
    fixtures = [];
    loader = new Loader<Renderable>(createRendererManager());
  });

  afterEach(() => {
    fixtures.forEach(fixture => fixture());
  });

  describe('createResolver()', () => {
    describe('private scope', () => {
      it('adds lookup if pattern matches', () => {
        const resolver = loader.createResolver('@scope/boost-test-renderer-test');

        expect(resolver.getLookupPaths()).toEqual(['@scope/boost-test-renderer-test']);
      });

      it('adds lookup for shorthand', () => {
        const resolver = loader.createResolver('@scope/test');

        expect(resolver.getLookupPaths()).toEqual(['@scope/boost-test-renderer-test']);
      });

      it('doesnt match if tool name wrong', () => {
        expect(() => {
          loader.createResolver('@scope/unknown-renderer-test');
        }).toThrow('Unknown plugin module format "@scope/unknown-renderer-test".');
      });

      it('doesnt match if plugin type wrong', () => {
        expect(() => {
          loader.createResolver('@scope/boost-test-plugin-test');
        }).toThrow('Unknown plugin module format "@scope/boost-test-plugin-test".');
      });
    });

    describe('internal scope', () => {
      it('adds lookup if pattern matches', () => {
        const resolver = loader.createResolver('@boost-test/renderer-test');

        expect(resolver.getLookupPaths()).toEqual(['@boost-test/renderer-test']);
      });

      it('doesnt match if tool name wrong', () => {
        expect(() => {
          loader.createResolver('@unknown/renderer-test');
        }).toThrow('Unknown plugin module format "@unknown/renderer-test".');
      });

      it('doesnt match if plugin type wrong', () => {
        expect(() => {
          loader.createResolver('@boost-test/plugin-test');
        }).toThrow('Unknown plugin module format "@boost-test/plugin-test".');
      });
    });

    describe('public scope', () => {
      it('adds lookup if pattern matches', () => {
        const resolver = loader.createResolver('boost-test-renderer-test');

        expect(resolver.getLookupPaths()).toEqual(['boost-test-renderer-test']);
      });

      it('doesnt match if tool name wrong', () => {
        expect(() => {
          loader.createResolver('unknown-renderer-test');
        }).toThrow('Unknown plugin module format "unknown-renderer-test".');
      });

      it('doesnt match if plugin type wrong', () => {
        expect(() => {
          loader.createResolver('boost-test-plugin-test');
        }).toThrow('Unknown plugin module format "boost-test-plugin-test".');
      });
    });

    describe('name only', () => {
      it('adds lookup for internal and public scopes', () => {
        const resolver = loader.createResolver('test');

        expect(resolver.getLookupPaths()).toEqual([
          '@boost-test/renderer-test',
          'boost-test-renderer-test',
        ]);
      });

      it('supports dashes', () => {
        const resolver = loader.createResolver('foo-bar');

        expect(resolver.getLookupPaths()).toEqual([
          '@boost-test/renderer-foo-bar',
          'boost-test-renderer-foo-bar',
        ]);
      });

      it('supports numbers', () => {
        const resolver = loader.createResolver('test123');

        expect(resolver.getLookupPaths()).toEqual([
          '@boost-test/renderer-test123',
          'boost-test-renderer-test123',
        ]);
      });
    });
  });

  describe('load()', () => {
    it('errors if module is not found', () => {
      expect(() => {
        loader.load('missing');
      }).toThrow(
        expect.objectContaining({
          message: expect.stringContaining('Failed to resolve a path'),
        }),
      );
    });

    it('errors if module does not export a function', () => {
      fixtures.push(
        copyFixtureToNodeModule('plugin-export-nonfunc', 'boost-test-renderer-nonfunc'),
      );

      expect(() => {
        loader.load('nonfunc');
      }).toThrow('Plugin modules must export a default function, found object.');
    });

    it('loads a plugin module that factories an object', () => {
      fixtures.push(
        copyFixtureToNodeModule('plugin-renderer-object', 'boost-test-renderer-object'),
      );

      const result = loader.load('object');

      expect(result).toEqual({
        name: 'boost-test-renderer-object',
        plugin: {
          options: {},
          render: expect.any(Function),
        },
        priority: DEFAULT_PRIORITY,
      });
    });

    it('loads a plugin module that factories an object with options and priority', () => {
      fixtures.push(
        copyFixtureToNodeModule('plugin-renderer-object', '@boost-test/renderer-object-extra'),
      );

      const result = loader.load('object-extra', { value: 'foo' }, 123);

      expect(result).toEqual({
        name: '@boost-test/renderer-object-extra',
        plugin: {
          options: { value: 'foo' },
          render: expect.any(Function),
        },
        priority: 123,
      });
    });

    it('loads a plugin module that factories a class instance', () => {
      fixtures.push(copyFixtureToNodeModule('plugin-renderer-class', 'boost-test-renderer-class'));

      const result = loader.load('class');

      expect(result).toEqual(
        expect.objectContaining({
          name: 'boost-test-renderer-class',
          priority: DEFAULT_PRIORITY,
        }),
      );

      expect(result.plugin.constructor.name).toBe('Renderer');
    });

    it('loads a plugin module that factories a class instance with options and priority', () => {
      fixtures.push(
        copyFixtureToNodeModule('plugin-renderer-class', '@boost-test/renderer-class-extra'),
      );

      const result = loader.load('class-extra', { value: 'foo' }, 123);

      expect(result).toEqual(
        expect.objectContaining({
          name: '@boost-test/renderer-class-extra',
          priority: 123,
        }),
      );

      expect(result.plugin.constructor.name).toBe('Renderer');
      expect(result.plugin).toEqual(
        expect.objectContaining({
          options: { value: 'foo' },
        }),
      );
    });
  });

  describe('loadFromSettings()', () => {
    function createClass(name: string, options?: { value: string }, priority?: number) {
      const renderer = new Renderer(options);

      renderer.name = name;

      if (priority) {
        renderer.priority = priority;
      }

      return renderer;
    }

    it('loads plugins based on name', () => {
      fixtures.push(
        copyFixtureToNodeModule('plugin-renderer-object', 'boost-test-renderer-foo'),
        copyFixtureToNodeModule('plugin-renderer-object', '@boost-test/renderer-bar'),
        copyFixtureToNodeModule('plugin-renderer-object', '@test/boost-test-renderer-baz'),
      );

      const results = loader.loadFromSettings([
        // Short names
        'foo',
        'bar',
        // Full names
        'boost-test-renderer-foo',
        '@boost-test/renderer-bar',
        // Full name with custom scope
        '@test/boost-test-renderer-baz',
      ]);

      expect(results).toEqual([
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

      const results = loader.loadFromSettings([
        // Short names
        ['foo', { value: 'foo' }, 3],
        // Full names
        ['@boost-test/renderer-bar', { value: 'bar' }, 2],
        // Full name with shorthand scope
        ['@test/baz', { value: 'baz' }, 1],
      ]);

      expect(results).toEqual([
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
      const results = loader.loadFromSettings([
        // Basic
        { name: 'boost-test-renderer-foo', render },
        // With options
        // @ts-ignore
        { name: '@boost-test/renderer-bar', options: { value: 'bar' }, render },
        // With options and priority
        // @ts-ignore
        { name: '@test/boost-test-renderer-baz', options: { value: 'baz' }, priority: 1, render },
      ]);

      expect(results).toEqual([
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
      // With options and priority
      const baz = createClass('@test/boost-test-renderer-baz', { value: 'baz' }, 1);

      const results = loader.loadFromSettings([foo, bar, baz]);

      expect(results).toEqual([
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

      const results = loader.loadFromSettings([
        'foo',
        ['@boost-test/renderer-bar', { value: 'bar' }],
        {
          name: '@test/boost-test-renderer-baz',
          priority: 1,
          render: () => 'test',
        },
        createClass('boost-test-renderer-qux', { value: 'qux' }),
      ]);

      const qux = new Renderer({ value: 'qux' });
      qux.name = 'boost-test-renderer-qux';

      expect(results).toEqual([
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
        loader.loadFromSettings([
          // @ts-ignore Allow invalid type
          123,
        ]);
      }).toThrow('Unknown plugin setting: 123');
    });

    it('errors if object is passed without a name', () => {
      expect(() => {
        loader.loadFromSettings([
          // @ts-ignore Allow invalid type
          {},
        ]);
      }).toThrow('Plugin object or class instance found without a `name` property.');
    });

    it('errors if class instance is passed without a name', () => {
      expect(() => {
        loader.loadFromSettings([
          // @ts-ignore Allow invalid type
          new Renderer(),
        ]);
      }).toThrow('Plugin object or class instance found without a `name` property.');
    });
  });
});
