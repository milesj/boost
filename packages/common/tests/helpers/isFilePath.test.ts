import { sep } from 'path';
import { isFilePath } from '../../src/helpers/isFilePath';
import { Path } from '../../src/Path';

describe('isFilePath()', () => {
	it('returns false if an empty string', () => {
		expect(isFilePath('')).toBe(false);
		expect(isFilePath(new Path(''))).toBe(true); // Defaults to "/"
	});

	it('returns false if a file name', () => {
		expect(isFilePath('foo.ts')).toBe(false);
		expect(isFilePath(new Path('foo.ts'))).toBe(false);
	});

	it('returns false if a folder name', () => {
		expect(isFilePath('foo')).toBe(false);
		expect(isFilePath(new Path('foo'))).toBe(false);
	});

	it('returns true for absolute paths', () => {
		// eslint-disable-next-line jest/no-if
		const root = process.platform === 'win32' ? 'C:/' : '/';

		expect(isFilePath(`${root}foo/bar`)).toBe(true);
		expect(isFilePath(new Path(`${root}foo/bar`))).toBe(true);
	});

	it('returns true for relative paths', () => {
		expect(isFilePath('./foo/bar')).toBe(true);
		expect(isFilePath(new Path('./foo/bar'))).toBe(true);
	});

	it('returns true if path contains a forward slash', () => {
		expect(isFilePath('foo/bar')).toBe(true);
		expect(isFilePath(new Path('foo/bar'))).toBe(true);
	});

	it('returns true if path contains a system slash', () => {
		expect(isFilePath(`foo${sep}bar`)).toBe(true);
		expect(isFilePath(new Path(`foo${sep}bar`))).toBe(true);
	});
});
