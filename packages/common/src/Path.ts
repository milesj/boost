import path from 'path';

export default class Path {
  static SEP = path.sep;

  private path: string = '';

  constructor(...parts: string[]) {
    this.append(...parts);
  }

  /**
   * Append path parts to the end of the current path.
   */
  append(...parts: string[]): this {
    this.path = path.resolve(process.cwd(), path.join(this.path, ...parts));

    return this;
  }

  /**
   * Return the base name (and extension when applicable) for the current path.
   */
  baseName(): string {
    return path.basename(this.path);
  }

  /**
   * Return the directory name for the current path.
   */
  dirName(): string {
    return path.dirname(this.path);
  }

  /**
   * Return the extension if applicable, with optional leading period.
   */
  ext(withoutPeriod: boolean = false): string {
    const ext = path.extname(this.path);

    return withoutPeriod && ext.startsWith('.') ? ext.slice(1) : ext;
  }

  /**
   * Return the file name without extension.
   */
  name(): string {
    return this.baseName().replace(this.ext(), '');
  }

  /**
   * Return a normalized path as a string.
   */
  toString(): string {
    return path.normalize(this.path);
  }
}
