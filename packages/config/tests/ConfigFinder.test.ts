import { Path } from '@boost/common';
import { createTempFolderStructureFromJSON } from '@boost/test-utils';
import Cache from '../src/Cache';
import ConfigFinder from '../src/ConfigFinder';
import { rootWithoutPackageJson } from './__fixtures__/common-fs';
import {
  configFileTreeAllTypes,
  configFileTreeCJS,
  configFileTreeJS,
  configFileTreeJSON,
  configFileTreeJSON5,
  // configFileTreeTS,
  configFileTreeYAML,
  configFileTreeYML,
  extendsCustomSettingName,
  extendsFromOverride,
  extendsFsPaths,
  extendsModulePresets,
  invalidBranchNestedExtends,
  invalidBranchNestedOverrides,
  invalidExtendsPath,
  missingExtendsPath,
  overridesCustomSettingsName,
  overridesFromBranch,
  overridesFromBranchWithExcludes,
  packageFileTreeMonorepo,
  rootConfigCJS,
  rootConfigJS,
  // rootConfigMjs,
  rootConfigJSON,
  rootConfigJSON5,
  rootConfigTOML,
  // rootConfigTS,
  rootConfigYAML,
  rootConfigYML,
  scenarioBranchInvalidFileName,
  scenarioBranchMultipleTypes,
  scenarioBranchWithEnvs,
  scenarioConfigsAboveRoot,
} from './__fixtures__/config-files-fs';
import { stubPath } from './helpers';

