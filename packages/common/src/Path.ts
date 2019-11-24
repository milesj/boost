import fs from 'fs';
import path from 'path';
import { FilePath } from './types';

export default class Path {
  static SEP = path.sep;

  private path: string = '';

  constructor(...parts: FilePath[]) {
    this.append(...parts);
  }

  /**
   * Append path parts to the end of the current path.
   */
  append(...parts: FilePath[]): this {
    this.path = path.normalize(path.join(this.path, ...parts));

    return this;
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
    return path.normalize(this.path);
  }
}
