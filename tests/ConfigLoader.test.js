/* eslint-disable sort-keys */

import JSON5 from 'json5';
import mfs from 'mock-fs';
import path from 'path';
import ConfigLoader from '../src/ConfigLoader';
import { DEFAULT_TOOL_CONFIG } from '../src/constants';

function createJavascriptFile(data) {
  return `module.exports = ${JSON5.stringify(data)};`;
}

describe('ConfigLoader', () => {
  let loader;

  beforeEach(() => {
    loader = new ConfigLoader({
      appName: 'boost',
      pluginName: 'plugin',
      root: process.cwd(),
    });

    mfs();
  });

  afterEach(() => {
    mfs.restore();
  });

  describe('loadConfig()', () => {
    it('errors if package.json has not been loaded', () => {
      expect(() => {
        loader.loadConfig();
      }).toThrowError('Cannot load configuration as "package.json" has not been loaded.');
    });

    describe('from package.json', () => {
      it('errors if not an object', () => {
        loader.package = { boost: [] };

        expect(() => {
          loader.loadConfig();
        }).toThrowError('Invalid configuration. Must be a plain object.');
      });

      it('supports an object under the same name as the app', () => {
        loader.package = {
          boost: { foo: 'bar' },
        };

        expect(loader.loadConfig()).toEqual(expect.objectContaining({ foo: 'bar' }));
      });

      it('supports a string and converts it to `extends`', () => {
        mfs({
          'node_modules/module/config/boost.preset.js': createJavascriptFile({}),
        });

        loader.package = {
          boost: 'module',
        };

        expect(loader.loadConfig()).toEqual(expect.objectContaining({
          extends: [
            path.join(process.cwd(), 'node_modules/module/config/boost.preset.js'),
          ],
        }));
      });

      it('merges with default config', () => {
        loader.package = {
          boost: { foo: 'bar' },
        };

        expect(loader.loadConfig()).toEqual({
          ...DEFAULT_TOOL_CONFIG,
          foo: 'bar',
        });
      });
    });

    describe('from config folder', () => {
      beforeEach(() => {
        loader.package = { name: 'foo' };

        mfs({
          'package.json': JSON.stringify({ name: 'foo' }),
        });
      });

      it('errors if no files found', () => {
        expect(() => {
          loader.loadConfig();
        }).toThrowError(
          'Local configuration file could not be found. One of "config/boost.js" or "config/boost.json" must exist relative to the project root.',
        );
      });

      it('errors if too many files are found', () => {
        mfs({
          'config/boost.js': '',
          'config/boost.json': '',
        });

        expect(() => {
          loader.loadConfig();
        }).toThrowError(
          'Multiple "boost" configuration files found. Only 1 may exist.',
        );
      });

      it('supports .json files', () => {
        mfs({
          'config/boost.json': JSON.stringify({ foo: 'bar' }),
        });

        expect(loader.loadConfig()).toEqual(expect.objectContaining({ foo: 'bar' }));
      });

      it('supports .json5 files', () => {
        mfs({
          'config/boost.json5': JSON5.stringify({ foo: 'bar' }),
        });

        expect(loader.loadConfig()).toEqual(expect.objectContaining({ foo: 'bar' }));
      });

      it('supports .js files', () => {
        mfs({
          'config/boost.js': createJavascriptFile({ foo: 'bar' }),
        });

        expect(loader.loadConfig()).toEqual(expect.objectContaining({ foo: 'bar' }));
      });

      it('merges with default config', () => {
        mfs({
          'config/boost.json': JSON.stringify({ foo: 'bar' }),
        });

        expect(loader.loadConfig()).toEqual({
          ...DEFAULT_TOOL_CONFIG,
          foo: 'bar',
        });
      });
    });
  });

  describe('loadPackageJSON()', () => {
    it('errors if no package.json exists in current working directory', () => {
      expect(() => {
        loader.loadPackageJSON();
      }).toThrowError(
        'Local "package.json" could not be found. Please run the command in your project\'s root.',
      );
    });

    it('merges with default values if package.json is empty', () => {
      mfs({
        'package.json': JSON.stringify({}),
      });

      expect(loader.loadPackageJSON()).toEqual({
        name: '',
        version: '',
      });
    });

    it('parses package.json and merges values', () => {
      mfs({
        'package.json': JSON.stringify({ name: 'foo' }),
      });

      expect(loader.loadPackageJSON()).toEqual({
        name: 'foo',
        version: '',
      });
    });
  });

  describe('parseAndExtend()', () => {
    it('errors if a non-string or non-object is provided', () => {
      expect(() => {
        loader.parseAndExtend(123);
        loader.parseAndExtend([]);
      }).toThrowError('Invalid configuration. Must be a plain object.');
    });

    it('errors if preset does not exist', () => {
      expect(() => {
        loader.parseAndExtend({ extends: './foo.json' });
      }).toThrowError(
        `Preset configuration ${path.join(process.cwd(), './foo.json')} does not exist.`,
      );
    });

    it('errors if preset is not a file', () => {
      mfs({
        foo: mfs.directory(),
      });

      expect(() => {
        loader.parseAndExtend({ extends: './foo/' });
      }).toThrowError(
        `Preset configuration ${path.join(process.cwd(), './foo')} must be a valid file.`,
      );
    });

    it('parses a file path if a string is provided', () => {
      mfs({
        'foo.json': JSON.stringify({ foo: 'bar' }),
      });

      expect(loader.parseAndExtend('foo.json')).toEqual({ foo: 'bar' });
    });

    it('returns the config as is if no `extends`', () => {
      expect(loader.parseAndExtend({ foo: 'bar' })).toEqual({ foo: 'bar' });
    });

    it('returns the config if `extends` is empty', () => {
      expect(loader.parseAndExtend({ extends: '' })).toEqual({ extends: '' });
      expect(loader.parseAndExtend({ extends: [] })).toEqual({ extends: [] });
    });

    it('extends a preset and merges objects', () => {
      mfs({
        'foo.json': JSON.stringify({ foo: 'qux', debug: true }),
      });

      expect(loader.parseAndExtend({
        foo: 'bar',
        extends: './foo.json',
      })).toEqual({
        foo: 'bar',
        debug: true,
        extends: [
          path.join(process.cwd(), './foo.json'),
        ],
      });
    });

    it('extends multiple presets in order', () => {
      mfs({
        'foo.json': JSON.stringify({ a: 1 }),
        'node_modules/module/config/boost.preset.js': createJavascriptFile({ b: 2 }),
      });

      expect(loader.parseAndExtend({
        c: 3,
        extends: ['./foo.json', 'module'],
      })).toEqual({
        a: 1,
        b: 2,
        c: 3,
        extends: [
          path.join(process.cwd(), './foo.json'),
          path.join(process.cwd(), 'node_modules/module/config/boost.preset.js'),
        ],
      });
    });

    it('recursively extends presets', () => {
      mfs({
        'node_modules/foo/config/boost.preset.js': createJavascriptFile({ a: 1, extends: 'bar' }),
        'node_modules/bar/config/boost.preset.js': createJavascriptFile({ b: 2, extends: 'baz' }),
        'node_modules/baz/config/boost.preset.js': createJavascriptFile({ c: 3 }),
      });

      expect(loader.parseAndExtend({
        d: 4,
        extends: 'foo',
      })).toEqual({
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        extends: [
          path.join(process.cwd(), 'node_modules/baz/config/boost.preset.js'),
          path.join(process.cwd(), 'node_modules/bar/config/boost.preset.js'),
          path.join(process.cwd(), 'node_modules/foo/config/boost.preset.js'),
        ],
      });
    });

    it('avoids circular recursion', () => {
      mfs({
        'node_modules/foo/config/boost.preset.js': createJavascriptFile({ a: 1, extends: 'bar' }),
        'node_modules/bar/config/boost.preset.js': createJavascriptFile({ b: 2, extends: 'foo' }),
      });

      expect(loader.parseAndExtend({
        c: 3,
        extends: 'foo',
      })).toEqual({
        a: 1,
        b: 2,
        c: 3,
        extends: [
          path.join(process.cwd(), 'node_modules/foo/config/boost.preset.js'),
          path.join(process.cwd(), 'node_modules/bar/config/boost.preset.js'),
        ],
      });
    });

    it('concatenates and uniquifys arrays', () => {
      mfs({
        'foo.json': JSON.stringify({ list: ['foo', 'bar'] }),
      });

      expect(loader.parseAndExtend({
        list: ['baz'],
        extends: './foo.json',
      })).toEqual({
        list: ['foo', 'bar', 'baz'],
        extends: [
          path.join(process.cwd(), './foo.json'),
        ],
      });
    });

    it('merges objects', () => {
      mfs({
        'foo.json': JSON.stringify({ map: { foo: 123, bar: true } }),
      });

      expect(loader.parseAndExtend({
        map: { foo: 456, baz: 'wtf' },
        extends: './foo.json',
      })).toEqual({
        map: { foo: 456, bar: true, baz: 'wtf' },
        extends: [
          path.join(process.cwd(), './foo.json'),
        ],
      });
    });
  });

  describe('parseFile()', () => {
    it('errors for an unsupported file format', () => {
      mfs({
        'foo.txt': 'foo',
      });

      expect(() => {
        loader.parseFile('foo.txt');
      }).toThrowError('Unsupported configuration file format "foo.txt".');
    });

    it('errors if an object is not returned', () => {
      mfs({
        'bool.json': JSON.stringify(true),
        'number.json': JSON.stringify(123),
        'string.json': JSON.stringify('foo'),
        'array.json': JSON.stringify([]),
      });

      expect(() => {
        loader.parseFile('bool.json');
      }).toThrowError('Invalid configuration file "bool.json". Must return an object.');

      expect(() => {
        loader.parseFile('number.json');
      }).toThrowError('Invalid configuration file "number.json". Must return an object.');

      expect(() => {
        loader.parseFile('string.json');
      }).toThrowError('Invalid configuration file "string.json". Must return an object.');

      expect(() => {
        loader.parseFile('array.json');
      }).toThrowError('Invalid configuration file "array.json". Must return an object.');
    });

    it('parses .json files', () => {
      mfs({
        'foo.json': JSON.stringify({ name: 'foo' }),
      });

      expect(loader.parseFile('foo.json')).toEqual({ name: 'foo' });
    });

    it('parses .json files in JSON5 format', () => {
      mfs({
        'foo.json': JSON5.stringify({ name: 'foo' }),
      });

      expect(loader.parseFile('foo.json')).toEqual({ name: 'foo' });
    });

    it('parses .json5 files', () => {
      mfs({
        'foo.json5': JSON5.stringify({ name: 'foo' }),
      });

      expect(loader.parseFile('foo.json5')).toEqual({ name: 'foo' });
    });

    it('parses .js files', () => {
      mfs({
        'foo.js': createJavascriptFile({ name: 'foo' }),
      });

      expect(loader.parseFile('foo.js')).toEqual({ name: 'foo' });
    });

    it('parses .js files that return functions', () => {
      mfs({
        'foo.js': 'module.exports = () => { return { name: "foo" }; };',
      });

      expect(loader.parseFile('foo.js')).toEqual({ name: 'foo' });
    });

    it('parses .js files that return functions with options passed', () => {
      mfs({
        'foo.js': 'module.exports = (opts) => { return { name: "foo", ...opts }; };',
      });

      expect(loader.parseFile('foo.js', { version: 1 })).toEqual({
        name: 'foo',
        version: 1,
      });
    });
  });

  describe('resolveExtendPaths()', () => {
    beforeEach(() => {
      mfs({
        'absolute/file.json': JSON.stringify({ foo: 'bar' }),
        'relative/file.json': JSON.stringify({ foo: 'bar' }),
        'node_modules/foo-bar/config/boost.preset.js': createJavascriptFile({ foo: 'bar' }),
        'node_modules/@ns/foo-bar/config/boost.preset.js': createJavascriptFile({ foo: 'bar' }),
        'node_modules/boost-plugin-foo/config/boost.preset.js': createJavascriptFile({ foo: 'bar' }),
      });
    });

    it('errors if `extends` value is not a string', () => {
      expect(() => {
        loader.resolveExtendPaths(123);
        loader.resolveExtendPaths([123]);
      }).toThrowError(
        'Invalid `extends` configuration value. Must be a string or an array of strings.',
      );
    });

    it('errors for an invalid extend path', () => {
      expect(() => {
        loader.resolveExtendPaths(['FooBarBaz']);
      }).toThrowError('Invalid `extends` configuration value "FooBarBaz".');
    });

    it('supports a single string value', () => {
      expect(loader.resolveExtendPaths('foo-bar')).toEqual([
        path.join(process.cwd(), './node_modules/foo-bar/config/boost.preset.js'),
      ]);
    });

    it('supports multiple string values using an array', () => {
      expect(loader.resolveExtendPaths(['foo-bar', 'plugin:foo'])).toEqual([
        path.join(process.cwd(), './node_modules/foo-bar/config/boost.preset.js'),
        path.join(process.cwd(), './node_modules/boost-plugin-foo/config/boost.preset.js'),
      ]);
    });

    it('resolves absolute paths', () => {
      const absPath = path.join(process.cwd(), 'absolute/file.json');

      expect(loader.resolveExtendPaths([absPath])).toEqual([absPath]);
    });

    it('resolves relative paths', () => {
      expect(loader.resolveExtendPaths(['./relative/file.json'])).toEqual([
        path.join(process.cwd(), './relative/file.json'),
      ]);
    });

    it('resolves node modules', () => {
      expect(loader.resolveExtendPaths(['foo-bar'])).toEqual([
        path.join(process.cwd(), './node_modules/foo-bar/config/boost.preset.js'),
      ]);
    });

    it('resolves node modules with a namespace', () => {
      expect(loader.resolveExtendPaths(['@ns/foo-bar'])).toEqual([
        path.join(process.cwd(), './node_modules/@ns/foo-bar/config/boost.preset.js'),
      ]);
    });

    it('resolves plugins', () => {
      expect(loader.resolveExtendPaths(['plugin:foo'])).toEqual([
        path.join(process.cwd(), './node_modules/boost-plugin-foo/config/boost.preset.js'),
      ]);
    });

    it('resolves plugins using their full name', () => {
      expect(loader.resolveExtendPaths(['boost-plugin-foo'])).toEqual([
        path.join(process.cwd(), './node_modules/boost-plugin-foo/config/boost.preset.js'),
      ]);
    });
  });

  describe('resolveModuleConfigPath()', () => {
    it('returns file path with correct naming', () => {
      expect(loader.resolveModuleConfigPath('foo', 'bar'))
        .toBe(path.join(process.cwd(), './node_modules/bar/config/foo.js'));
    });

    it('can flag as preset', () => {
      expect(loader.resolveModuleConfigPath('foo', 'bar', true))
        .toBe(path.join(process.cwd(), './node_modules/bar/config/foo.preset.js'));
    });

    it('can change the extension', () => {
      expect(loader.resolveModuleConfigPath('foo', 'bar', true, 'json'))
        .toBe(path.join(process.cwd(), './node_modules/bar/config/foo.preset.json'));
    });
  });
});
