import { VirtualPath } from '../src';

describe('VirtualPath', () => {
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
