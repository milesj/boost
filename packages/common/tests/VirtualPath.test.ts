import { describe, expect, it } from 'vitest';
import { Path, VirtualPath } from '../src';

describe('VirtualPath', () => {
	describe('.path()', () => {
		it('returns a path for a string', () => {
			expect(VirtualPath.path('foo/bar')).toBe('foo/bar');
		});

		it('returns a path for an instance', () => {
			expect(VirtualPath.path(new VirtualPath('foo', 'bar'))).toBe('foo/bar');
		});

		it('returns a path for a `Path` instance', () => {
			expect(VirtualPath.path(new Path('foo\\bar'))).toBe('foo/bar');
		});
	});

	describe('path()', () => {
		it('returns forward slashes as-is', () => {
			const path = new VirtualPath('foo/bar', 'baz');

			expect(path.path()).toBe('foo/bar/baz');
		});

		it('returns backwards slashes as forward slashes', () => {
			const path = new VirtualPath('foo\\bar', 'baz');

			expect(path.path()).toBe('foo/bar/baz');
		});
	});
});
