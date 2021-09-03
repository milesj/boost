import os from 'os';
import { Path } from '.';

export function normalizeSeparators(path: string) {
	if (os.platform() === 'win32') {
		return path.replace(/\//g, '\\');
	}

	return path.replace(/\\/g, '/');
}

export function createPath(path: string): Path {
	return new Path(normalizeSeparators(path));
}

export function createNormalizedPath(path: string): Path {
	const inst = createPath(path);
	// Trigger normalize
	inst.path();
	return inst;
}
