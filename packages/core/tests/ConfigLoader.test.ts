import JSON5 from 'json5';
import { number } from 'optimal';
import { Path } from '@boost/common';
import {
  getFixturePath,
  getNodeModulePath,
  copyFixtureToNodeModule,
  createTempFileInFixture,
} from '@boost/test-utils';
import { mockTool, stubToolConfig, stubPackageJson, TestToolConfig } from '../src/testUtils';
import ConfigLoader from '../src/ConfigLoader';

function createJavascriptFile(data: any): string {
  return `module.exports = ${JSON5.stringify(data)};`;
}

describe('ConfigLoader', () => {
  let loader: ConfigLoader;
  let fixtures: (() => void)[] = [];
  const args = { $0: '', _: [] };

  beforeEach(() => {
    const tool = mockTool({
      root: getFixturePath('app'),
    });

    loader = new ConfigLoader(tool);

    fixtures = [];
  });

  afterEach(() => {
    fixtures.forEach(remove => remove());
  });

  describe('findConfigFromArg()', () => {
    it('returns null if falsy', () => {
      expect(loader.findConfigFromArg()).toBeNull();
      expect(loader.findConfigFromArg('')).toBeNull();
    });

    it('returns extends object if found', () => {
      expect(loader.findConfigFromArg('./some/path.js')).toEqual({
        extends: ['./some/path.js'],
      });
    });
  });

  describe('findConfigInPackageJSON()', () => {
    it('returns null if not found', () => {
      expect(loader.findConfigInPackageJSON(stubPackageJson())).toBeNull();
    });

    it('returns object if found', () => {
      expect(
        loader.findConfigInPackageJSON(
          stubPackageJson({
            // @ts-ignore Allow custom key
            testBoost: {
              foo: 'bar',
            },
          }),
        ),
      ).toEqual({
        foo: 'bar',
      });
    });

    it('returns extends object if a string is passed', () => {
      expect(
        loader.findConfigInPackageJSON(
          stubPackageJson({
            // @ts-ignore Allow custom key
            testBoost: './foo.json',
          }),
        ),
      ).toEqual({
        extends: ['./foo.json'],
      });
    });
  });

  describe('findConfigInLocalFiles()', () => {
    beforeEach(() => {
      loader.package = stubPackageJson({ name: 'foo' });
    });

    it('returns null when no files found', () => {
      expect(loader.findConfigInLocalFiles(getFixturePath('app-no-configs'))).toBeNull();
    });

    it('errors if too many files are found', () => {
      expect(() => {
        loader.findConfigInLocalFiles(getFixturePath('app-multi-configs'));
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns file path if found', () => {
      expect(loader.findConfigInLocalFiles(loader.tool.options.root)).toEqual(
        new Path(getFixturePath('app', './configs/testBoost.json')),
      );
    });
  });

  describe('findConfigInWorkspaceRoot()', () => {
    it('returns null if node modules path detected', () => {
      expect(loader.findConfigInWorkspaceRoot('/path/node_modules/path')).toBeNull();
    });

    it('returns null when no package.json found in the tree', () => {
      expect(loader.findConfigInWorkspaceRoot('/')).toBeNull();
    });

    it('returns null when workspace root found and pattern does not match', () => {
      expect(
        loader.findConfigInWorkspaceRoot(getFixturePath('workspace-mismatch', './packages/foo')),
      ).toBeNull();
    });

    it('returns null when workspace root found and no config file', () => {
      expect(
        loader.findConfigInWorkspaceRoot(getFixturePath('workspace-no-config', './packages/foo')),
      ).toBeNull();
    });

    it('returns null when no workspace root could be found', () => {
      expect(
        loader.findConfigInWorkspaceRoot(getFixturePath('workspace-no-packages', './packages/foo')),
      ).toBeNull();
    });

    it('loads config when using yarn workspaces (using config file)', () => {
      expect(
        loader.findConfigInWorkspaceRoot(getFixturePath('workspace-yarn', './packages/foo')),
      ).toEqual(new Path(getFixturePath('workspace-yarn', './configs/testBoost.js')));
    });

    it('loads config when using yarn workspaces with nohoist (using config file)', () => {
      expect(
        loader.findConfigInWorkspaceRoot(
          getFixturePath('workspace-yarn-nohoist', './packages/foo'),
        ),
      ).toEqual(new Path(getFixturePath('workspace-yarn-nohoist', './configs/testBoost.js')));
    });

    it('loads config when using lerna workspaces (using package.json)', () => {
      expect(
        loader.findConfigInWorkspaceRoot(getFixturePath('workspace-lerna', './packages/foo')),
      ).toEqual({ lerna: true });
    });

    it('sets workspace root if match found', () => {
      loader.findConfigInWorkspaceRoot(getFixturePath('workspace-yarn', './packages/foo'));

      expect(loader.workspaceRoot).toEqual(getFixturePath('workspace-yarn'));
    });
  });

  describe('inheritFromArgs()', () => {
    it('doesnt pass --config', () => {
      expect(
        loader.inheritFromArgs(
          {},
          {
            ...args,
            config: './some/path.js',
          },
        ),
      ).toEqual({});
    });

    it('doesnt pass --extends', () => {
      expect(
        loader.inheritFromArgs(
          {},
          {
            ...args,
            extends: './some/path.js',
          },
        ),
      ).toEqual({});
    });

    it('doesnt pass --settings', () => {
      expect(
        loader.inheritFromArgs(
          {},
          {
            ...args,
            settings: 'foo=bar',
          },
        ),
      ).toEqual({});
    });

    it('sets --reporter', () => {
      expect(
        loader.inheritFromArgs(
          {},
          {
            ...args,
            reporter: ['default'],
          },
        ),
      ).toEqual({
        reporters: ['default'],
      });
    });

    it('sets multiple --reporter', () => {
      expect(
        loader.inheritFromArgs(
          {},
          {
            ...args,
            reporter: ['default', 'other'],
          },
        ),
      ).toEqual({
        reporters: ['default', 'other'],
      });
    });

    it('merges --reporter', () => {
      expect(
        loader.inheritFromArgs(
          {
            reporters: ['base'],
          },
          {
            ...args,
            reporter: ['default', 'other'],
          },
        ),
      ).toEqual({
        reporters: ['base', 'default', 'other'],
      });
    });

    it('sets --plugin', () => {
      expect(
        loader.inheritFromArgs(
          {},
          {
            ...args,
            plugin: ['foo'],
          },
        ),
      ).toEqual({
        plugins: ['foo'],
      });
    });

    it('sets multiple --plugin', () => {
      expect(
        loader.inheritFromArgs(
          {},
          {
            ...args,
            plugin: ['foo', 'bar'],
          },
        ),
      ).toEqual({
        plugins: ['foo', 'bar'],
      });
    });

    it('merges --plugin', () => {
      expect(
        loader.inheritFromArgs(
          {
            plugins: ['baz'],
          },
          {
            ...args,
            plugin: ['foo', 'bar'],
          },
        ),
      ).toEqual({
        plugins: ['baz', 'foo', 'bar'],
      });
    });

    it('sets known key', () => {
      expect(
        loader.inheritFromArgs(
          {
            debug: true,
          },
          {
            ...args,
            debug: false,
          },
        ),
      ).toEqual({
        debug: false,
      });
    });

    it('doesnt set unknown key', () => {
      expect(
        loader.inheritFromArgs(
          {
            debug: true,
          },
          {
            ...args,
            debugger: false,
          },
        ),
      ).toEqual({
        debug: true,
      });
    });
  });

  describe('loadConfig()', () => {
    it('errors if package.json has not been loaded', () => {
      expect(() => {
        loader.loadConfig(args);
      }).toThrowErrorMatchingSnapshot();
    });

    describe('from --config option', () => {
      it('errors if invalid path', () => {
        loader.package = stubPackageJson({
          name: 'boost',
        });

        expect(() => {
          loader.loadConfig({
            ...args,
            config: './some/very/fake/path.js',
          });
        }).toThrow(
          `Preset configuration ${getFixturePath('app', 'some/very/fake/path.js')} does not exist.`,
        );
      });

      it('loads from passed file path', () => {
        loader.package = stubPackageJson({
          name: 'boost',
        });

        expect(
          loader.loadConfig({
            ...args,
            config: `${getFixturePath('app-js-config')}/configs/testBoost.js`,
          }),
        ).toEqual(expect.objectContaining({ foo: 'bar' }));
      });
    });

    describe('from package.json', () => {
      it('errors if not an object', () => {
        loader.package = stubPackageJson({
          name: 'boost',
          // @ts-ignore Allow custom key
          testBoost: [],
        });

        expect(() => {
          loader.loadConfig(args);
        }).toThrowErrorMatchingSnapshot();
      });

      it('supports an object', () => {
        loader.package = stubPackageJson({
          name: 'boost',
          // @ts-ignore Allow custom key
          testBoost: { locale: 'en' },
        });

        expect(loader.loadConfig(args)).toEqual(expect.objectContaining({ locale: 'en' }));
      });

      it('supports a string and converts it to `extends`', () => {
        fixtures.push(copyFixtureToNodeModule('preset', 'app', 'test-boost-preset'));

        loader.package = stubPackageJson({
          name: 'boost',
          // @ts-ignore Allow custom key
          testBoost: 'test-boost-preset',
        });

        expect(loader.loadConfig(args)).toEqual(
          expect.objectContaining({
            extends: [getNodeModulePath('app', 'test-boost-preset', 'configs/testBoost.preset.js')],
          }),
        );
      });

      it('merges with default config', () => {
        loader.package = stubPackageJson({
          name: 'boost',
          // @ts-ignore Allow custom key
          testBoost: { locale: 'en' },
        });

        expect(loader.loadConfig(args)).toEqual(
          stubToolConfig({
            locale: 'en',
          }),
        );
      });

      it('supports plugins', () => {
        loader.package = stubPackageJson({
          name: 'boost',
          // @ts-ignore Allow custom key
          testBoost: {
            plugins: [
              'foo',
              {
                plugin: 'bar',
                option: true,
              },
            ],
          },
        });

        expect(loader.loadConfig(args)).toEqual(
          stubToolConfig<TestToolConfig>({
            plugins: [
              'foo',
              {
                plugin: 'bar',
                option: true,
              },
            ],
          }),
        );
      });

      it('supports custom config blueprint', () => {
        loader.package = stubPackageJson({
          name: 'boost',
          // @ts-ignore Allow custom key
          testBoost: { foo: 'bar' },
        });

        loader.tool.options.configBlueprint = {
          foo: number(),
        };

        expect(() => {
          loader.loadConfig(args);
        }).toThrowErrorMatchingSnapshot();
      });

      it('supports custom settings blueprint', () => {
        loader.package = stubPackageJson({
          name: 'boost',
          // @ts-ignore Allow custom key
          testBoost: { settings: { foo: 'bar' } },
        });

        loader.tool.options.settingsBlueprint = {
          foo: number(),
        };

        expect(() => {
          loader.loadConfig(args);
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe('from config folder', () => {
      beforeEach(() => {
        loader.package = stubPackageJson({ name: 'foo' });
      });

      it('errors if no files found', () => {
        loader.tool.options.root = getFixturePath('app-no-configs');

        expect(() => {
          loader.loadConfig(args);
        }).toThrowErrorMatchingSnapshot();
      });

      it('errors if too many files are found', () => {
        loader.tool.options.root = getFixturePath('app-multi-configs');

        expect(() => {
          loader.loadConfig(args);
        }).toThrowErrorMatchingSnapshot();
      });

      it('supports .json files', () => {
        expect(loader.loadConfig(args)).toEqual(expect.objectContaining({ foo: 'bar' }));
      });

      it('supports .json5 files', () => {
        loader.tool.options.root = getFixturePath('app-json5-config');

        expect(loader.loadConfig(args)).toEqual(expect.objectContaining({ foo: 'bar' }));
      });

      it('supports .js files', () => {
        loader.tool.options.root = getFixturePath('app-js-config');

        expect(loader.loadConfig(args)).toEqual(expect.objectContaining({ foo: 'bar' }));
      });

      it('merges with default config', () => {
        expect(loader.loadConfig(args)).toEqual(
          stubToolConfig({
            // @ts-ignore Allow unknown
            foo: 'bar',
          }),
        );
      });

      it('supports plugins', () => {
        loader.tool.options.root = getFixturePath('app-plugin-config');

        expect(loader.loadConfig(args)).toEqual(
          stubToolConfig<TestToolConfig>({
            plugins: [
              'foo',
              {
                plugin: 'bar',
                option: true,
              },
            ],
          }),
        );
      });
    });
  });

  describe('loadPackageJSON()', () => {
    it('errors if no package.json exists in current working directory', () => {
      loader.tool.options.root = getFixturePath('app-no-configs');

      expect(() => {
        loader.loadPackageJSON();
      }).toThrowErrorMatchingSnapshot();
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
        // @ts-ignore Allow invalid type
        loader.parseAndExtend(123);
        // @ts-ignore Allow invalid type
        loader.parseAndExtend([]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if preset does not exist', () => {
      expect(() => {
        loader.parseAndExtend({ extends: ['./foo.json'] });
      }).toThrow(`Preset configuration ${getFixturePath('app', './foo.json')} does not exist.`);
    });

    it('errors if preset is not a file', () => {
      const curPath = new Path(__dirname).path();

      expect(() => {
        loader.parseAndExtend({ extends: [curPath] });
      }).toThrow(`Preset configuration ${curPath} must be a valid file.`);
    });

    it('parses a file path if a string is provided', () => {
      expect(
        loader.parseAndExtend(new Path(getFixturePath('app', 'configs/testBoost.json'))),
      ).toEqual({
        foo: 'bar',
      });
    });

    it('returns the config as is if no `extends`', () => {
      expect(loader.parseAndExtend({ foo: 'bar' })).toEqual({ foo: 'bar' });
    });

    it('returns the config if `extends` is empty', () => {
      expect(loader.parseAndExtend({ extends: [] })).toEqual({ extends: [] });
    });

    it('extends a preset and merges objects', () => {
      const presetPath = getFixturePath('preset', 'configs/testBoost.preset.js');

      expect(
        loader.parseAndExtend({
          foo: 'bar',
          extends: [presetPath],
        }),
      ).toEqual({
        foo: 'bar',
        preset: true,
        extends: [presetPath],
      });
    });

    it('extends multiple presets in order', () => {
      const presetFoo = getFixturePath('preset', 'configs/foo.preset.js');
      const presetBar = getFixturePath('preset', 'configs/bar.preset.js');
      const presetBaz = getFixturePath('preset', 'configs/baz.preset.js');

      expect(
        loader.parseAndExtend({
          extends: [presetFoo, presetBar, presetBaz],
        }),
      ).toEqual({
        foo: 1,
        bar: 2,
        baz: 3,
        extends: [presetFoo, presetBar, presetBaz],
      });
    });

    it('extends presets recursively', () => {
      fixtures.push(
        createTempFileInFixture(
          'app',
          'extend-recursive-a.json',
          JSON.stringify({ a: 1, extends: ['./extend-recursive-b.json'] }),
        ),
      );
      fixtures.push(
        createTempFileInFixture(
          'app',
          'extend-recursive-b.json',
          JSON.stringify({ b: 2, extends: ['./extend-recursive-c.json'] }),
        ),
      );
      fixtures.push(
        createTempFileInFixture('app', 'extend-recursive-c.json', JSON.stringify({ c: 3 })),
      );

      expect(
        loader.parseAndExtend({
          d: 4,
          extends: ['./extend-recursive-a.json'],
        }),
      ).toEqual({
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
      fixtures.push(
        createTempFileInFixture(
          'app',
          'extend-circular-a.json',
          JSON.stringify({ a: 1, extends: ['./extend-circular-b.json'] }),
        ),
      );
      fixtures.push(
        createTempFileInFixture(
          'app',
          'extend-circular-b.json',
          JSON.stringify({ b: 2, extends: ['./extend-circular-a.json'] }),
        ),
      );

      expect(
        loader.parseAndExtend({
          c: 3,
          extends: ['./extend-circular-a.json'],
        }),
      ).toEqual({
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
      fixtures.push(
        createTempFileInFixture(
          'app',
          'extend-merge-arrays.json',
          JSON.stringify({ list: ['foo', 'bar', 'baz'] }),
        ),
      );

      expect(
        loader.parseAndExtend({
          list: ['baz'],
          extends: ['./extend-merge-arrays.json'],
        }),
      ).toEqual({
        list: ['foo', 'bar', 'baz'],
        extends: [getFixturePath('app', './extend-merge-arrays.json')],
      });
    });

    it('merges objects', () => {
      fixtures.push(
        createTempFileInFixture(
          'app',
          'extend-merge-objects.json',
          JSON.stringify({ map: { foo: 123, bar: true } }),
        ),
      );

      expect(
        loader.parseAndExtend({
          map: { foo: 456, baz: 'wtf' },
          extends: ['./extend-merge-objects.json'],
        }),
      ).toEqual({
        map: { foo: 456, bar: true, baz: 'wtf' },
        extends: [getFixturePath('app', './extend-merge-objects.json')],
      });
    });
  });

  describe('parseFile()', () => {
    it('errors for an non-absolute path', () => {
      expect(() => {
        loader.parseFile('foo.json');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors for an unsupported file format', () => {
      expect(() => {
        loader.parseFile(getFixturePath('app', 'foo.txt'));
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if an object is not returned', () => {
      fixtures.push(createTempFileInFixture('app', 'bool.json', JSON.stringify(true)));
      fixtures.push(createTempFileInFixture('app', 'number.json', JSON.stringify(123)));
      fixtures.push(createTempFileInFixture('app', 'string.json', JSON.stringify('foo')));
      fixtures.push(createTempFileInFixture('app', 'array.json', JSON.stringify([])));

      expect(() => {
        loader.parseFile(getFixturePath('app', 'bool.json'));
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        loader.parseFile(getFixturePath('app', 'number.json'));
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        loader.parseFile(getFixturePath('app', 'string.json'));
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        loader.parseFile(getFixturePath('app', 'array.json'));
      }).toThrowErrorMatchingSnapshot();
    });

    it('parses .json files', () => {
      fixtures.push(createTempFileInFixture('app', 'test.json', JSON.stringify({ name: 'foo' })));

      expect(loader.parseFile(getFixturePath('app', 'test.json'))).toEqual({ name: 'foo' });
    });

    it('parses .json files in JSON5 format', () => {
      fixtures.push(createTempFileInFixture('app', 'test.json', JSON5.stringify({ name: 'foo' })));

      expect(loader.parseFile(getFixturePath('app', 'test.json'))).toEqual({ name: 'foo' });
    });

    it('parses .json5 files', () => {
      fixtures.push(createTempFileInFixture('app', 'test.json5', JSON5.stringify({ name: 'foo' })));

      expect(loader.parseFile(getFixturePath('app', 'test.json5'))).toEqual({ name: 'foo' });
    });

    it('parses .js files', () => {
      fixtures.push(
        createTempFileInFixture('app', 'test.js', createJavascriptFile({ name: 'foo' })),
      );

      expect(loader.parseFile(getFixturePath('app', 'test.js'))).toEqual({ name: 'foo' });
    });

    it('parses .js files and handles babel default exports', () => {
      fixtures.push(
        createTempFileInFixture(
          'app',
          'test-default.js',
          createJavascriptFile({
            __esModule: true,
            default: { name: 'foo' },
          }),
        ),
      );

      expect(loader.parseFile(getFixturePath('app', 'test-default.js'))).toEqual({ name: 'foo' });
    });

    it('parses .js files that return functions', () => {
      fixtures.push(
        createTempFileInFixture(
          'app',
          'test-func.js',
          'module.exports = () => { return { name: "foo" }; };',
        ),
      );

      expect(loader.parseFile(getFixturePath('app', 'test-func.js'))).toEqual({ name: 'foo' });
    });

    it('parses .js files that return functions with options passed', () => {
      fixtures.push(
        createTempFileInFixture(
          'app',
          'test-func-opts.js',
          'module.exports = (opts, count) => Object.assign({ name: "foo", count }, opts);',
        ),
      );

      expect(
        loader.parseFile(getFixturePath('app', 'test-func-opts.js'), [{ version: 1 }, 123]),
      ).toEqual({
        name: 'foo',
        count: 123,
        version: 1,
      });
    });

    it('errors if a function is returned and `errorOnFunction` is try', () => {
      fixtures.push(
        createTempFileInFixture(
          'app',
          'test-func.js',
          'module.exports = () => { return { name: "foo" }; };',
        ),
      );

      expect(() => {
        loader.parseFile(getFixturePath('app', 'test-func.js'), [], { errorOnFunction: true });
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe('resolveExtendPaths()', () => {
    it('errors if `extends` value is not a string', () => {
      expect(() => {
        // @ts-ignore
        loader.resolveExtendPaths([123]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors for an invalid extend path', () => {
      expect(() => {
        loader.resolveExtendPaths(['FooBarBaz']);
      }).toThrowErrorMatchingSnapshot();
    });

    it('supports multiple string values using an array', () => {
      expect(loader.resolveExtendPaths(['foo-bar', 'plugin:foo'])).toEqual(
        [
          getNodeModulePath('app', 'foo-bar', 'configs/testBoost.preset.js'),
          getNodeModulePath('app', 'test-boost-plugin-foo', 'configs/testBoost.preset.js'),
        ].map(Path.create),
      );
    });

    it('resolves absolute paths', () => {
      const absPath = getFixturePath('app', 'absolute/file.json');

      expect(loader.resolveExtendPaths([absPath])).toEqual([absPath].map(Path.create));
    });

    it('resolves relative paths', () => {
      expect(loader.resolveExtendPaths(['./relative/file.json'])).toEqual(
        [getFixturePath('app', './relative/file.json')].map(Path.create),
      );
    });

    it('resolves node modules', () => {
      expect(loader.resolveExtendPaths(['foo-bar'])).toEqual(
        [getNodeModulePath('app', 'foo-bar', 'configs/testBoost.preset.js')].map(Path.create),
      );
    });

    it('resolves node modules with a scoped', () => {
      expect(loader.resolveExtendPaths(['@ns/foo-bar'])).toEqual(
        [getNodeModulePath('app', '@ns/foo-bar', 'configs/testBoost.preset.js')].map(Path.create),
      );
    });

    it('resolves plugins', () => {
      expect(loader.resolveExtendPaths(['plugin:foo'])).toEqual(
        [getNodeModulePath('app', 'test-boost-plugin-foo', 'configs/testBoost.preset.js')].map(
          Path.create,
        ),
      );
    });

    it('resolves plugins with scoped', () => {
      loader.tool.options.scoped = true;

      expect(loader.resolveExtendPaths(['plugin:foo'])).toEqual(
        [getNodeModulePath('app', '@test-boost/plugin-foo', 'configs/testBoost.preset.js')].map(
          Path.create,
        ),
      );
    });

    it('resolves plugins using their full name', () => {
      expect(loader.resolveExtendPaths(['test-boost-plugin-foo'])).toEqual(
        [getNodeModulePath('app', 'test-boost-plugin-foo', 'configs/testBoost.preset.js')].map(
          Path.create,
        ),
      );
    });

    it('resolves plugins using their full namepaced name', () => {
      expect(loader.resolveExtendPaths(['@ns/test-test-boost-plugin-foo'])).toEqual(
        [
          getNodeModulePath('app', '@ns/test-test-boost-plugin-foo', 'configs/testBoost.preset.js'),
        ].map(Path.create),
      );
    });
  });

  describe('resolveModuleConfigPath()', () => {
    it('returns file path with correct naming', () => {
      expect(loader.resolveModuleConfigPath('foo', 'bar')).toEqual(
        new Path(getNodeModulePath('app', 'bar', 'configs/foo.js')),
      );
    });

    it('can flag as preset', () => {
      expect(loader.resolveModuleConfigPath('foo', 'bar', true)).toEqual(
        new Path(getNodeModulePath('app', 'bar', 'configs/foo.preset.js')),
      );
    });

    it('can change the extension', () => {
      expect(loader.resolveModuleConfigPath('foo', 'bar', true, 'json')).toEqual(
        new Path(getNodeModulePath('app', 'bar', 'configs/foo.preset.json')),
      );
    });
  });
});
