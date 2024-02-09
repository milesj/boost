import fs from 'fs';
import { mockFilePath } from '@boost/common/test';
import { Cache } from '../src/Cache';
import { describe, beforeEach, it, expect, vi } from 'vitest';

const CACHE_KEY = process.platform === 'win32' ? 'foo\\bar' : 'foo/bar';

describe('Cache', () => {
	let cache: Cache;

	beforeEach(() => {
		cache = new Cache();
	});

	describe('cacheFileContents()', () => {
		let statMtime: number;

		beforeEach(() => {
			vi.spyOn(fs.promises, 'stat').mockImplementation(() =>
				Promise.resolve({ mtimeMs: statMtime || 100 } as unknown as fs.Stats),
			);
		});

		it('writes a files contents and stats to the cache', async () => {
			expect(cache.fileContentCache[CACHE_KEY]).toBeUndefined();

			const content = await cache.cacheFileContents(mockFilePath(CACHE_KEY), () =>
				Promise.resolve('content'),
			);

			expect(content).toBe('content');
			expect(cache.fileContentCache[CACHE_KEY]).toEqual({
				content: 'content',
				exists: true,
				mtime: 100,
			});
		});

		it('only writes to the cache once', async () => {
			let count = 0;
			const cb = () => {
				count += 1;

				return Promise.resolve(`content${count}`);
			};

			const c1 = await cache.cacheFileContents(mockFilePath(CACHE_KEY), cb);
			const c2 = await cache.cacheFileContents(mockFilePath(CACHE_KEY), cb);
			const c3 = await cache.cacheFileContents(mockFilePath(CACHE_KEY), cb);

			expect(c1).toBe('content1');
			expect(c2).toBe('content1');
			expect(c3).toBe('content1');
			expect(count).toBe(1);
		});

		it('overwrites cache if mtime changes', async () => {
			let count = 0;
			const cb = () => {
				count += 1;

				return Promise.resolve(`content${count}`);
			};

			const c1 = await cache.cacheFileContents(mockFilePath(CACHE_KEY), cb);

			statMtime = 200;

			const c2 = await cache.cacheFileContents(mockFilePath(CACHE_KEY), cb);

			statMtime = 300;

			const c3 = await cache.cacheFileContents(mockFilePath(CACHE_KEY), cb);

			expect(c1).toBe('content1');
			expect(c2).toBe('content2');
			expect(c3).toBe('content3');
			expect(count).toBe(3);
		});

		it('can clear cached file contents', async () => {
			expect(cache.fileContentCache).toEqual({});

			await cache.cacheFileContents(mockFilePath(CACHE_KEY), () => Promise.resolve('content'));

			expect(cache.fileContentCache).not.toEqual({});

			cache.clearFileCache();

			expect(cache.fileContentCache).toEqual({});
		});
	});

	describe('cacheFilesInDir()', () => {
		it('writes a list of files in a dir to the cache', async () => {
			const files = [mockFilePath('a'), mockFilePath('b')];

			expect(cache.dirFilesCache[CACHE_KEY]).toBeUndefined();

			const list = await cache.cacheFilesInDir(mockFilePath(CACHE_KEY), '', () =>
				Promise.resolve(files),
			);

			expect(list).toBe(files);
			expect(cache.dirFilesCache[CACHE_KEY]).toEqual(files);
		});

		it('only writes to the cache once', async () => {
			let count = 0;
			const cb = () => {
				count += 1;

				return Promise.resolve([mockFilePath(String(count))]);
			};

			const c1 = await cache.cacheFilesInDir(mockFilePath(CACHE_KEY), '', cb);
			const c2 = await cache.cacheFilesInDir(mockFilePath(CACHE_KEY), '', cb);
			const c3 = await cache.cacheFilesInDir(mockFilePath(CACHE_KEY), '', cb);

			expect(c1).toEqual([mockFilePath('1')]);
			expect(c2).toEqual([mockFilePath('1')]);
			expect(c3).toEqual([mockFilePath('1')]);
			expect(count).toBe(1);
		});

		it('can clear cached dir contents', async () => {
			expect(cache.dirFilesCache).toEqual({});

			await cache.cacheFilesInDir(mockFilePath(CACHE_KEY), '', () =>
				Promise.resolve([mockFilePath('a'), mockFilePath('b')]),
			);

			expect(cache.dirFilesCache).not.toEqual({});

			cache.clearFinderCache();

			expect(cache.dirFilesCache).toEqual({});
		});
	});
});
