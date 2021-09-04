import { PortablePath } from '../types';

const NIX_START = /^(\/|\.)/u;
const WIN_START = /^([A-Z]:|\.)/u;

/**
 * Returns `true` if a string or `Path` instance looks like a file system path,
 * by checking for absolute or relative path markers, or the existence of
 * path separating slashes. Will return `false` for values that are only
 * the file or folder name.
 *
 * ```ts
 * import { isFilePath } from '@boost/common';
 *
 * isFilePath('./path/to/file.ts'); // true
 * isFilePath(new Path('/path/to/folder')); // true
 * isFilePath('file.ts'); // false
 * ```
 */
export function isFilePath(path: PortablePath): boolean {
	const filePath = String(path);

	if (filePath === '') {
		return false;
	}

	// istanbul ignore next
	if (process.platform === 'win32') {
		return WIN_START.test(filePath) || filePath.includes('/') || filePath.includes('\\');
	}

	return NIX_START.test(filePath) || filePath.includes('/');
}
