/* eslint-disable no-await-in-loop */

import { Contract, Predicates, PortablePath, Path, PackageStructure } from '@boost/common';
import loadJs from './loaders/js';
import loadJson from './loaders/json';
import loadYaml from './loaders/yaml';
import Cache from './Cache';
import { FinderOptions, ExtType, LoadedConfig } from './types';
import { CONFIG_FOLDER } from './constants';

export default class Finder<T extends object> extends Contract<FinderOptions<T>> {
  protected cache = new Cache<T>();

  protected configDir?: Path;

  protected pkgPath?: Path;

  protected rootDir?: Path;

  blueprint({ array, bool, func, shape, string }: Predicates) {
    return {
      env: bool(true),
      exts: array(string<ExtType>(), ['js', 'json', 'yaml', 'yml'] as ExtType[]),
      loaders: shape({
        js: func(loadJs).notNullable(),
        json: func(loadJson).notNullable(),
        yaml: func(loadYaml).notNullable(),
        yml: func(loadYaml).notNullable(),
      }).exact(),
      name: string()
        .required()
        .camelCase(),
    };
  }

  /**
   * Clear all cached directory, file, and loader information.
   */
  clearCache(): this {
    this.cache.clear();

    return this;
  }

  /**
   * Find all configuration and environment specific files in a directory
   * by looping through all the defined extension options.
   * Will only search until the first file is found, and will not return multiple extensions.
   */
  async findConfigFilesInDir(dir: Path, isBranch: boolean = false): Promise<Path[]> {
    return this.cache.cacheDirConfigFiles(dir, async () => {
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
      name += `.${(process.env.NODE_ENV || 'development').toLowerCase()}`;
    }

    name += `.${ext}`;

    return name;
  }

  /**
   * Traverse upwards from the branch directory, until the root directory is found,
   * or we reach to top of the file system. While traversing, find all config files
   * within each branch directory, and load them.
   */
  async loadFromBranchToRoot(dir: PortablePath): Promise<LoadedConfig<T>[]> {
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

    return this.applyLoadersToFiles(filesToLoad);
  }

  /**
   * Load config files from a relative `.config` folder, and a config block from a
   * relative `package.json`. Package configurations take lowest precedence.
   */
  async loadFromRoot(dir: PortablePath = process.cwd()): Promise<LoadedConfig<T>[]> {
    if (!this.isRootDir(Path.create(dir))) {
      throw new Error(
        `Invalid configuration root. Requires a \`${CONFIG_FOLDER}\` folder and \`package.json\`.`,
      );
    }

    return this.applyLoadersToFiles([
      this.pkgPath!,
      ...(await this.findConfigFilesInDir(this.configDir!)),
    ]);
  }

  /**
   * Load file and package contents from a list of file paths.
   */
  protected async applyLoadersToFiles(files: Path[]): Promise<LoadedConfig<T>[]> {
    return Promise.all(
      files.map(filePath => {
        if (filePath.path().endsWith('package.json')) {
          return this.loadConfigFromPackage(filePath);
        }

        return this.loadConfig(filePath);
      }),
    );
  }

  /**
   * Load config contents from a file path using one of the defined loaders.
   */
  protected async loadConfig(path: Path): Promise<LoadedConfig<T>> {
    const config = await this.cache.cacheConfigContents(path, async () => {
      const { loaders } = this.options;
      const ext = path.ext(true);

      switch (ext) {
        case 'js':
          return loaders.js(path);
        case 'json':
          return loaders.json(path);
        case 'yaml':
        case 'yml':
          return loaders.yaml(path);
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
  protected async loadConfigFromPackage(path: Path): Promise<LoadedConfig<T>> {
    const config = await this.cache.cacheConfigContents(path, async () => {
      const { name } = this.options;
      const pkg = await loadJson<PackageStructure & { config: Partial<T> }>(path);

      return pkg[name as 'config'] || {};
    });

    return {
      config,
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

    const pkgPath = dir.append('package.json');

    if (!pkgPath.exists()) {
      throw new Error(
        `Config folder \`${CONFIG_FOLDER}\` found without a relative \`package.json\`. Both must be located in the project root.`,
      );
    }

    this.pkgPath = pkgPath;

    return true;
  }
}
