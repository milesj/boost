import os from 'os';
import { Path, PortablePath } from '.';

export function normalizeSeparators<T extends PortablePath | PortablePath[]>(path: T): T {
	if (Array.isArray(path)) {
		return path.map(normalizeSeparators) as T;
	}

	if (os.platform() === 'win32') {
		return String(path).replace(/\//g, '\\') as T;
	}

	return String(path).replace(/\\/g, '/') as T;
}

export function mockPath(...parts: PortablePath[]): Path {
	return new Path(...parts.map(normalizeSeparators));
}

export function mockNormalizedPath(...parts: PortablePath[]): Path {
	const path = mockPath(...parts);
	// Trigger normalize
	path.path();
	return path;
}
