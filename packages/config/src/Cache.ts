import fs from 'fs';
import { Path, PortablePath } from '@boost/common';
import { ConfigError } from './ConfigError';

export interface FileCache<T> {
	content: T;
	exists: boolean;
	mtime: number;
}

export class Cache {
	configDir?: Path;

	dirFilesCache: Record<string, Path[]> = {};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	fileContentCache: Record<string, FileCache<any>> = {};

	pkgPath?: Path;

	rootDir?: Path;

	async cacheFileContents<T>(path: Path, commit: () => Promise<T>): Promise<T> {
		const key = path.path();
		const cache = this.fileContentCache[key];
		const stats = await fs.promises.stat(path.path());

		if (cache && cache.mtime === stats.mtimeMs) {
			return cache.content as T;
		}

		const content = await commit();

		this.fileContentCache[key] = {
			content,
			exists: true,
			mtime: stats.mtimeMs,
		};

		return content;
	}

	async cacheFilesInDir(dir: Path, hash: string, commit: () => Promise<Path[]>): Promise<Path[]> {
		const key = dir.path() + hash;

		if (this.dirFilesCache[key]) {
			return this.dirFilesCache[key];
		}

		const files = await commit();

		this.dirFilesCache[key] = files;

		return files;
	}

	clearFileCache() {
		this.fileContentCache = {};
	}

	clearFinderCache() {
		this.dirFilesCache = {};
	}

	getFileCache<T>(path: Path): FileCache<T> | null {
		return this.fileContentCache[path.path()] || null;
	}

	markMissingFile(path: Path): this {
		this.fileContentCache[path.path()] = {
			content: null,
			exists: false,
			mtime: 0,
		};

		return this;
	}

	setRootDir(dir: PortablePath): this {
		const root = Path.resolve(dir);

		if (!root.isDirectory()) {
			throw new ConfigError('ROOT_INVALID_DIR');
		}

		this.rootDir = root;

		return this;
	}
}
