import fs from 'fs';
import path from 'path';
import { FilePath, PortablePath } from './types';

export default class Path {
  static DELIMITER = path.delimiter;

  static SEP = '/';

  private path: string = '';

  private stats: fs.Stats | null = null;

  constructor(...parts: FilePath[]) {
    // Always use forward slashes for better interop
    this.path = path.normalize(path.join(...parts)).replace(/\\/gu, Path.SEP);
  }

  /**
   * Create and return a new `Path` instance if a string.
   * If already a `Path`, return as is.
   */
  static create(filePath: PortablePath): Path {
    return filePath instanceof Path ? filePath : new Path(filePath);
  }

  /**
   * Append path parts to the end of the current path
   * and return a new `Path` instance.
   */
  append(...parts: FilePath[]): Path {
    return new Path(this.path, ...parts);
  }

  /**
   * Return the extension (if applicable) with or without leading period.
   */
  ext(withoutPeriod: boolean = false): string {
    const ext = path.extname(this.path);

    return withoutPeriod && ext.startsWith('.') ? ext.slice(1) : ext;
  }

  /**
   * Return true if the current path exists.
   */
  exists(): boolean {
    return fs.existsSync(this.path);
  }

  /**
   * Return true if the current path is absolute.
   */
  isAbsolute(): boolean {
    return path.isAbsolute(this.path);
  }

  /**
   * Return true if the current path is a folder.
   */
  isDirectory(): boolean {
    return this.stat().isDirectory();
  }

  /**
   * Return true if the current path is a file.
   */
  isFile(): boolean {
    return this.stat().isFile();
  }

  /**
   * Return the file name (with optional extension) or folder name.
   */
  name(withoutExtension: boolean = false): string {
    let name = path.basename(this.path);

    if (withoutExtension) {
      name = name.replace(this.ext(), '');
    }

    return name;
  }

  /**
   * Return the parent folder as a new `Path` instance.
   */
  parent(): Path {
    return new Path(path.dirname(this.path));
  }

  /**
   * Prepend path parts to the beginning of the current path
   * and return a new `Path` instance.
   */
  prepend(...parts: FilePath[]): Path {
    return new Path(...parts, this.path);
  }

  /**
   * Return a new `Path` instance where the current path is accurately
   * resolved against the defined current working directory.
   */
  resolve(cwd?: string): Path {
    return new Path(path.resolve(cwd || process.cwd(), this.path));
  }

  /**
   * Return the current path as a normalized string.
   */
  toString(): FilePath {
    return this.path;
  }

  /**
   * Lazily load stats for the file.
   */
  private stat(): fs.Stats {
    if (!this.stats) {
      this.stats = fs.statSync(this.path);
    }

    return this.stats;
  }
}
