import fs from 'fs';
import { Path } from '@boost/common';

export interface FileCache<T> {
  content: T;
  exists: boolean;
  mtime: number;
}

export default class Cache {
  protected dirFilesCache: { [dir: string]: Path[] } = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected fileContentCache: { [path: string]: FileCache<any> } = {};

  async cacheFileContents<T>(path: Path, cb: () => Promise<T>): Promise<T> {
    const key = path.path();
    const cache = this.fileContentCache[key];
    const stats = await this.loadStats(path);

    if (cache && cache.mtime === stats.mtimeMs) {
      return cache.content;
    }

    const content = await cb();

    this.fileContentCache[key] = {
      content,
      exists: true,
      mtime: stats.mtimeMs,
    };

    return content;
  }

  async cacheFilesInDir(dir: Path, cb: () => Promise<Path[]>): Promise<Path[]> {
    const key = dir.path();

    if (this.dirFilesCache[key]) {
      return this.dirFilesCache[key];
    }

    const files = await cb();

    this.dirFilesCache[key] = files;

    return files;
  }

  clearConfigCache() {
    this.fileContentCache = {};
  }

  clearFinderCache() {
    this.dirFilesCache = {};
  }

  getFileCache<T>(path: Path): FileCache<T> | null {
    return this.fileContentCache[path.path()] || null;
  }

  loadStats(path: Path): Promise<fs.Stats> {
    return new Promise((resolve, reject) => {
      fs.stat(path.path(), (error, stats) => {
        if (error) {
          reject(error);
        } else {
          resolve(stats);
        }
      });
    });
  }

  markMissingFile(path: Path): this {
    this.fileContentCache[path.path()] = {
      content: null,
      exists: false,
      mtime: 0,
    };

    return this;
  }
}
