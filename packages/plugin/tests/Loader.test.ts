import { Loader, Pluggable, Plugin } from '../src';

interface Renderable extends Pluggable {
  render(): string;
}

class Renderer extends Plugin implements Renderable {
  blueprint() {
    return {};
  }

  render() {
    return 'test';
  }
}

describe('Loader', () => {
  let loader: Loader<Renderable>;
  let beforeSpy: jest.Mock;
  let afterSpy: jest.Mock;

  beforeEach(() => {
    beforeSpy = jest.fn();
    afterSpy = jest.fn();

    loader = new Loader<Renderable>(
      {
        afterBootstrap: afterSpy,
        beforeBootstrap: beforeSpy,
        pluralName: 'renderers',
        singularName: 'renderer',
        validate(plugin) {
          if (typeof plugin.render !== 'function') {
            throw new TypeError('Renderer requires a `render()` method.');
          }
        },
      },
      'boost',
    );
  });

  describe('checkPlugin()', () => {
    it('errors if not an object', () => {
      expect(() => {
        // @ts-ignore Allow invalid type
        loader.checkPlugin(123);
      }).toThrow(
        'Expected an object or class instance from the plugin factory function, found number.',
      );

      expect(() => {
        // @ts-ignore Allow invalid type
        loader.checkPlugin('foo');
      }).toThrow(
        'Expected an object or class instance from the plugin factory function, found string.',
      );
    });

    it('errors if the plugin doesnt validate', () => {
      expect(() => {
        // @ts-ignore Allow missing render function
        loader.checkPlugin({});
      }).toThrow('Renderer requires a `render()` method.');
    });

    it('passes when a plain object', () => {
      const plugin = {
        render() {
          return 'foo';
        },
      };

      expect(loader.checkPlugin(plugin)).toBe(plugin);
    });

    it('passes when a class instance', () => {
      const plugin = new Renderer();

      expect(loader.checkPlugin(plugin)).toBe(plugin);
    });
  });

  describe('createResolver()', () => {
    describe('private scope', () => {
      it('adds lookup if pattern matches', () => {
        const resolver = loader.createResolver('@scope/boost-renderer-test');

        expect(resolver.getLookupPaths()).toEqual(['@scope/boost-renderer-test']);
      });

      it('doesnt match if tool name wrong', () => {
        expect(() => {
          loader.createResolver('@scope/unknown-renderer-test');
        }).toThrow('Unknown plugin module format "@scope/unknown-renderer-test".');
      });

      it('doesnt match if plugin type wrong', () => {
        expect(() => {
          loader.createResolver('@scope/boost-plugin-test');
        }).toThrow('Unknown plugin module format "@scope/boost-plugin-test".');
      });
    });

    describe('internal scope', () => {
      it('adds lookup if pattern matches', () => {
        const resolver = loader.createResolver('@boost/renderer-test');

        expect(resolver.getLookupPaths()).toEqual(['@boost/renderer-test']);
      });

      it('doesnt match if tool name wrong', () => {
        expect(() => {
          loader.createResolver('@unknown/renderer-test');
        }).toThrow('Unknown plugin module format "@unknown/renderer-test".');
      });

      it('doesnt match if plugin type wrong', () => {
        expect(() => {
          loader.createResolver('@boost/plugin-test');
        }).toThrow('Unknown plugin module format "@boost/plugin-test".');
      });
    });

    describe('public scope', () => {
      it('adds lookup if pattern matches', () => {
        const resolver = loader.createResolver('boost-renderer-test');

        expect(resolver.getLookupPaths()).toEqual(['boost-renderer-test']);
      });

      it('doesnt match if tool name wrong', () => {
        expect(() => {
          loader.createResolver('unknown-renderer-test');
        }).toThrow('Unknown plugin module format "unknown-renderer-test".');
      });

      it('doesnt match if plugin type wrong', () => {
        expect(() => {
          loader.createResolver('boost-plugin-test');
        }).toThrow('Unknown plugin module format "boost-plugin-test".');
      });
    });

    describe('name only', () => {
      it('adds lookup for internal and public scopes', () => {
        const resolver = loader.createResolver('test');

        expect(resolver.getLookupPaths()).toEqual(['@boost/renderer-test', 'boost-renderer-test']);
      });

      it('supports dashes', () => {
        const resolver = loader.createResolver('foo-bar');

        expect(resolver.getLookupPaths()).toEqual([
          '@boost/renderer-foo-bar',
          'boost-renderer-foo-bar',
        ]);
      });

      it('supports numbers', () => {
        const resolver = loader.createResolver('test123');

        expect(resolver.getLookupPaths()).toEqual([
          '@boost/renderer-test123',
          'boost-renderer-test123',
        ]);
      });
    });
  });
});
