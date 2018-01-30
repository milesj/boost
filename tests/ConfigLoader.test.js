/* eslint-disable sort-keys */

import JSON5 from 'json5';
import ConfigLoader from '../src/ConfigLoader';
import Tool from '../src/Tool';
import Console from '../src/Console';
import { DEFAULT_TOOL_CONFIG } from '../src/constants';
import {
  getTestRoot,
  getFixturePath,
  getModulePath,
  copyFixtureToModule,
  createTempFileInRoot,
} from './helpers';

function createJavascriptFile(data) {
  return `module.exports = ${JSON5.stringify(data)};`;
}

describe('ConfigLoader', () => {
  let loader;
  let fixtures = [];

  beforeEach(() => {
    const tool = new Tool({
      appName: 'test-boost',
      pluginAlias: 'plugin',
      root: getTestRoot(),
    });
    tool.console = new Console();

    loader = new ConfigLoader(tool);

    fixtures = [];
  });

  afterEach(() => {
    fixtures.forEach(remove => remove());
  });

  describe('loadConfig()', () => {
    it('errors if package.json has not been loaded', () => {
      expect(() => {
        loader.loadConfig();
      }).toThrowError('Cannot load configuration as "package.json" has not been loaded.');
    });

    describe('from package.json', () => {
      it('errors if not an object', () => {
        loader.package = { testBoost: [] };

        expect(() => {
          loader.loadConfig();
        }).toThrowError('Invalid configuration. Must be a plain object.');
      });

      it('supports an object', () => {
        loader.package = {
          testBoost: { foo: 'bar' },
        };

        expect(loader.loadConfig()).toEqual(expect.objectContaining({ foo: 'bar' }));
      });

      it('supports a string and converts it to `extends`', () => {
        fixtures.push(copyFixtureToModule('preset', 'test-boost-preset'));

        loader.package = {
          testBoost: 'test-boost-preset',
        };

        expect(loader.loadConfig()).toEqual(expect.objectContaining({
          extends: [
            getModulePath('test-boost-preset', 'config/test-boost.preset.js'),
          ],
        }));
      });

      it('merges with default config', () => {
        loader.package = {
          testBoost: { foo: 'bar' },
        };

        expect(loader.loadConfig()).toEqual({
          ...DEFAULT_TOOL_CONFIG,
          foo: 'bar',
        });
      });

      it('supports plugins', () => {
        loader.package = {
          testBoost: {
            plugins: [
              'foo',
              {
                plugin: 'bar',
                option: true,
              },
            ],
          },
        };

        expect(loader.loadConfig()).toEqual({
          ...DEFAULT_TOOL_CONFIG,
          plugins: [
            'foo',
            {
              plugin: 'bar',
              option: true,
            },
          ],
        });
      });
    });

    describe('from config folder', () => {
      beforeEach(() => {
        loader.package = { name: 'foo' };
      });

      it('errors if no files found', () => {
        loader.tool.options.root = getFixturePath('app-no-configs');

        expect(() => {
          loader.loadConfig();
        }).toThrowError(
          'Local configuration file could not be found. One of config/test-boost.js, config/test-boost.json, config/test-boost.json5 must exist relative to the project root.',
        );
      });

      it('errors if too many files are found', () => {
        loader.tool.options.root = getFixturePath('app-multi-configs');

        expect(() => {
          loader.loadConfig();
        }).toThrowError(
          'Multiple "test-boost" configuration files found. Only 1 may exist.',
        );
      });

      it('supports .json files', () => {
        expect(loader.loadConfig()).toEqual(expect.objectContaining({ foo: 'bar' }));
      });

      it('supports .json5 files', () => {
        loader.tool.options.root = getFixturePath('app-json5-config');

        expect(loader.loadConfig()).toEqual(expect.objectContaining({ foo: 'bar' }));
      });

      it('supports .js files', () => {
        loader.tool.options.root = getFixturePath('app-js-config');

        expect(loader.loadConfig()).toEqual(expect.objectContaining({ foo: 'bar' }));
      });

      it('merges with default config', () => {
        expect(loader.loadConfig()).toEqual({
          ...DEFAULT_TOOL_CONFIG,
          foo: 'bar',
        });
      });

      it('supports plugins', () => {
        loader.tool.options.root = getFixturePath('app-plugin-config');

        expect(loader.loadConfig()).toEqual({
          ...DEFAULT_TOOL_CONFIG,
          plugins: [
            'foo',
            {
              plugin: 'bar',
              option: true,
            },
          ],
        });
      });

      it('supports custom folder name', () => {
        loader.tool.options.configFolder = './configs';
        loader.tool.options.root = getFixturePath('app-folder-name');

        expect(loader.loadConfig()).toEqual(expect.objectContaining({ foo: 'bar' }));
      });
    });
  });

  describe('loadPackageJSON()', () => {
    it('errors if no package.json exists in current working directory', () => {
      loader.tool.options.root = getFixturePath('app-no-configs');

      expect(() => {
        loader.loadPackageJSON();
      }).toThrowError(
        'Local "package.json" could not be found. Please run the command in your project\'s root.',
      );
    });

    it('parses package.json and merges values', () => {
      expect(loader.loadPackageJSON()).toEqual({
        name: 'test-boost-app',
        version: '0.0.0',
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
        loader.parseAndExtend({ extends: ['./foo.json'] });
      }).toThrowError(
        `Preset configuration ${getFixturePath('app', './foo.json')} does not exist.`,
      );
    });

    it('errors if preset is not a file', () => {
      expect(() => {
        loader.parseAndExtend({ extends: [__dirname] });
      }).toThrowError(
        `Preset configuration ${__dirname} must be a valid file.`,
      );
    });

    it('parses a file path if a string is provided', () => {
      expect(loader.parseAndExtend(getFixturePath('app', 'config/test-boost.json')))
        .toEqual({ foo: 'bar' });
    });

    it('returns the config as is if no `extends`', () => {
      expect(loader.parseAndExtend({ foo: 'bar' })).toEqual({ foo: 'bar' });
    });

    it('returns the config if `extends` is empty', () => {
      expect(loader.parseAndExtend({ extends: [] })).toEqual({ extends: [] });
    });

    it('extends a preset and merges objects', () => {
      const presetPath = getFixturePath('preset', 'config/test-boost.preset.js');

      expect(loader.parseAndExtend({
        foo: 'bar',
        extends: [presetPath],
      })).toEqual({
        foo: 'bar',
        preset: true,
        extends: [presetPath],
      });
    });

    it('extends multiple presets in order', () => {
      const presetFoo = getFixturePath('preset', 'config/foo.preset.js');
      const presetBar = getFixturePath('preset', 'config/bar.preset.js');
      const presetBaz = getFixturePath('preset', 'config/baz.preset.js');

      expect(loader.parseAndExtend({
        extends: [presetFoo, presetBar, presetBaz],
      })).toEqual({
        foo: 1,
        bar: 2,
        baz: 3,
        extends: [presetFoo, presetBar, presetBaz],
      });
    });

    it('extends presets recursively', () => {
      fixtures.push(createTempFileInRoot(
        'extend-recursive-a.json',
        JSON.stringify({ a: 1, extends: ['./extend-recursive-b.json'] }),
      ));
      fixtures.push(createTempFileInRoot(
        'extend-recursive-b.json',
        JSON.stringify({ b: 2, extends: ['./extend-recursive-c.json'] }),
      ));
      fixtures.push(createTempFileInRoot(
        'extend-recursive-c.json',
        JSON.stringify({ c: 3 }),
      ));

      expect(loader.parseAndExtend({
        d: 4,
        extends: ['./extend-recursive-a.json'],
      })).toEqual({
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        extends: [
          getFixturePath('app', './extend-recursive-c.json'),
          getFixturePath('app', './extend-recursive-b.json'),
          getFixturePath('app', './extend-recursive-a.json'),
        ],
      });
    });

    it('avoids circular recursion', () => {
      fixtures.push(createTempFileInRoot(
        'extend-circular-a.json',
        JSON.stringify({ a: 1, extends: ['./extend-circular-b.json'] }),
      ));
      fixtures.push(createTempFileInRoot(
        'extend-circular-b.json',
        JSON.stringify({ b: 2, extends: ['./extend-circular-a.json'] }),
      ));

      expect(loader.parseAndExtend({
        c: 3,
        extends: ['./extend-circular-a.json'],
      })).toEqual({
        a: 1,
        b: 2,
        c: 3,
        extends: [
          getFixturePath('app', './extend-circular-a.json'),
          getFixturePath('app', './extend-circular-b.json'),
        ],
      });
    });

    it('concatenates and uniquifys arrays', () => {
      fixtures.push(createTempFileInRoot(
        'extend-merge-arrays.json',
        JSON.stringify({ list: ['foo', 'bar'] }),
      ));

      expect(loader.parseAndExtend({
        list: ['baz'],
        extends: ['./extend-merge-arrays.json'],
      })).toEqual({
        list: ['foo', 'bar', 'baz'],
        extends: [
          getFixturePath('app', './extend-merge-arrays.json'),
        ],
      });
    });

    it('merges objects', () => {
      fixtures.push(createTempFileInRoot(
        'extend-merge-objects.json',
        JSON.stringify({ map: { foo: 123, bar: true } }),
      ));

      expect(loader.parseAndExtend({
        map: { foo: 456, baz: 'wtf' },
        extends: ['./extend-merge-objects.json'],
      })).toEqual({
        map: { foo: 456, bar: true, baz: 'wtf' },
        extends: [
          getFixturePath('app', './extend-merge-objects.json'),
        ],
      });
    });
  });

  describe('parseFile()', () => {
    it('errors for an non-absolute path', () => {
      expect(() => {
        loader.parseFile('foo.json');
      }).toThrowError('An absolute file path is required.');
    });

    it('errors for an unsupported file format', () => {
      expect(() => {
        loader.parseFile(getFixturePath('app', 'foo.txt'));
      }).toThrowError('Unsupported configuration file format "foo.txt".');
    });

    it('errors if an object is not returned', () => {
      fixtures.push(createTempFileInRoot('bool.json', JSON.stringify(true)));
      fixtures.push(createTempFileInRoot('number.json', JSON.stringify(123)));
      fixtures.push(createTempFileInRoot('string.json', JSON.stringify('foo')));
      fixtures.push(createTempFileInRoot('array.json', JSON.stringify([])));

      expect(() => {
        loader.parseFile(getFixturePath('app', 'bool.json'));
      }).toThrowError('Invalid configuration file "bool.json". Must return an object.');

      expect(() => {
        loader.parseFile(getFixturePath('app', 'number.json'));
      }).toThrowError('Invalid configuration file "number.json". Must return an object.');

      expect(() => {
        loader.parseFile(getFixturePath('app', 'string.json'));
      }).toThrowError('Invalid configuration file "string.json". Must return an object.');

      expect(() => {
        loader.parseFile(getFixturePath('app', 'array.json'));
      }).toThrowError('Invalid configuration file "array.json". Must return an object.');
    });

    it('parses .json files', () => {
      fixtures.push(createTempFileInRoot('test.json', JSON.stringify({ name: 'foo' })));

      expect(loader.parseFile(getFixturePath('app', 'test.json'))).toEqual({ name: 'foo' });
    });

    it('parses .json files in JSON5 format', () => {
      fixtures.push(createTempFileInRoot('test.json', JSON5.stringify({ name: 'foo' })));

      expect(loader.parseFile(getFixturePath('app', 'test.json'))).toEqual({ name: 'foo' });
    });

    it('parses .json5 files', () => {
      fixtures.push(createTempFileInRoot('test.json5', JSON5.stringify({ name: 'foo' })));

      expect(loader.parseFile(getFixturePath('app', 'test.json5'))).toEqual({ name: 'foo' });
    });

    it('parses .js files', () => {
      fixtures.push(createTempFileInRoot('test.js', createJavascriptFile({ name: 'foo' })));

      expect(loader.parseFile(getFixturePath('app', 'test.js'))).toEqual({ name: 'foo' });
    });

    it('parses .js files and handles babel default exports', () => {
      fixtures.push(createTempFileInRoot('test-default.js', createJavascriptFile({
        __esModule: true,
        default: { name: 'foo' },
      })));

      expect(loader.parseFile(getFixturePath('app', 'test-default.js'))).toEqual({ name: 'foo' });
    });

    it('parses .js files that return functions', () => {
      fixtures.push(createTempFileInRoot(
        'test-func.js',
        'module.exports = () => { return { name: "foo" }; };',
      ));

      expect(loader.parseFile(getFixturePath('app', 'test-func.js'))).toEqual({ name: 'foo' });
    });

    it('parses .js files that return functions with options passed', () => {
      fixtures.push(createTempFileInRoot(
        'test-func-opts.js',
        'module.exports = opts => Object.assign({ name: "foo" }, opts);',
      ));

      expect(loader.parseFile(getFixturePath('app', 'test-func-opts.js'), { version: 1 })).toEqual({
        name: 'foo',
        version: 1,
      });
    });
  });

  describe('resolveExtendPaths()', () => {
    it('errors if `extends` value is not a string', () => {
      expect(() => {
        loader.resolveExtendPaths([123]);
      }).toThrowError(
        'Invalid `extends` configuration value. Must be an array of strings.',
      );
    });

    it('errors for an invalid extend path', () => {
      expect(() => {
        loader.resolveExtendPaths(['FooBarBaz']);
      }).toThrowError('Invalid `extends` configuration value "FooBarBaz".');
    });

    it('supports multiple string values using an array', () => {
      expect(loader.resolveExtendPaths(['foo-bar', 'plugin:foo'])).toEqual([
        getModulePath('foo-bar', 'config/test-boost.preset.js'),
        getModulePath('test-boost-plugin-foo', 'config/test-boost.preset.js'),
      ]);
    });

    it('resolves absolute paths', () => {
      const absPath = getFixturePath('app', 'absolute/file.json');

      expect(loader.resolveExtendPaths([absPath])).toEqual([absPath]);
    });

    it('resolves relative paths', () => {
      expect(loader.resolveExtendPaths(['./relative/file.json'])).toEqual([
        getFixturePath('app', './relative/file.json'),
      ]);
    });

    it('resolves node modules', () => {
      expect(loader.resolveExtendPaths(['foo-bar'])).toEqual([
        getModulePath('foo-bar', 'config/test-boost.preset.js'),
      ]);
    });

    it('resolves node modules with a scoped', () => {
      expect(loader.resolveExtendPaths(['@ns/foo-bar'])).toEqual([
        getModulePath('@ns/foo-bar', 'config/test-boost.preset.js'),
      ]);
    });

    it('resolves plugins', () => {
      expect(loader.resolveExtendPaths(['plugin:foo'])).toEqual([
        getModulePath('test-boost-plugin-foo', 'config/test-boost.preset.js'),
      ]);
    });

    it('resolves plugins with scoped', () => {
      loader.tool.options.scoped = true;

      expect(loader.resolveExtendPaths(['plugin:foo'])).toEqual([
        getModulePath('@test-boost/plugin-foo', 'config/test-boost.preset.js'),
      ]);
    });

    it('resolves plugins using their full name', () => {
      expect(loader.resolveExtendPaths(['test-boost-plugin-foo'])).toEqual([
        getModulePath('test-boost-plugin-foo', 'config/test-boost.preset.js'),
      ]);
    });

    it('resolves plugins using their full namepaced name', () => {
      expect(loader.resolveExtendPaths(['@ns/test-test-boost-plugin-foo'])).toEqual([
        getModulePath('@ns/test-test-boost-plugin-foo', 'config/test-boost.preset.js'),
      ]);
    });
  });

  describe('resolveModuleConfigPath()', () => {
    it('returns file path with correct naming', () => {
      expect(loader.resolveModuleConfigPath('foo', 'bar'))
        .toBe(getModulePath('bar', 'config/foo.js'));
    });

    it('can flag as preset', () => {
      expect(loader.resolveModuleConfigPath('foo', 'bar', true))
        .toBe(getModulePath('bar', 'config/foo.preset.js'));
    });

    it('can change the extension', () => {
      expect(loader.resolveModuleConfigPath('foo', 'bar', true, 'json'))
        .toBe(getModulePath('bar', 'config/foo.preset.json'));
    });
  });
});
