/* eslint-disable no-await-in-loop */

import { Contract, Predicates, PortablePath, Path, PackageStructure } from '@boost/common';
import loadCjs from './loaders/cjs';
import loadJs from './loaders/js';
import loadJson from './loaders/json';
import loadMjs from './loaders/mjs';
import loadYaml from './loaders/yaml';
import Cache from './Cache';
import getEnv from './getEnv';
import { FinderOptions, ExtType, ConfigFile } from './types';
import { CONFIG_FOLDER, DEFAULT_EXTS, PACKAGE_FILE } from './constants';

export default class Finder<T extends object> extends Contract<FinderOptions<T>> {
  protected cache: Cache;

  protected configDir?: Path;

  protected pkgPath?: Path;

  protected rootDir?: Path;

  constructor(options: FinderOptions<T>, cache: Cache) {
    super(options);

    this.cache = cache;
  }

  blueprint({ array, bool, func, shape, string }: Predicates) {
    return {
      env: bool(true),
      exts: array(string<ExtType>(), DEFAULT_EXTS),
      loaders: shape({
        cjs: func(loadCjs).notNullable(),
        js: func(loadJs).notNullable(),
        json: func(loadJson).notNullable(),
        mjs: func(loadMjs).notNullable(),
        yaml: func(loadYaml).notNullable(),
        yml: func(loadYaml).notNullable(),
      }).exact(),
      name: string()
        .required()
        .camelCase(),
    };
  }

  /**
   * Find all configuration and environment specific files in a directory
   * by looping through all the defined extension options.
   * Will only search until the first file is found, and will not return multiple extensions.
   */
  async findConfigFilesInDir(dir: Path, isBranch: boolean = false): Promise<Path[]> {
    return this.cache.cacheFilesInDir(dir, async () => {
      const files: Path[] = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const ext of this.options.exts) {
        await Promise.all(
          [
            dir.append(this.getConfigFileName(ext, isBranch)),
            dir.append(this.getConfigFileName(ext, isBranch, true)),
          ].map(configPath => {
            if (configPath.exists()) {
              files.push(configPath);
            }

            return configPath;
          }),
        );

        // Once we find any file, we abort looking for others
        if (files.length > 0) {
          break;
        }
      }

      return files;
    });
  }

  /**
   * Create and return a config file name, with optional branch and environment variants.
   */
  getConfigFileName(ext: string, isBranch: boolean = false, isEnv: boolean = false): string {
    let { name } = this.options;

    // Add leading period
    if (isBranch) {
      name = `.${name}`;
    }

    // Add environment suffix
    if (isEnv && this.options.env) {
      name += `.${getEnv(this.options.name)}`;
    }

    name += `.${ext}`;

    return name;
  }

  /**
   * Traverse upwards from the branch directory, until the root directory is found,
   * or we reach to top of the file system. While traversing, find all config files
   * within each branch directory, and load them.
   */
  async loadFromBranchToRoot(dir: PortablePath): Promise<ConfigFile<T>[]> {
    const filesToLoad: Path[] = [];
    let currentDir = Path.resolve(dir);

    if (!currentDir.isDirectory()) {
      throw new Error('Starting path must be a directory.');
    }

    while (currentDir.path() !== '' && currentDir.path() !== '/') {
      let files: Path[] = [];

      if (this.isRootDir(currentDir)) {
        files = await this.findConfigFilesInDir(this.configDir!);

        if (this.pkgPath) {
          files.unshift(this.pkgPath);
        }
      } else {
        files = await this.findConfigFilesInDir(currentDir, true);
      }

      if (files.length > 0) {
        filesToLoad.unshift(...files);
      }

      if (this.isRootDir(currentDir)) {
        break;
      } else {
        currentDir = currentDir.parent();
      }
    }

    return this.applyLoaders(filesToLoad);
  }

  /**
   * Load config files from a relative `.config` folder, and a config block from a
   * relative `package.json`. Package configurations take lowest precedence.
   */
  async loadFromRoot(dir: PortablePath = process.cwd()): Promise<ConfigFile<T>[]> {
    if (!this.isRootDir(Path.create(dir))) {
      throw new Error(
        `Invalid configuration root. Requires a \`${CONFIG_FOLDER}\` folder and \`${PACKAGE_FILE}\`.`,
      );
    }

    const files = await this.findConfigFilesInDir(this.configDir!);

    if (this.pkgPath) {
      files.unshift(this.pkgPath);
    }

    return this.applyLoaders(files);
  }

  /**
   * Load file and package contents from a list of file paths.
   */
  protected async applyLoaders(files: Path[]): Promise<ConfigFile<T>[]> {
    return Promise.all(
      files.map(filePath => {
        if (filePath.path().endsWith(PACKAGE_FILE)) {
          return this.loadConfigFromPackage(filePath);
        }

        return this.loadConfig(filePath);
      }),
    );
  }

  /**
   * Load config contents from a file path using one of the defined loaders.
   */
  protected async loadConfig(path: Path): Promise<ConfigFile<T>> {
    // TODO
    const pkg: PackageStructure = { name: '', version: '' };
    const config = await this.cache.cacheFileContents(path, async () => {
      const { loaders } = this.options;
      const ext = path.ext(true);

      switch (ext) {
        case 'cjs':
          return loaders.cjs(path, pkg);
        case 'js':
          return loaders.js(path, pkg);
        case 'json':
          return loaders.json(path, pkg);
        case 'mjs':
          return loaders.mjs(path, pkg);
        case 'yaml':
        case 'yml':
          return loaders.yaml(path, pkg);
        default:
          throw new Error(`Unsupported loader format "${ext}".`);
      }
    });

    return {
      config,
      path,
    };
  }

  /**
   * Load a config block from a `package.json` file, located within
   * a property that matches the `name` option.
   */
  protected async loadConfigFromPackage(path: Path): Promise<ConfigFile<T>> {
    const { name } = this.options;
    const pkg = await this.cache.cacheFileContents(path, () =>
      loadJson<PackageStructure & { config: Partial<T> }>(path),
    );

    return {
      config: pkg[name as 'config'] || {},
      path,
    };
  }

  /**
   * Detect the root dir, config dir, and `package.json` path from the
   * provided directory path, and return true if valid.
   */
  protected isRootDir(dir: Path): boolean {
    if (dir.path() === this.rootDir?.path()) {
      return true;
    }

    const configDir = dir.append(CONFIG_FOLDER);

    if (!configDir.exists()) {
      return false;
    }

    this.configDir = configDir;
    this.rootDir = dir;

    const pkgPath = dir.append(PACKAGE_FILE);

    if (!pkgPath.exists()) {
      throw new Error(
        `Config folder \`${CONFIG_FOLDER}\` found without a relative \`${PACKAGE_FILE}\`. Both must be located in the project root.`,
      );
    }

    this.pkgPath = pkgPath;

    return true;
  }
}
