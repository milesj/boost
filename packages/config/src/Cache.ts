import fs from 'fs';
import { Path } from '@boost/common';

export interface FileCache<T> {
  content: T;
  mtime: number;
}

export default class Cache {
  protected dirFilesCache: { [dir: string]: Path[] } = {};

  protected fileContentCache: { [path: string]: FileCache<unknown> } = {};

  async cacheFileContents<T>(path: Path, cb: () => Promise<T>): Promise<T> {
    const key = path.path();
    const cache = this.fileContentCache[key];
    const stats = await this.loadStats(path);

    if (cache && cache.mtime === stats.mtimeMs) {
      return cache.content as T;
    }

    const content = await cb();

    this.fileContentCache[key] = {
      content,
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

  async loadStats(path: Path): Promise<fs.Stats> {
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
}
