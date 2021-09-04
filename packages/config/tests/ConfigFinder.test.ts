import { Path } from '@boost/common';
import { mockFilePath, normalizeSeparators } from '@boost/common/test';
import { copyFixtureToTempFolder, getFixturePath } from '@boost/test-utils';
import { Cache } from '../src/Cache';
import { ConfigFinder } from '../src/ConfigFinder';
import { mockSystemPath } from './helpers';

describe('ConfigFinder', () => {
	let cache: Cache;
	let finder: ConfigFinder<{ debug: boolean }>;

	beforeEach(() => {
		cache = new Cache();
		finder = new ConfigFinder(
			{
				extendsSetting: 'extends',
				name: 'boost',
				overridesSetting: 'overrides',
			},
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
			const tempRoot = getFixturePath('config-package-file-tree-monorepo');

			const pkg1 = await finder.determinePackageScope(
				mockFilePath(`${tempRoot}/packages/core/src/index.ts`),
			);

			expect(pkg1).toEqual({ name: 'core' });

			const pkg2 = await finder.determinePackageScope(
				mockFilePath(`${tempRoot}/packages/log/src/index.js`),
			);

			expect(pkg2).toEqual({ name: 'log' });
		});

		it('returns the first parent `package.json` if there are multiple', async () => {
			const tempRoot = getFixturePath('config-package-file-tree-monorepo');

			const pkg = await finder.determinePackageScope(
				mockFilePath(`${tempRoot}/packages/plugin/nested/example/src`),
			);

			expect(pkg).toEqual({ name: 'plugin-example' });
		});

		it('returns root `package.json` if outside a monorepo', async () => {
			const tempRoot = getFixturePath('config-package-file-tree-monorepo');

			const pkg = await finder.determinePackageScope(mockFilePath(`${tempRoot}/index.ts`));

			expect(pkg).toEqual({ name: 'boost-config-package-file-tree-monorepo', version: '0.0.0' });
		});

		it('uses the cache for the same `package.json` parent', async () => {
			const tempRoot = getFixturePath('config-package-file-tree-monorepo');

			const pkg1 = await finder.determinePackageScope(
				mockFilePath(`${tempRoot}/packages/core/src/index.ts`),
			);
			const pkg2 = await finder.determinePackageScope(
				mockFilePath(`${tempRoot}/packages/core/src/deep/nested/core.ts`),
			);

			expect(pkg2).toEqual(pkg1);
		});

		it('caches each depth, even if a file is missing', async () => {
			const tempRoot = getFixturePath('config-package-file-tree-monorepo');

			await finder.determinePackageScope(
				mockFilePath(`${tempRoot}/packages/core/src/deep/nested/core.ts`),
			);

			expect(cache.fileContentCache).toEqual({
				[normalizeSeparators(`${tempRoot}/packages/core/package.json`)]: {
					content: { name: 'core' },
					exists: true,
					mtime: expect.any(Number),
				},
				[normalizeSeparators(`${tempRoot}/packages/core/src/package.json`)]: {
					content: null,
					exists: false,
					mtime: 0,
				},
				[normalizeSeparators(`${tempRoot}/packages/core/src/deep/package.json`)]: {
					content: null,
					exists: false,
					mtime: 0,
				},
				[normalizeSeparators(`${tempRoot}/packages/core/src/deep/nested/package.json`)]: {
					content: null,
					exists: false,
					mtime: 0,
				},
			});
		});

		it('errors if no parent `package.json`', async () => {
			const tempRoot = copyFixtureToTempFolder('config-root-without-package-json');

			await expect(
				finder.determinePackageScope(new Path(`${tempRoot}/nested/index.js`)),
			).rejects.toThrow('Unable to determine package scope. No parent `package.json` found.');
		});
	});

	describe('loadFromBranchToRoot()', () => {
		const fixtures = [
			{ ext: 'js', root: getFixturePath('config-file-tree-js') },
			{ ext: 'json', root: getFixturePath('config-file-tree-json') },
			{ ext: 'json5', root: getFixturePath('config-file-tree-json5') },
			{ ext: 'cjs', root: getFixturePath('config-file-tree-cjs') },
			// { ext: 'ts', root: getFixturePath('config-file-tree-ts')  },
			{ ext: 'yaml', root: getFixturePath('config-file-tree-yaml') },
			{ ext: 'yml', root: getFixturePath('config-file-tree-yml') },
		];

		fixtures.forEach(({ ext, root: tempRoot }) => {
			it(`returns all \`.${ext}\` config files from a branch up to root`, async () => {
				const files = await finder.loadFromBranchToRoot(`${tempRoot}/src/app/profiles/settings`);

				expect(files).toEqual([
					{
						config: { debug: true },
						path: mockSystemPath(`${tempRoot}/.config/boost.json`),
						source: 'root',
					},
					{
						config: { debug: false },
						path: mockSystemPath(`${tempRoot}/src/app/.boost.${ext}`),
						source: 'branch',
					},
					{
						config: { verbose: true },
						path: mockSystemPath(`${tempRoot}/src/app/profiles/settings/.boost.${ext}`),
						source: 'branch',
					},
				]);
			});
		});

		it('returns all config files for all types from a branch up to root', async () => {
			const tempRoot = getFixturePath('config-file-tree-all-types');

			const files = await finder.loadFromBranchToRoot(
				normalizeSeparators(`${tempRoot}/src/app/profiles/settings`),
			);

			expect(files).toEqual([
				{
					config: { debug: true },
					path: mockSystemPath(`${tempRoot}/.config/boost.json`),
					source: 'root',
				},
				{
					config: { type: 'json' },
					path: mockSystemPath(`${tempRoot}/src/.boost.json`),
					source: 'branch',
				},
				{
					config: { type: 'cjs' },
					path: mockSystemPath(`${tempRoot}/src/app/.boost.cjs`),
					source: 'branch',
				},
				{
					config: { type: 'js' },
					path: mockSystemPath(`${tempRoot}/src/app/profiles/.boost.js`),
					source: 'branch',
				},
				{
					config: { type: 'yaml' },
					path: mockSystemPath(`${tempRoot}/src/app/profiles/settings/.boost.yaml`),
					source: 'branch',
				},
			]);
		});

		it('doesnt load config files above root', async () => {
			const tempRoot = getFixturePath('config-scenario-configs-above-root');

			const files = await finder.loadFromBranchToRoot(
				normalizeSeparators(`${tempRoot}/nested/deep`),
			);

			expect(files).toEqual([
				{
					config: { root: true },
					path: mockSystemPath(`${tempRoot}/nested/.config/boost.json`),
					source: 'root',
				},
				{
					config: { aboveRoot: true },
					path: mockSystemPath(`${tempRoot}/nested/deep/.boost.json`),
					source: 'branch',
				},
			]);
		});

		it('doesnt load branch config files that do not start with a period', async () => {
			const tempRoot = getFixturePath('config-scenario-branch-invalid-file-name');

			const files = await finder.loadFromBranchToRoot(normalizeSeparators(`${tempRoot}/src/app`));

			expect(files).toEqual([
				{
					config: { debug: true },
					path: mockSystemPath(`${tempRoot}/.config/boost.json`),
					source: 'root',
				},
			]);
		});

		it('doesnt load branch config files that have an unknown extension', async () => {
			const tempRoot = getFixturePath('config-scenario-branch-invalid-file-name');

			const files = await finder.loadFromBranchToRoot(normalizeSeparators(`${tempRoot}/src/app`));

			expect(files).toEqual([
				{
					config: { debug: true },
					path: mockSystemPath(`${tempRoot}/.config/boost.json`),
					source: 'root',
				},
			]);
		});

		it('doesnt load multiple branch config file types, only the first  found', async () => {
			const tempRoot = getFixturePath('config-scenario-branch-multiple-types');

			const files = await finder.loadFromBranchToRoot(normalizeSeparators(`${tempRoot}/src/app`));

			expect(files).toEqual([
				{
					config: { debug: true },
					path: mockSystemPath(`${tempRoot}/.config/boost.json`),
					source: 'root',
				},
				{
					config: { type: 'json' },
					path: mockSystemPath(`${tempRoot}/src/app/.boost.json`),
					source: 'branch',
				},
			]);
		});

		describe('environment context', () => {
			it('loads branch config files (using BOOST_ENV)', async () => {
				process.env.BOOST_ENV = 'test';

				const tempRoot = getFixturePath('config-scenario-branch-with-envs');

				const files = await finder.loadFromBranchToRoot(normalizeSeparators(`${tempRoot}/src/app`));

				expect(files).toEqual([
					{
						config: { debug: true },
						path: mockSystemPath(`${tempRoot}/.config/boost.json`),
						source: 'root',
					},
					{
						config: { env: 'all' },
						path: mockSystemPath(`${tempRoot}/src/app/.boost.json`),
						source: 'branch',
					},
					{
						config: { env: 'test' },
						path: mockSystemPath(`${tempRoot}/src/app/.boost.test.json`),
						source: 'branch',
					},
				]);

				delete process.env.BOOST_ENV;
			});

			it('loads branch config files (using NODE_ENV)', async () => {
				process.env.NODE_ENV = 'staging';

				const tempRoot = getFixturePath('config-scenario-branch-with-envs');

				const files = await finder.loadFromBranchToRoot(normalizeSeparators(`${tempRoot}/src/app`));

				expect(files).toEqual([
					{
						config: { debug: true },
						path: mockSystemPath(`${tempRoot}/.config/boost.json`),
						source: 'root',
					},
					{
						config: { env: 'all' },
						path: mockSystemPath(`${tempRoot}/src/app/.boost.json`),
						source: 'branch',
					},
					{
						config: { env: 'staging' },
						path: mockSystemPath(`${tempRoot}/src/app/.boost.staging.json`),
						source: 'branch',
					},
				]);

				process.env.NODE_ENV = 'test';
			});

			it('doesnt load branch config files if `includeEnv` is false (using BOOST_ENV)', async () => {
				process.env.BOOST_ENV = 'test';

				const tempRoot = getFixturePath('config-scenario-branch-with-envs');

				finder.configure({ includeEnv: false });

				const files = await finder.loadFromBranchToRoot(normalizeSeparators(`${tempRoot}/src/app`));

				expect(files).toEqual([
					{
						config: { debug: true },
						path: mockSystemPath(`${tempRoot}/.config/boost.json`),
						source: 'root',
					},
					{
						config: { env: 'all' },
						path: mockSystemPath(`${tempRoot}/src/app/.boost.json`),
						source: 'branch',
					},
				]);

				delete process.env.BOOST_ENV;
			});
		});

		describe('overrides', () => {
			it('adds overrides that match the `include` glob', async () => {
				const tempRoot = getFixturePath('config-overrides-from-branch');

				const files = await finder.loadFromBranchToRoot(
					normalizeSeparators(`${tempRoot}/src/foo/does-match.ts`),
				);

				expect(files).toEqual([
					{
						config: { level: 1 },
						path: mockSystemPath(`${tempRoot}/.config/boost.json`),
						source: 'root',
					},
					{
						config: { level: 2 },
						path: mockSystemPath(`${tempRoot}/.config/boost.json`),
						source: 'overridden',
					},
				]);
			});

			it('adds overrides that match the `include` glob and dont match the `exclude` glob', async () => {
				const tempRoot = getFixturePath('config-overrides-from-branch-with-excludes');

				const files = await finder.loadFromBranchToRoot(
					normalizeSeparators(`${tempRoot}/src/bar.ts`),
				);

				expect(files).toEqual([
					{
						config: { level: 1 },
						path: mockSystemPath(`${tempRoot}/.config/boost.json`),
						source: 'root',
					},
					{
						config: { level: 2 },
						path: mockSystemPath(`${tempRoot}/.config/boost.json`),
						source: 'overridden',
					},
				]);
			});

			it('adds overrides using a custom settings name', async () => {
				const tempRoot = getFixturePath('config-overrides-custom-settings-name');

				finder.configure({ overridesSetting: 'rules' });

				const files = await finder.loadFromBranchToRoot(
					normalizeSeparators(`${tempRoot}/src/foo/does-match.ts`),
				);

				expect(files).toEqual([
					{
						config: { level: 1 },
						path: mockSystemPath(`${tempRoot}/.config/boost.json`),
						source: 'root',
					},
					{
						config: { level: 2 },
						path: mockSystemPath(`${tempRoot}/.config/boost.json`),
						source: 'overridden',
					},
				]);
			});

			it('doesnt add overrides that dont match the `include` glob', async () => {
				const tempRoot = getFixturePath('config-overrides-from-branch');

				const files = await finder.loadFromBranchToRoot(
					normalizeSeparators(`${tempRoot}/src/foo/doesnt-match.js`),
				);

				expect(files).toEqual([
					{
						config: { level: 1 },
						path: mockSystemPath(`${tempRoot}/.config/boost.json`),
						source: 'root',
					},
				]);
			});

			it('doesnt add overrides that match the `include` glob AND the `exclude` glob', async () => {
				const tempRoot = getFixturePath('config-overrides-from-branch-with-excludes');

				const files = await finder.loadFromBranchToRoot(
					normalizeSeparators(`${tempRoot}/src/baz.ts`),
				);

				expect(files).toEqual([
					{
						config: { level: 1 },
						path: mockSystemPath(`${tempRoot}/.config/boost.json`),
						source: 'root',
					},
				]);
			});

			it('errors if overrides are found in a branch config', async () => {
				const tempRoot = getFixturePath('config-invalid-branch-nested-overrides');

				await expect(
					finder.loadFromBranchToRoot(normalizeSeparators(`${tempRoot}/src`)),
				).rejects.toThrow('Overrides setting `overrides` must only be defined in a root config.');
			});
		});

		describe('extends', () => {
			it('extends configs using relative and absolute file paths', async () => {
				const tempRoot = getFixturePath('config-extends-fs-paths');

				const files = await finder.loadFromBranchToRoot(tempRoot);

				expect(files).toEqual([
					{
						config: { relative: true },
						path: mockSystemPath(`${tempRoot}/some/relative/path/config.js`),
						source: 'extended',
					},
					{
						config: { absolute: true },
						path: mockSystemPath(`${tempRoot}/some/absolute/path/config.yml`, false),
						source: 'extended',
					},
					{
						config: { root: true },
						path: mockSystemPath(`${tempRoot}/.config/boost.js`),
						source: 'root',
					},
				]);
			});

			it('extends config presets from node modules', async () => {
				const tempRoot = copyFixtureToTempFolder('config-extends-module-presets');

				finder.configure({
					resolver: (id) => normalizeSeparators(`${tempRoot}/node_modules/${id}`),
				});

				const files = await finder.loadFromBranchToRoot(tempRoot);

				expect(files).toEqual([
					{
						config: { name: 'foo' },
						path: mockSystemPath(`${tempRoot}/node_modules/foo/boost.preset.js`),
						source: 'extended',
					},
					{
						config: { name: '@scope/bar' },
						path: mockSystemPath(`${tempRoot}/node_modules/@scope/bar/boost.preset.js`),
						source: 'extended',
					},
					{
						config: { root: true },
						path: mockSystemPath(`${tempRoot}/.config/boost.json`),
						source: 'root',
					},
				]);
			});

			it('extends configs that were defined in an override', async () => {
				const tempRoot = getFixturePath('config-extends-from-override');

				const files = await finder.loadFromBranchToRoot(
					normalizeSeparators(`${tempRoot}/some/relative/path`),
				);

				expect(files).toEqual([
					{
						config: { extended: true },
						path: mockSystemPath(`${tempRoot}/some/relative/path/config.js`),
						source: 'extended',
					},
					{
						config: { root: true },
						path: mockSystemPath(`${tempRoot}/.config/boost.json`),
						source: 'root',
					},
					{
						config: { overridden: true },
						path: mockSystemPath(`${tempRoot}/.config/boost.json`),
						source: 'overridden',
					},
				]);
			});

			it('extends configs using a custom settings name', async () => {
				const tempRoot = copyFixtureToTempFolder('config-extends-custom-setting-name');

				finder.configure({
					resolver: (id) => normalizeSeparators(`${tempRoot}/node_modules/${id}`),
				});

				finder.configure({ extendsSetting: 'presets' });

				const files = await finder.loadFromBranchToRoot(tempRoot);

				expect(files).toEqual([
					{
						config: { type: 'module' },
						path: mockSystemPath(`${tempRoot}/node_modules/foo/boost.preset.js`),
						source: 'extended',
					},
					{
						config: { type: 'fs' },
						path: mockSystemPath(`${tempRoot}/some/relative/path/config.js`),
						source: 'extended',
					},
					{
						config: { root: true },
						path: mockSystemPath(`${tempRoot}/.config/boost.json`),
						source: 'root',
					},
				]);
			});

			it('errors if extends are found in a branch config', async () => {
				const tempRoot = getFixturePath('config-invalid-branch-nested-extends');

				await expect(
					finder.loadFromBranchToRoot(normalizeSeparators(`${tempRoot}/src`)),
				).rejects.toThrow('Extends setting `extends` must only be defined in a root config.');
			});

			it('errors for an invalid extends path', async () => {
				const tempRoot = getFixturePath('config-invalid-extends-path');

				await expect(finder.loadFromBranchToRoot(tempRoot)).rejects.toThrow(
					'Cannot extend configuration. Unknown module or file path "123!#?".',
				);
			});

			it('errors for a missing extends path', async () => {
				const tempRoot = getFixturePath('config-missing-extends-path');

				await expect(finder.loadFromBranchToRoot(tempRoot)).rejects.toThrow(
					'no such file or directory',
				);
			});
		});
	});

	describe('loadFromRoot()', () => {
		const fixtures = [
			{ ext: 'js', root: getFixturePath('config-root-config-js') },
			{ ext: 'json', root: getFixturePath('config-root-config-json') },
			{ ext: 'json5', root: getFixturePath('config-root-config-json5') },
			{ ext: 'cjs', root: getFixturePath('config-root-config-cjs') },
			// { ext: 'ts', root: getFixturePath('config-root-config-ts') },
			{ ext: 'yaml', root: getFixturePath('config-root-config-yaml') },
			{ ext: 'yml', root: getFixturePath('config-root-config-yml') },
		];

		fixtures.forEach(({ ext, root: tempRoot }) => {
			it(`returns \`.${ext}\` config file from root`, async () => {
				const files = await finder.loadFromRoot(tempRoot);

				expect(files).toEqual([
					{
						config: { debug: true },
						path: mockSystemPath(`${tempRoot}/.config/boost.${ext}`),
						source: 'root',
					},
				]);
			});
		});

		it('errors if not root folder', async () => {
			const tempRoot = getFixturePath('config-scenario-not-root');

			await expect(finder.loadFromRoot(tempRoot)).rejects.toThrow(
				'Invalid configuration root. Requires a `.config` folder and `package.json`.',
			);
		});

		it('errors if root folder is missing a `package.json`', async () => {
			const tempRoot = getFixturePath('config-root-without-package-json');

			await expect(finder.loadFromRoot(tempRoot)).rejects.toThrow(
				'Config folder `.config` found without a relative `package.json`. Both must be located in the project root.',
			);
		});

		it('errors for invalid config file/loader type', async () => {
			const tempRoot = getFixturePath('config-root-config-toml');

			finder.configure(
				// @ts-expect-error Invalid format
				{ extensions: ['toml'] },
			);

			await expect(finder.loadFromRoot(tempRoot)).rejects.toThrow(
				'Unsupported loader format "toml".',
			);
		});
	});
});
