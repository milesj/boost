import fs from 'fs';
import { mockPath } from '@boost/common/test';
import { Cache } from '../src/Cache';

describe('Cache', () => {
	let cache: Cache;

	beforeEach(() => {
		cache = new Cache();
	});

	describe('cacheFileContents()', () => {
		let statMtime: number;

		beforeEach(() => {
			jest
				.spyOn(fs.promises, 'stat')
				.mockImplementation(() =>
					Promise.resolve({ mtimeMs: statMtime || 100 } as unknown as fs.Stats),
				);
		});

		it('writes a files contents and stats to the cache', async () => {
			expect(cache.fileContentCache['foo/bar']).toBeUndefined();

			const content = await cache.cacheFileContents(mockPath('foo/bar'), () =>
				Promise.resolve('content'),
			);

			expect(content).toBe('content');
			expect(cache.fileContentCache['foo/bar']).toEqual({
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

			const c1 = await cache.cacheFileContents(mockPath('foo/bar'), cb);
			const c2 = await cache.cacheFileContents(mockPath('foo/bar'), cb);
			const c3 = await cache.cacheFileContents(mockPath('foo/bar'), cb);

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

			const c1 = await cache.cacheFileContents(mockPath('foo/bar'), cb);

			statMtime = 200;

			const c2 = await cache.cacheFileContents(mockPath('foo/bar'), cb);

			statMtime = 300;

			const c3 = await cache.cacheFileContents(mockPath('foo/bar'), cb);

			expect(c1).toBe('content1');
			expect(c2).toBe('content2');
			expect(c3).toBe('content3');
			expect(count).toBe(3);
		});

		it('can clear cached file contents', async () => {
			expect(cache.fileContentCache).toEqual({});

			await cache.cacheFileContents(mockPath('foo/bar'), () => Promise.resolve('content'));

			expect(cache.fileContentCache).not.toEqual({});

			cache.clearFileCache();

			expect(cache.fileContentCache).toEqual({});
		});
	});

	describe('cacheFilesInDir()', () => {
		it('writes a list of files in a dir to the cache', async () => {
			const files = [mockPath('a'), mockPath('b')];

			expect(cache.dirFilesCache['foo/bar']).toBeUndefined();

			const list = await cache.cacheFilesInDir(mockPath('foo/bar'), () => Promise.resolve(files));

			expect(list).toBe(files);
			expect(cache.dirFilesCache['foo/bar']).toEqual(files);
		});

		it('only writes to the cache once', async () => {
			let count = 0;
			const cb = () => {
				count += 1;

				return Promise.resolve([mockPath(String(count))]);
			};

			const c1 = await cache.cacheFilesInDir(mockPath('foo/bar'), cb);
			const c2 = await cache.cacheFilesInDir(mockPath('foo/bar'), cb);
			const c3 = await cache.cacheFilesInDir(mockPath('foo/bar'), cb);

			expect(c1).toEqual([mockPath('1')]);
			expect(c2).toEqual([mockPath('1')]);
			expect(c3).toEqual([mockPath('1')]);
			expect(count).toBe(1);
		});

		it('can clear cached dir contents', async () => {
			expect(cache.dirFilesCache).toEqual({});

			await cache.cacheFilesInDir(mockPath('foo/bar'), () =>
				Promise.resolve([mockPath('a'), mockPath('b')]),
			);

			expect(cache.dirFilesCache).not.toEqual({});

			cache.clearFinderCache();

			expect(cache.dirFilesCache).toEqual({});
		});
	});
});
