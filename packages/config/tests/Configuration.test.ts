import { Blueprint, Schemas } from '@boost/common/optimal';
import { normalizeSeparators } from '@boost/common/test';
import { getFixturePath } from '@boost/test-utils';
import { Configuration, createExtendsSchema, mergeExtends } from '../src';
import { ExtendsSetting, ExtType } from '../src/types';
import { mockSystemPath } from './helpers';
import { describe, beforeEach, it, expect, vi } from 'vitest';

interface BoostConfig {
	debug: boolean;
	extends: ExtendsSetting;
	type: ExtType;
}

class BoostConfiguration extends Configuration<BoostConfig> {
	blueprint({ bool, string }: Schemas): Blueprint<BoostConfig> {
		return {
			debug: bool(),
			extends: createExtendsSchema(),
			type: string('js').oneOf<ExtType>(['js', 'cjs', 'mjs', 'json', 'yaml', 'yml']),
		};
	}

	override bootstrap() {
		this.configureFinder({
			extendsSetting: 'extends',
		});

		this.configureProcessor({
			defaultWhenUndefined: false,
		});

		this.addProcessHandler('extends', mergeExtends);
	}
}

describe('Configuration', () => {
	let config: BoostConfiguration;

	beforeEach(() => {
		config = new BoostConfiguration('boost');
	});

	it('can pass a custom resolver', () => {
		const resolver = vi.fn();

		config = new BoostConfiguration('boost', resolver);

		// @ts-expect-error Allow access
		expect(config.configFinder.options.resolver).toBe(resolver);
	});

	describe('clearCache()', () => {
		it('clears file and finder cache on cache engine', () => {
			// @ts-expect-error Allow access
			const spy1 = vi.spyOn(config.cache, 'clearFileCache');
			// @ts-expect-error Allow access
			const spy2 = vi.spyOn(config.cache, 'clearFinderCache');

			config.clearCache();

			expect(spy1).toHaveBeenCalled();
			expect(spy2).toHaveBeenCalled();
		});
	});

	describe('clearFileCache()', () => {
		it('clears file cache on cache engine', () => {
			// @ts-expect-error Allow access
			const spy = vi.spyOn(config.cache, 'clearFileCache');

			config.clearFileCache();

			expect(spy).toHaveBeenCalled();
		});
	});

	describe('clearFinderCache()', () => {
		it('clears finder cache on cache engine', () => {
			// @ts-expect-error Allow access
			const spy = vi.spyOn(config.cache, 'clearFinderCache');

			config.clearFinderCache();

			expect(spy).toHaveBeenCalled();
		});
	});

	describe('loadConfigFromBranchToRoot()', () => {
		it('loads and processes all configs', async () => {
			const loadSpy = vi.fn((c) => c);
			const processSpy = vi.fn();
			const tempRoot = getFixturePath('config-file-tree-all-types');

			config.onLoadedConfig.listen(loadSpy);
			config.onProcessedConfig.listen(processSpy);

			const result = await config.loadConfigFromBranchToRoot(
				normalizeSeparators(`${tempRoot}/src/app/profiles/settings`),
			);
			const expected = {
				config: {
					debug: true,
					extends: [],
					type: 'yaml',
				},
				files: [
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
				],
			};

			expect(result).toEqual(expected);
			expect(loadSpy).toHaveBeenCalledWith(expected.files);
			expect(loadSpy).toHaveReturnedWith(expected.files);
			expect(processSpy).toHaveBeenCalledWith(expected.config);
		});
	});

	describe('loadConfigFromRoot()', () => {
		it('loads and processes root config', async () => {
			const loadSpy = vi.fn((c) => c);
			const processSpy = vi.fn();
			const tempRoot = getFixturePath('config-root-config-json');

			config.onLoadedConfig.listen(loadSpy);
			config.onProcessedConfig.listen(processSpy);

			const result = await config.loadConfigFromRoot(tempRoot);
			const expected = {
				config: {
					debug: true,
					extends: [],
					type: 'js',
				},
				files: [
					{
						config: { debug: true },
						path: mockSystemPath(`${tempRoot}/.config/boost.json`),
						source: 'root',
					},
				],
			};

			expect(result).toEqual(expected);
			expect(loadSpy).toHaveBeenCalledWith(expected.files);
			expect(loadSpy).toHaveReturnedWith(expected.files);
			expect(processSpy).toHaveBeenCalledWith(expected.config);
		});
	});

	describe('loadIgnoreFromBranchToRoot()', () => {
		it('loads all ignores', async () => {
			const spy = vi.fn((c) => c);
			const tempRoot = getFixturePath('config-ignore-file-tree');

			config.onLoadedIgnore.listen(spy);

			const result = await config.loadIgnoreFromBranchToRoot(
				normalizeSeparators(`${tempRoot}/src/app/feature/signup/flow`),
			);
			const expected = [
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
			];

			expect(result).toEqual(expected);
			expect(spy).toHaveBeenCalledWith(expected);
			expect(spy).toHaveReturnedWith(expected);
		});
	});

	describe('loadIgnoreFromRoot()', () => {
		it('loads root ignore', async () => {
			const spy = vi.fn((c) => c);
			const tempRoot = getFixturePath('config-ignore-file-tree');

			config.onLoadedIgnore.listen(spy);

			const result = await config.loadIgnoreFromRoot(tempRoot);
			const expected = [
				{
					ignore: ['*.log', '*.lock'],
					path: mockSystemPath(`${tempRoot}/.boostignore`),
					source: 'root',
				},
			];

			expect(result).toEqual(expected);
			expect(spy).toHaveBeenCalledWith(expected);
			expect(spy).toHaveReturnedWith(expected);
		});
	});
});
