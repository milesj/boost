import { resolve } from 'path';
import { Path, VirtualPath } from '../src';
import { mockFilePath, normalizeSeparators } from '../src/test';

describe('Path', () => {
	describe('.create()', () => {
		it('returns an instance for a string', () => {
			expect(Path.create('./foo')).toEqual(new Path('./foo'));
		});

		it('returns a new instance', () => {
			const path = new Path('./foo');

			expect(Path.create(path)).not.toBe(path);
		});
	});

	describe('.path()', () => {
		it('returns a path for a string', () => {
			expect(Path.path('foo/bar')).toBe(normalizeSeparators('foo/bar'));
		});

		it('returns a path for an instance', () => {
			expect(Path.path(new Path('foo', 'bar'))).toBe(normalizeSeparators('foo/bar'));
		});

		it('returns a path for a `VirtualPath` instance', () => {
			expect(Path.path(new VirtualPath('foo\\bar'))).toBe(normalizeSeparators('foo/bar'));
		});
	});

	describe('.resolve()', () => {
		it('returns an instance for a string', () => {
			expect(Path.resolve('./foo')).toEqual(new Path(resolve('./foo')));
		});

		it('returns an instance for a `Path`', () => {
			expect(Path.resolve(new Path('./foo'))).toEqual(new Path(resolve('./foo')));
		});
	});

	describe('constructor()', () => {
		it('joins multiple parts', () => {
			const path = new Path('/foo/bar', '../baz', 'file.js');

			expect(path.path()).toBeFilePath('/foo/baz/file.js');
		});

		it('joins multiple parts with `Path` instances', () => {
			const path = new Path('/foo/bar', new Path('../baz'), Path.create('file.js'));

			expect(path.path()).toBeFilePath('/foo/baz/file.js');
		});

		it('removes leading relative dot', () => {
			const path = new Path('./foo');

			expect(path.path()).toBeFilePath('foo');
		});

		it('persists leading dots', () => {
			const path = new Path('../foo');

			expect(path.path()).toBeFilePath('../foo');
		});

		it('persists multiple leading dots', () => {
			const path = new Path('../../foo');

			expect(path.path()).toBeFilePath('../../foo');
		});
	});

	describe('append()', () => {
		it('appends to existing path and returns a new instance', () => {
			const p1 = new Path('/foo/bar', '../baz');

			expect(p1.path()).toBeFilePath('/foo/baz');

			const p2 = p1.append('qux/foo');

			expect(p1.path()).toBeFilePath('/foo/baz');
			expect(p2.path()).toBeFilePath('/foo/baz/qux/foo');

			const p3 = p2.append('..', './current');

			expect(p1.path()).toBeFilePath('/foo/baz');
			expect(p2.path()).toBeFilePath('/foo/baz/qux/foo');
			expect(p3.path()).toBeFilePath('/foo/baz/qux/current');
		});

		it('appends with a `Path` instance', () => {
			const p1 = new Path('/foo/bar', '../baz');

			expect(p1.path()).toBeFilePath('/foo/baz');

			const p2 = p1.append(new Path('qux/foo'));

			expect(p1.path()).toBeFilePath('/foo/baz');
			expect(p2.path()).toBeFilePath('/foo/baz/qux/foo');
		});
	});

	describe('equals()', () => {
		it('returns true if a match', () => {
			const path = new Path('foo/bar');

			expect(path.equals('foo/bar')).toBe(true);
		});

		it('returns false if not a match', () => {
			const path = new Path('foo/bar');

			expect(path.equals(new Path('foo/qux'))).toBe(false);
		});
	});

	describe('exists()', () => {
		it('returns true if a folder', () => {
			const path = new Path(__dirname);

			expect(path.exists()).toBe(true);
		});

		it('returns true if a file', () => {
			const path = new Path(__filename);

			expect(path.exists()).toBe(true);
		});

		it('returns false for an invalid path', () => {
			const path = new Path(__dirname, 'some/fake/path');

			expect(path.exists()).toBe(false);
		});
	});

	describe('ext()', () => {
		it('returns extension for file', () => {
			const path = new Path('/foo/bar.js');

			expect(path.ext()).toBe('.js');
		});

		it('returns extension without period for file', () => {
			const path = new Path('/foo/bar.js');

			expect(path.ext(true)).toBe('js');
		});

		it('returns extension for folder', () => {
			const path = new Path('/foo/bar');

			expect(path.ext()).toBe('');
		});
	});

	describe('isAbsolute()', () => {
		it('returns true if absolute', () => {
			const path = new Path('/foo/bar');

			expect(path.isAbsolute()).toBe(true);
		});

		it('returns false if relative', () => {
			const path = new Path('foo/bar');

			expect(path.isAbsolute()).toBe(false);
		});

		it('returns false if relative using leading dot', () => {
			const path = new Path('./foo/bar');

			expect(path.isAbsolute()).toBe(false);
		});
	});

	describe('isDirectory()', () => {
		it('returns true if a folder', () => {
			const path = new Path(__dirname);

			expect(path.isDirectory()).toBe(true);
		});

		it('returns false if a file', () => {
			const path = new Path(__filename);

			expect(path.isDirectory()).toBe(false);
		});
	});

	describe('isFile()', () => {
		it('returns true if a file', () => {
			const path = new Path(__filename);

			expect(path.isFile()).toBe(true);
		});

		it('returns false if a folder', () => {
			const path = new Path(__dirname);

			expect(path.isFile()).toBe(false);
		});
	});

	describe('name()', () => {
		it('returns file name', () => {
			const path = new Path('/foo/bar.js');

			expect(path.name()).toBe('bar.js');
		});

		it('returns file name without extension', () => {
			const path = new Path('/foo/bar.js');

			expect(path.name(true)).toBe('bar');
		});

		it('returns folder name', () => {
			const path = new Path('/foo/bar');

			expect(path.name()).toBe('bar');
		});
	});

	describe('parent()', () => {
		it('returns new instance when no path', () => {
			const path = new Path('');

			expect(path.parent()).toEqual(new Path(''));
		});

		it('returns parent folder as a new instance', () => {
			const path = new Path('/foo/bar/baz.js');

			expect(path.parent()).toEqual(new Path('/foo/bar'));
		});

		it('returns parent folder name when a folder', () => {
			const path = new Path('/foo/bar/baz');

			expect(path.parent()).toEqual(new Path('/foo/bar'));
		});
	});

	describe('prepend()', () => {
		it('prepends to existing path and returns a new instance', () => {
			const p1 = new Path('/foo/bar', '../baz');

			expect(p1.path()).toBeFilePath('/foo/baz');

			const p2 = p1.prepend('qux/foo');

			expect(p1.path()).toBeFilePath('/foo/baz');
			expect(p2.path()).toBeFilePath('qux/foo/foo/baz');

			const p3 = p2.prepend('..', './current');

			expect(p1.path()).toBeFilePath('/foo/baz');
			expect(p2.path()).toBeFilePath('qux/foo/foo/baz');
			expect(p3.path()).toBeFilePath('../current/qux/foo/foo/baz');
		});

		it('prepends with a `Path` instance', () => {
			const p1 = new Path('/foo/bar', '../baz');

			expect(p1.path()).toBeFilePath('/foo/baz');

			const p2 = p1.prepend(new Path('qux/foo'));

			expect(p1.path()).toBeFilePath('/foo/baz');
			expect(p2.path()).toBeFilePath('qux/foo/foo/baz');
		});
	});

	describe('relativeTo()', () => {
		it('returns relative path using a string', () => {
			const from = new Path('/foo/bar/baz');

			expect(from.relativeTo('/foo/qux')).toEqual(mockFilePath('../../qux'));
		});

		it('returns relative path using a path', () => {
			const from = new Path('/foo/bar/baz');

			expect(from.relativeTo(new Path('/foo/qux'))).toEqual(mockFilePath('../../qux'));
		});
	});

	describe('resolve()', () => {
		it('returns a new instance with path resolved to cwd', () => {
			const path = new Path('foo/bar/baz');

			expect(path.resolve()).toEqual(new Path(resolve('foo/bar/baz')));
		});
	});

	describe('toJSON()', () => {
		it('returns path', () => {
			const path = new Path('foo/bar/baz');

			expect(JSON.stringify({ path })).toBe(
				process.platform === 'win32' ? '{"path":"foo\\\\bar\\\\baz"}' : '{"path":"foo/bar/baz"}',
			);
		});
	});

	describe('toString()', () => {
		it('returns path', () => {
			const path = new Path('foo/bar/baz');

			expect(String(path)).toBeFilePath('foo/bar/baz');
		});
	});
});
