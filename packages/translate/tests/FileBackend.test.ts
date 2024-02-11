import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import { FileBackend } from '../src/FileBackend';

describe('FileBackend', () => {
	let backend: FileBackend;

	beforeEach(() => {
		backend = new FileBackend({
			paths: [new Path(getFixturePath('i18n-resources'))],
		});
	});

	describe('init()', () => {
		it('sets options on class', () => {
			backend.init({}, { format: 'yaml' });

			expect(backend.options.format).toBe('yaml');
		});

		it('errors if resource path is not a directory', () => {
			const resPath = new Path(__dirname, '../package.json');

			expect(() => {
				backend.init(
					{},
					{
						paths: [resPath],
					},
				);
			}).toThrow(`Resource path "${resPath.path()}" must be a directory.`);
		});
	});

	describe('read()', () => {
		it('supports .js extension', async () => {
			backend.configure({ format: 'js' });
			backend.read('en', 'type-js', () => {});

			await delay();

			expect(backend.resources).toEqual({ type: 'js' });
		});

		// it('supports .mjs extension', () => {
		//   backend.configure({ format: 'js' });

		//   expect(backend.read('en', 'type-mjs', () => {})).toEqual({ type: 'mjs' });
		// });

		it('supports .json extension', async () => {
			backend.configure({ format: 'json' });
			backend.read('en', 'type-json', () => {});

			await delay();

			expect(backend.resources).toEqual({ type: 'json' });
		});

		it('supports .json5 extension', async () => {
			backend.configure({ format: 'json' });
			backend.read('en', 'type-json5', () => {});

			await delay();

			expect(backend.resources).toEqual({ type: 'json5' });
		});

		it('supports .yaml extension', async () => {
			backend.configure({ format: 'yaml' });
			backend.read('en', 'type-yaml', () => {});

			await delay();

			expect(backend.resources).toEqual({ type: 'yaml' });
		});

		it('supports .yml extension', async () => {
			backend.configure({ format: 'yaml' });
			backend.read('en', 'type-yaml-short', () => {});

			await delay();

			expect(backend.resources).toEqual({
				type: 'yaml',
				short: true,
			});
		});

		it('returns empty object for missing locale', async () => {
			backend.read('en', 'unknown', () => {});

			await delay();

			expect(backend.resources).toEqual({});
		});

		it('returns object for defined locale', async () => {
			backend.read('en', 'common', () => {});

			await delay();

			expect(backend.resources).toEqual({ key: 'value' });
		});

		it('caches files after lookup', () => {
			expect(backend.fileCache.size).toBe(0);

			backend.read('en', 'common', () => {});

			expect(backend.fileCache.size).toBe(1);
		});

		it('passes the resources to the callback', async () => {
			const spy = vi.fn();

			backend.read('en', 'common', spy);

			await delay();

			expect(spy).toHaveBeenCalledWith(null, { key: 'value' });
		});

		it('merges objects from multiple resource paths', async () => {
			backend.options.paths.push(new Path(getFixturePath('i18n-resources-more')));
			backend.read('en', 'common', () => {});

			await delay();

			expect(backend.resources).toEqual({ key: 'value', lang: 'en' });
		});
	});
});
