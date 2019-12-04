import { copyFixtureToNodeModule } from '@boost/test-utils';
import { Renderable, createRendererManager } from './__mocks__/Renderer';
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
        options: {},
        render: expect.any(Function),
      });
    });

    it('loads a plugin module that factories an object with options', () => {
      fixtures.push(
        copyFixtureToNodeModule('plugin-renderer-object', '@boost-test/renderer-object-extra'),
      );

      const result = loader.load('object-extra', { value: 'foo' });

      expect(result).toEqual({
        name: '@boost-test/renderer-object-extra',
        options: { value: 'foo' },
        render: expect.any(Function),
      });
    });

    it('loads a plugin module that factories a class instance', () => {
      fixtures.push(copyFixtureToNodeModule('plugin-renderer-class', 'boost-test-renderer-class'));

      const result = loader.load('class');

      expect(result).toEqual(
        expect.objectContaining({
          name: 'boost-test-renderer-class',
        }),
      );

      expect(result.constructor.name).toBe('Renderer');
    });

    it('loads a plugin module that factories a class instance with options', () => {
      fixtures.push(
        copyFixtureToNodeModule('plugin-renderer-class', '@boost-test/renderer-class-extra'),
      );

      const result = loader.load('class-extra', { value: 'foo' });

      expect(result).toEqual(
        expect.objectContaining({
          name: '@boost-test/renderer-class-extra',
          options: { value: 'foo' },
        }),
      );

      expect(result.constructor.name).toBe('Renderer');
    });
  });
});
