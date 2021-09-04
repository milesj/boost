import { ModulePath, Path, PortablePath } from '.';

/**
 * Normalize a path or its parts by ensuring all path separators match
 * the operating systems default character.
 */
export function normalizeSeparators<T extends PortablePath | PortablePath[]>(path: T): T {
	if (Array.isArray(path)) {
		return path.map(normalizeSeparators) as T;
	}

	if (process.platform === 'win32') {
		return String(path).replace(/\//g, '\\') as T;
	}

	return String(path).replace(/\\/g, '/') as T;
}

export function mockFilePath(...parts: PortablePath[]): Path {
	return new Path(...parts.map(normalizeSeparators));
}

export function mockNormalizedFilePath(...parts: PortablePath[]): Path {
	const path = mockFilePath(...parts);
	// Trigger normalize
	path.path();
	return path;
}

export function mockModulePath(...parts: PortablePath[]): ModulePath {
	return new ModulePath(...parts);
}
