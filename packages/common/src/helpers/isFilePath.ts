import { Path } from '../Path';
import { PortablePath } from '../types';

const NIX_START = /^(\/|\.)/u;
const WIN_START = /^([A-Z]:|\.)/u;

export function isFilePath(path: PortablePath): boolean {
	const filePath = path instanceof Path ? path.path() : path;

	if (filePath === '') {
		return false;
	}

	// istanbul ignore next
	if (process.platform === 'win32') {
		return WIN_START.test(filePath) || filePath.includes('/') || filePath.includes('\\');
	}

	return NIX_START.test(filePath) || filePath.includes('/');
}
