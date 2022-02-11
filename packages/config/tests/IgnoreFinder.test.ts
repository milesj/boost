import { EOL } from 'os';
import { normalizeSeparators } from '@boost/common/test';
import { getFixturePath } from '@boost/test-utils';
import { Cache } from '../src/Cache';
import { IgnoreFinder } from '../src/IgnoreFinder';
import { mockSystemPath } from './helpers';

describe('IgnoreFinder', () => {
	let cache: Cache;
	let finder: IgnoreFinder;

	beforeEach(() => {
		cache = new Cache();
		finder = new IgnoreFinder({ name: 'boost' }, cache);
	});

	it('errors if name is not in camel case', () => {
		expect(() => {
			finder = new IgnoreFinder({ name: 'Boosty Boost' }, cache);
		}).toThrowErrorMatchingSnapshot();
	});

	it('caches root, file, and directory information', async () => {
		const tempRoot = getFixturePath('config-ignore-file-tree');

		await finder.loadFromBranchToRoot(
			normalizeSeparators(`${tempRoot}/src/app/feature/signup/flow`),
		);

		expect(cache.rootDir).toEqual(mockSystemPath(tempRoot));
		expect(cache.configDir).toEqual(mockSystemPath(`${tempRoot}/.config`));
		expect(cache.pkgPath).toEqual(mockSystemPath(`${tempRoot}/package.json`));
		expect(cache.fileContentCache).toEqual({
			[mockSystemPath(`${tempRoot}/.boostignore`).path()]: {
				content: `*.log${EOL}*.lock`,
				exists: true,
				mtime: expect.any(Number),
			},
			[mockSystemPath(`${tempRoot}/src/app/feature/.boostignore`).path()]: {
				content: `# Compiled${EOL}lib/`,
				exists: true,
				mtime: expect.any(Number),
			},
			[mockSystemPath(`${tempRoot}/src/app/feature/signup/.boostignore`).path()]: {
				content: '# Empty',
				exists: true,
				mtime: expect.any(Number),
			},
		});
	});

	describe('loadFromBranchToRoot()', () => {
		it('returns all ignore files from a target file', async () => {
			const tempRoot = getFixturePath('config-ignore-file-tree');

			const files = await finder.loadFromBranchToRoot(
				normalizeSeparators(`${tempRoot}/src/app/components/build/Button.tsx`),
			);

			expect(files).toEqual([
				{
					ignore: ['*.log', '*.lock'],
					path: mockSystemPath(`${tempRoot}/.boostignore`),
					source: 'root',
				},
				{
					ignore: ['esm/'],
					path: mockSystemPath(`${tempRoot}/src/app/components/build/.boostignore`),
					source: 'branch',
				},
			]);
		});

		it('returns all ignore files from a target folder', async () => {
			const tempRoot = getFixturePath('config-ignore-file-tree');

			const files = await finder.loadFromBranchToRoot(
				normalizeSeparators(`${tempRoot}/src/app/feature/signup/flow/`),
			);

			expect(files).toEqual([
				{
					ignore: ['*.log', '*.lock'],
					path: mockSystemPath(`${tempRoot}/.boostignore`),
					source: 'root',
				},
				{
					ignore: ['lib/'],
					path: mockSystemPath(`${tempRoot}/src/app/feature/.boostignore`),
					source: 'branch',
				},
				{
					ignore: [],
					path: mockSystemPath(`${tempRoot}/src/app/feature/signup/.boostignore`),
					source: 'branch',
				},
			]);
		});
	});

	describe('loadFromRoot()', () => {
		it('returns ignore file from root folder', async () => {
			const tempRoot = getFixturePath('config-ignore-file-tree');

			const files = await finder.loadFromRoot(tempRoot);

			expect(files).toEqual([
				{
					ignore: ['*.log', '*.lock'],
					path: mockSystemPath(`${tempRoot}/.boostignore`),
					source: 'root',
				},
			]);
		});

		it('errors if root folder is missing a `package.json`', async () => {
			const tempRoot = getFixturePath('config-root-without-package-json');

			await expect(finder.loadFromRoot(tempRoot)).rejects.toThrow(
				'Config folder `.config` found without a relative `package.json`. Both must be located in the project root.',
			);
		});
	});
});