describe('ConfigFinder', () => {
  let cache: Cache;
  let finder: ConfigFinder<{ debug: boolean }>;

  beforeEach(() => {
    cache = new Cache();
    finder = new ConfigFinder(
      { extendsSetting: 'extends', name: 'boost', overridesSetting: 'overrides' },
      cache,
    );
  });

  it('errors if name is not in camel case', () => {
    expect(() => {
      finder = new ConfigFinder({ name: 'Boosty Boost' }, cache);
    }).toThrow(
      'Invalid ConfigFinder field "name". String must be in camel case. (pattern "^[a-z][0-9A-Za-z]+$")',
    );
  });

  describe('determinePackageScope()', () => {
    it('returns the parent `package.json`', async () => {
      const tempRoot = createTempFolderStructureFromJSON(packageFileTreeMonorepo);

      const pkg1 = await finder.determinePackageScope(
        new Path(`${tempRoot}/packages/core/src/index.ts`),
      );

      expect(pkg1).toEqual({ name: 'core' });

      const pkg2 = await finder.determinePackageScope(
        new Path(`${tempRoot}/packages/log/lib/index.js`),
      );

      expect(pkg2).toEqual({ name: 'log' });
    });

    it('returns the first parent `package.json` if there are multiple', async () => {
      const tempRoot = createTempFolderStructureFromJSON(packageFileTreeMonorepo);

      const pkg = await finder.determinePackageScope(
        new Path(`${tempRoot}/packages/plugin/nested/example/src`),
      );

      expect(pkg).toEqual({ name: 'plugin-example' });
    });

    it('returns root `package.json` if outside a monorepo', async () => {
      const tempRoot = createTempFolderStructureFromJSON(packageFileTreeMonorepo);

      const pkg = await finder.determinePackageScope(new Path(`${tempRoot}/index.ts`));

      expect(pkg).toEqual({ name: 'boost-config-example', version: '0.0.0' });
    });

    it('uses the cache for the same `package.json` parent', async () => {
      const tempRoot = createTempFolderStructureFromJSON(packageFileTreeMonorepo);

      const pkg1 = await finder.determinePackageScope(
        new Path(`${tempRoot}/packages/core/src/index.ts`),
      );
      const pkg2 = await finder.determinePackageScope(
        new Path(`${tempRoot}/packages/core/src/deep/nested/core.ts`),
      );

      expect(pkg2).toEqual(pkg1);
    });

    it('caches each depth, even if a file is missing', async () => {
      const tempRoot = createTempFolderStructureFromJSON(packageFileTreeMonorepo);

      await finder.determinePackageScope(
        new Path(`${tempRoot}/packages/core/src/deep/nested/core.ts`),
      );

      expect(cache.fileContentCache).toEqual({
        [`${tempRoot}/packages/core/package.json`]: {
          content: { name: 'core' },
          exists: true,
          mtime: expect.any(Number),
        },
        [`${tempRoot}/packages/core/src/package.json`]: {
          content: null,
          exists: false,
          mtime: 0,
        },
        [`${tempRoot}/packages/core/src/deep/package.json`]: {
          content: null,
          exists: false,
          mtime: 0,
        },
        [`${tempRoot}/packages/core/src/deep/nested/package.json`]: {
          content: null,
          exists: false,
          mtime: 0,
        },
      });
    });

    it('errors if no parent `package.json`', async () => {
      const tempRoot = createTempFolderStructureFromJSON({ 'index.js': '' });

      await expect(finder.determinePackageScope(new Path(`${tempRoot}/index.js`))).rejects.toThrow(
        'Unable to determine package scope. No parent `package.json` found.',
      );
    });
  });

  describe('loadFromBranchToRoot()', () => {
    const fixtures = [
      { ext: 'js', tree: configFileTreeJS },
      { ext: 'json', tree: configFileTreeJSON },
      { ext: 'json5', tree: configFileTreeJSON5 },
      { ext: 'cjs', tree: configFileTreeCJS },
      // { ext: 'ts', tree: configFileTreeTS },
      { ext: 'yaml', tree: configFileTreeYAML },
      { ext: 'yml', tree: configFileTreeYML },
    ];

    fixtures.forEach(({ ext, tree }) => {
      it(`returns all \`.${ext}\` config files from a branch up to root`, async () => {
        const tempRoot = createTempFolderStructureFromJSON(tree);

        const files = await finder.loadFromBranchToRoot(`${tempRoot}/src/app/profiles/settings`);

        expect(files).toEqual([
          {
            config: { debug: true },
            path: stubPath(`${tempRoot}/.config/boost.json`),
            source: 'root',
          },
          {
            config: { debug: false },
            path: stubPath(`${tempRoot}/src/app/.boost.${ext}`),
            source: 'branch',
          },
          {
            config: { verbose: true },
            path: stubPath(`${tempRoot}/src/app/profiles/settings/.boost.${ext}`),
            source: 'branch',
          },
        ]);
      });
    });

    it('returns all config files for all types from a branch up to root', async () => {
      const tempRoot = createTempFolderStructureFromJSON(configFileTreeAllTypes);

      const files = await finder.loadFromBranchToRoot(`${tempRoot}/src/app/profiles/settings`);

      expect(files).toEqual([
        {
          config: { debug: true },
          path: stubPath(`${tempRoot}/.config/boost.json`),
          source: 'root',
        },
        {
          config: { type: 'json' },
          path: stubPath(`${tempRoot}/src/.boost.json`),
          source: 'branch',
        },
        {
          config: { type: 'cjs' },
          path: stubPath(`${tempRoot}/src/app/.boost.cjs`),
          source: 'branch',
        },
        {
          config: { type: 'js' },
          path: stubPath(`${tempRoot}/src/app/profiles/.boost.js`),
          source: 'branch',
        },
        {
          config: { type: 'yaml' },
          path: stubPath(`${tempRoot}/src/app/profiles/settings/.boost.yaml`),
          source: 'branch',
        },
      ]);
    });

    it('doesnt load config files above root', async () => {
      const tempRoot = createTempFolderStructureFromJSON(scenarioConfigsAboveRoot);

      const files = await finder.loadFromBranchToRoot(`${tempRoot}/nested/deep`);

      expect(files).toEqual([
        {
          config: { root: true },
          path: stubPath(`${tempRoot}/nested/.config/boost.json`),
          source: 'root',
        },
        {
          config: { aboveRoot: true },
          path: stubPath(`${tempRoot}/nested/deep/.boost.json`),
          source: 'branch',
        },
      ]);
    });

    it('doesnt load branch config files that do not start with a period', async () => {
      const tempRoot = createTempFolderStructureFromJSON(scenarioBranchInvalidFileName);

      const files = await finder.loadFromBranchToRoot(`${tempRoot}/src/app`);

      expect(files).toEqual([
        {
          config: { debug: true },
          path: stubPath(`${tempRoot}/.config/boost.json`),
          source: 'root',
        },
      ]);
    });

    it('doesnt load branch config files that have an unknown extension', async () => {
      const tempRoot = createTempFolderStructureFromJSON(scenarioBranchInvalidFileName);

      const files = await finder.loadFromBranchToRoot(`${tempRoot}/src/app`);

      expect(files).toEqual([
        {
          config: { debug: true },
          path: stubPath(`${tempRoot}/.config/boost.json`),
          source: 'root',
        },
      ]);
    });

    it('doesnt load multiple branch config file types, only the first  found', async () => {
      const tempRoot = createTempFolderStructureFromJSON(scenarioBranchMultipleTypes);

      const files = await finder.loadFromBranchToRoot(`${tempRoot}/src/app`);

      expect(files).toEqual([
        {
          config: { debug: true },
          path: stubPath(`${tempRoot}/.config/boost.json`),
          source: 'root',
        },
        {
          config: { type: 'json' },
          path: stubPath(`${tempRoot}/src/app/.boost.json`),
          source: 'branch',
        },
      ]);
    });

    describe('environment context', () => {
      it('loads branch config files (using BOOST_ENV)', async () => {
        process.env.BOOST_ENV = 'test';

        const tempRoot = createTempFolderStructureFromJSON(scenarioBranchWithEnvs);

        const files = await finder.loadFromBranchToRoot(`${tempRoot}/src/app`);

        expect(files).toEqual([
          {
            config: { debug: true },
            path: stubPath(`${tempRoot}/.config/boost.json`),
            source: 'root',
          },
          {
            config: { env: 'all' },
            path: stubPath(`${tempRoot}/src/app/.boost.json`),
            source: 'branch',
          },
          {
            config: { env: 'test' },
            path: stubPath(`${tempRoot}/src/app/.boost.test.json`),
            source: 'branch',
          },
        ]);

        delete process.env.BOOST_ENV;
      });

      it('loads branch config files (using NODE_ENV)', async () => {
        process.env.NODE_ENV = 'staging';

        const tempRoot = createTempFolderStructureFromJSON(scenarioBranchWithEnvs);

        const files = await finder.loadFromBranchToRoot(`${tempRoot}/src/app`);

        expect(files).toEqual([
          {
            config: { debug: true },
            path: stubPath(`${tempRoot}/.config/boost.json`),
            source: 'root',
          },
          {
            config: { env: 'all' },
            path: stubPath(`${tempRoot}/src/app/.boost.json`),
            source: 'branch',
          },
          {
            config: { env: 'staging' },
            path: stubPath(`${tempRoot}/src/app/.boost.staging.json`),
            source: 'branch',
          },
        ]);

        process.env.NODE_ENV = 'test';
      });

      it('doesnt load branch config files if `includeEnv` is false (using BOOST_ENV)', async () => {
        process.env.BOOST_ENV = 'test';

        const tempRoot = createTempFolderStructureFromJSON(scenarioBranchWithEnvs);

        finder.configure({ includeEnv: false });

        const files = await finder.loadFromBranchToRoot(`${tempRoot}/src/app`);

        expect(files).toEqual([
          {
            config: { debug: true },
            path: stubPath(`${tempRoot}/.config/boost.json`),
            source: 'root',
          },
          {
            config: { env: 'all' },
            path: stubPath(`${tempRoot}/src/app/.boost.json`),
            source: 'branch',
          },
        ]);

        delete process.env.BOOST_ENV;
      });
    });

    describe('overrides', () => {
      it('adds overrides that match the `include` glob', async () => {
        const tempRoot = createTempFolderStructureFromJSON(overridesFromBranch);

        const files = await finder.loadFromBranchToRoot(`${tempRoot}/src/foo/does-match.ts`);

        expect(files).toEqual([
          {
            config: { level: 1 },
            path: stubPath(`${tempRoot}/.config/boost.json`),
            source: 'root',
          },
          {
            config: { level: 2 },
            path: stubPath(`${tempRoot}/.config/boost.json`),
            source: 'overridden',
          },
        ]);
      });

      it('adds overrides that match the `include` glob and dont match the `exclude` glob', async () => {
        const tempRoot = createTempFolderStructureFromJSON(overridesFromBranchWithExcludes);

        const files = await finder.loadFromBranchToRoot(`${tempRoot}/src/bar.ts`);

        expect(files).toEqual([
          {
            config: { level: 1 },
            path: stubPath(`${tempRoot}/.config/boost.json`),
            source: 'root',
          },
          {
            config: { level: 2 },
            path: stubPath(`${tempRoot}/.config/boost.json`),
            source: 'overridden',
          },
        ]);
      });

      it('adds overrides using a custom settings name', async () => {
        const tempRoot = createTempFolderStructureFromJSON(overridesCustomSettingsName);

        finder.configure({ overridesSetting: 'rules' });

        const files = await finder.loadFromBranchToRoot(`${tempRoot}/src/foo/does-match.ts`);

        expect(files).toEqual([
          {
            config: { level: 1 },
            path: stubPath(`${tempRoot}/.config/boost.json`),
            source: 'root',
          },
          {
            config: { level: 2 },
            path: stubPath(`${tempRoot}/.config/boost.json`),
            source: 'overridden',
          },
        ]);
      });

      it('doesnt add overrides that dont match the `include` glob', async () => {
        const tempRoot = createTempFolderStructureFromJSON(overridesFromBranch);

        const files = await finder.loadFromBranchToRoot(`${tempRoot}/src/foo/doesnt-match.js`);

        expect(files).toEqual([
          {
            config: { level: 1 },
            path: stubPath(`${tempRoot}/.config/boost.json`),
            source: 'root',
          },
        ]);
      });

      it('doesnt add overrides that match the `include` glob AND the `exclude` glob', async () => {
        const tempRoot = createTempFolderStructureFromJSON(overridesFromBranchWithExcludes);

        const files = await finder.loadFromBranchToRoot(`${tempRoot}/src/baz.ts`);

        expect(files).toEqual([
          {
            config: { level: 1 },
            path: stubPath(`${tempRoot}/.config/boost.json`),
            source: 'root',
          },
        ]);
      });

      it('errors if overrides are found in a branch config', async () => {
        const tempRoot = createTempFolderStructureFromJSON(invalidBranchNestedOverrides);

        await expect(finder.loadFromBranchToRoot(`${tempRoot}/src`)).rejects.toThrow(
          'Overrides setting `overrides` must only be defined in a root config.',
        );
      });
    });

    describe('extends', () => {
      it('extends configs using relative and absolute file paths', async () => {
        const tempRoot = createTempFolderStructureFromJSON(extendsFsPaths);

        const files = await finder.loadFromBranchToRoot(tempRoot);

        expect(files).toEqual([
          {
            config: { relative: true },
            path: stubPath(`${tempRoot}/some/relative/path/config.js`),
            source: 'extended',
          },
          {
            config: { absolute: true },
            path: stubPath(`${tempRoot}/some/absolute/path/config.yml`, false),
            source: 'extended',
          },
          {
            config: { root: true },
            path: stubPath(`${tempRoot}/.config/boost.json`),
            source: 'root',
          },
        ]);
      });

      it('extends config presets from node modules', async () => {
        const tempRoot = createTempFolderStructureFromJSON(extendsModulePresets);

        const files = await finder.loadFromBranchToRoot(tempRoot);

        expect(files).toEqual([
          {
            config: { name: 'foo' },
            path: stubPath(`${tempRoot}/node_modules/foo/boost.preset.js`),
            source: 'extended',
          },
          {
            config: { name: '@scope/bar' },
            path: stubPath(`${tempRoot}/node_modules/@scope/bar/boost.preset.js`),
            source: 'extended',
          },
          {
            config: { root: true },
            path: stubPath(`${tempRoot}/.config/boost.json`),
            source: 'root',
          },
        ]);
      });

      it('extends configs that were defined in an override', async () => {
        const tempRoot = createTempFolderStructureFromJSON(extendsFromOverride);

        const files = await finder.loadFromBranchToRoot(`${tempRoot}/some/relative/path`);

        expect(files).toEqual([
          {
            config: { extended: true },
            path: stubPath(`${tempRoot}/some/relative/path/config.js`),
            source: 'extended',
          },
          {
            config: { root: true },
            path: stubPath(`${tempRoot}/.config/boost.json`),
            source: 'root',
          },
          {
            config: { overridden: true },
            path: stubPath(`${tempRoot}/.config/boost.json`),
            source: 'overridden',
          },
        ]);
      });

      it('extends configs using a custom settings name', async () => {
        const tempRoot = createTempFolderStructureFromJSON(extendsCustomSettingName);

        finder.configure({ extendsSetting: 'presets' });

        const files = await finder.loadFromBranchToRoot(tempRoot);

        expect(files).toEqual([
          {
            config: { type: 'module' },
            path: stubPath(`${tempRoot}/node_modules/foo/boost.preset.js`),
            source: 'extended',
          },
          {
            config: { type: 'fs' },
            path: stubPath(`${tempRoot}/some/relative/path/config.js`),
            source: 'extended',
          },
          {
            config: { root: true },
            path: stubPath(`${tempRoot}/.config/boost.json`),
            source: 'root',
          },
        ]);
      });

      it('errors if extends are found in a branch config', async () => {
        const tempRoot = createTempFolderStructureFromJSON(invalidBranchNestedExtends);

        await expect(finder.loadFromBranchToRoot(`${tempRoot}/src`)).rejects.toThrow(
          'Extends setting `extends` must only be defined in a root config.',
        );
      });

      it('errors for an invalid extends path', async () => {
        const tempRoot = createTempFolderStructureFromJSON(invalidExtendsPath);

        await expect(finder.loadFromBranchToRoot(tempRoot)).rejects.toThrow(
          'Cannot extend configuration. Unknown module or file path "123!#?".',
        );
      });

      it('errors for a missing extends path', async () => {
        const tempRoot = createTempFolderStructureFromJSON(missingExtendsPath);

        await expect(finder.loadFromBranchToRoot(tempRoot)).rejects.toThrow(
          'no such file or directory',
        );
      });
    });
  });

  describe('loadFromRoot()', () => {
    const fixtures = [
      { ext: 'js', tree: rootConfigJS },
      { ext: 'json', tree: rootConfigJSON },
      { ext: 'json5', tree: rootConfigJSON5 },
      { ext: 'cjs', tree: rootConfigCJS },
      // { ext: 'ts', tree: rootConfigTS },
      { ext: 'yaml', tree: rootConfigYAML },
      { ext: 'yml', tree: rootConfigYML },
    ];

    fixtures.forEach(({ ext, tree }) => {
      it(`returns \`.${ext}\` config file from root`, async () => {
        const tempRoot = createTempFolderStructureFromJSON(tree);

        const files = await finder.loadFromRoot(tempRoot);

        expect(files).toEqual([
          {
            config: { debug: true },
            path: stubPath(`${tempRoot}/.config/boost.${ext}`),
            source: 'root',
          },
        ]);
      });
    });

    it('errors if not root folder', async () => {
      const tempRoot = createTempFolderStructureFromJSON({ './src': '' });

      await expect(finder.loadFromRoot(`${tempRoot}/src`)).rejects.toThrow(
        'Invalid configuration root. Requires a `.config` folder and `package.json`.',
      );
    });

    it('errors if root folder is missing a `package.json`', async () => {
      const tempRoot = createTempFolderStructureFromJSON(rootWithoutPackageJson);

      await expect(finder.loadFromRoot(tempRoot)).rejects.toThrow(
        'Config folder `.config` found without a relative `package.json`. Both must be located in the project root.',
      );
    });

    it('errors for invalid config file/loader type', async () => {
      const tempRoot = createTempFolderStructureFromJSON(rootConfigTOML);

      finder.configure(
        // @ts-expect-error
        { extensions: ['toml'] },
      );

      await expect(finder.loadFromRoot(tempRoot)).rejects.toThrow(
        'Unsupported loader format "toml".',
      );
    });
  });
});
