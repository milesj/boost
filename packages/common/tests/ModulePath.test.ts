import { ModulePath } from '../src';

describe('ModulePath', () => {
	describe('.create()', () => {
		it('returns an instance for a string', () => {
			expect(ModulePath.create('foo')).toEqual(new ModulePath('foo'));
		});

		it('returns a new instance', () => {
			const path = new ModulePath('foo');

			expect(ModulePath.create(path)).not.toBe(path);
		});
	});

	describe('constructor()', () => {
		it('joins multiple parts', () => {
			const path = new ModulePath('foo', 'sub', 'file.js');

			expect(path.path()).toBe('foo/sub/file.js');
		});

		it('joins multiple parts with `ModulePath` instances', () => {
			const path = new ModulePath('foo-bar', new ModulePath('sub'), ModulePath.create('file.js'));

			expect(path.path()).toBe('foo-bar/sub/file.js');
		});
	});

	describe('append()', () => {
		it('appends to existing path and returns a new instance', () => {
			const p1 = new ModulePath('foo-bar', 'baz');

			expect(p1.path()).toBe('foo-bar/baz');

			const p2 = p1.append('qux/foo');

			expect(p1.path()).toBe('foo-bar/baz');
			expect(p2.path()).toBe('foo-bar/baz/qux/foo');

			const p3 = p2.append('..', './current');

			expect(p1.path()).toBe('foo-bar/baz');
			expect(p2.path()).toBe('foo-bar/baz/qux/foo');
			expect(p3.path()).toBe('foo-bar/baz/qux/current');
		});

		it('appends with a `Path` instance', () => {
			const p1 = new ModulePath('/foo/bar', '../baz');

			expect(p1.path()).toBeFilePath('/foo/baz');

			const p2 = p1.append(new ModulePath('qux/foo'));

			expect(p1.path()).toBeFilePath('/foo/baz');
			expect(p2.path()).toBeFilePath('/foo/baz/qux/foo');
		});
	});

	describe('hasScope()', () => {
		it('returns true if has scope (starts with @)', () => {
			expect(new ModulePath('@foo/bar').hasScope()).toBe(true);
			expect(new ModulePath('@foo/bar/sub/path').hasScope()).toBe(true);
		});

		it('returns false if no scope', () => {
			expect(new ModulePath('foo-bar').hasScope()).toBe(false);
			expect(new ModulePath('foo-bar/sub/path').hasScope()).toBe(false);
			expect(new ModulePath('foo/bar').hasScope()).toBe(false);
		});
	});

	describe('name()', () => {
		describe('has scope', () => {
			it('returns module with scope', () => {
				expect(new ModulePath('@foo/bar').name()).toBe('@foo/bar');
				expect(new ModulePath('@foo/bar/sub').name()).toBe('@foo/bar');
				expect(new ModulePath('@foo/bar/sub/path.js').name()).toBe('@foo/bar');
			});

			it('returns module without scope', () => {
				expect(new ModulePath('@foo/bar').name(true)).toBe('bar');
				expect(new ModulePath('@foo/bar/sub').name(true)).toBe('bar');
				expect(new ModulePath('@foo/bar/sub/path.js').name(true)).toBe('bar');
			});
		});

		describe('no scope', () => {
			it('returns module', () => {
				expect(new ModulePath('foo-bar').name()).toBe('foo-bar');
				expect(new ModulePath('foo-bar/sub').name()).toBe('foo-bar');
				expect(new ModulePath('foo-bar/sub/path.js').name()).toBe('foo-bar');
			});

			it('returns module without scope', () => {
				expect(new ModulePath('foo-bar').name(true)).toBe('foo-bar');
				expect(new ModulePath('foo-bar/sub').name(true)).toBe('foo-bar');
				expect(new ModulePath('foo-bar/sub/path.js').name(true)).toBe('foo-bar');
			});
		});
	});

	describe('scope()', () => {
		it('returns scope if defined', () => {
			expect(new ModulePath('@foo/bar').scope()).toBe('@foo');
			expect(new ModulePath('@foo/bar/sub/path').scope()).toBe('@foo');
		});

		it('returns null if no scope', () => {
			expect(new ModulePath('foo/bar').scope()).toBeNull();
			expect(new ModulePath('foo/bar/sub/path').scope()).toBeNull();
		});
	});
});
