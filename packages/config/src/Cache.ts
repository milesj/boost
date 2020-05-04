import fs from 'fs';
import { Path } from '@boost/common';

interface FileCache<T> {
  content: Partial<T>;
  mtime: number;
}

export default class Cache<T> {
  protected dirFilesCache: { [dir: string]: Path[] } = {};

  protected fileContentCache: { [path: string]: FileCache<T> } = {};

  async cacheConfigContents(path: Path, cb: () => Promise<Partial<T>>): Promise<Partial<T>> {
    const key = path.path();
    const cache = this.fileContentCache[key];
    const stats = await this.loadStats(path);

    if (cache && cache.mtime === stats.mtimeMs) {
      return cache.content;
    }

    const content = await cb();

    this.fileContentCache[key] = {
      content,
      mtime: stats.mtimeMs,
    };

    return content;
  }

  async cacheDirConfigFiles(dir: Path, cb: () => Promise<Path[]>): Promise<Path[]> {
    const key = dir.path();

    if (this.dirFilesCache[key]) {
      return this.dirFilesCache[key];
    }

    const files = await cb();

    this.dirFilesCache[key] = files;

    return files;
  }

  clear() {
    this.dirFilesCache = {};
    this.fileContentCache = {};
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
