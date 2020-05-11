import { Contract, Path, PortablePath } from '@boost/common';
import Cache from './Cache';
import { File } from './types';
import { CONFIG_FOLDER, PACKAGE_FILE } from './constants';

export default abstract class Finder<T extends File, O extends object> extends Contract<O> {
  protected cache: Cache;

  constructor(options: O, cache: Cache) {
    super(options);

    this.cache = cache;
  }

  /**
   * Traverse upwards from the branch directory, until the root directory is found,
   * or we reach to top of the file system. While traversing, find all files
   * within each branch directory, and load them.
   */
  async loadFromBranchToRoot(dir: PortablePath): Promise<T[]> {
    const filesToLoad: Path[] = [];
    const branch = Path.resolve(dir);
    let currentDir = branch.isDirectory() ? branch : branch.parent();

    while (!this.isFileSystemRoot(currentDir)) {
      // eslint-disable-next-line no-await-in-loop
      const files = await this.findFilesInDir(currentDir);

      if (files.length > 0) {
        filesToLoad.unshift(...files);
      }

      if (this.isRootDir(currentDir)) {
        break;
      } else {
        currentDir = currentDir.parent();
      }
    }

    return this.resolveFiles(branch, filesToLoad);
  }

  /**
   * Load files from the root, determined by a relative `.config` folder
   * and `package.json` file.
   */
  async loadFromRoot(dir: PortablePath = process.cwd()): Promise<T[]> {
    const root = this.getRootDir(dir);
    const files = await this.findFilesInDir(root);

    return this.resolveFiles(root, files);
  }

  /**
   * Return the root directory path or throw an error.
   */
  protected getRootDir(dir: PortablePath): Path {
    const root = Path.resolve(dir);

    if (!this.isRootDir(root)) {
      throw new Error(
        `Invalid configuration root. Requires a \`${CONFIG_FOLDER}\` folder and \`${PACKAGE_FILE}\`.`,
      );
    }

    return root;
  }

  /**
   * Return true if the path represents the root of the file system.
   */
  protected isFileSystemRoot(path: Path): boolean {
    return /^(\/|[A-Z]:)/u.test(path.path());
  }

  /**
   * Detect the root directory, config directory, and `package.json`
   * path from the provided directory path, and return true if valid.
   */
  protected isRootDir(dir: Path, abort: boolean = false): boolean {
    if (dir.path() === this.cache.rootDir?.path()) {
      return true;
    } else if (!dir.isDirectory() || abort) {
      return false;
    }

    const configDir = dir.append(CONFIG_FOLDER);

    if (!configDir.exists() || !configDir.isDirectory()) {
      return false;
    }

    this.cache.configDir = configDir;
    this.cache.rootDir = dir;

    const pkgPath = dir.append(PACKAGE_FILE);

    if (!pkgPath.exists()) {
      throw new Error(
        `Config folder \`${CONFIG_FOLDER}\` found without a relative \`${PACKAGE_FILE}\`. Both must be located in the project root.`,
      );
    }

    this.cache.pkgPath = pkgPath;

    return true;
  }

  abstract async findFilesInDir(dir: Path): Promise<Path[]>;

  abstract getFileName(...args: unknown[]): string;

  abstract async resolveFiles(basePath: Path, foundFiles: Path[]): Promise<T[]>;
}
