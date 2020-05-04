/* eslint-disable no-await-in-loop */
import { Contract, Predicates, PortablePath, Path, PackageStructure } from '@boost/common';
import loadJs from './loaders/js';
import loadJson from './loaders/json';
import loadYaml from './loaders/yaml';
import { FinderOptions, ExtType } from './types';
import { CONFIG_FOLDER } from './constants';

interface LoadedConfig<T> {
  config: Partial<T>;
  path: Path;
}

export default class Finder<T extends object> extends Contract<FinderOptions<T>> {
  protected cache: { [path: string]: Partial<T> } = {};

  protected configDir?: Path;

  protected pkgPath?: Path;

  protected rootDir?: Path;

  blueprint({ array, bool, func, shape, string }: Predicates) {
    return {
      env: bool(true),
      exts: array(string<ExtType>(), ['js', 'json', 'json5', 'yaml', 'yml'] as ExtType[]),
      loaders: shape({
        js: func(loadJs).notNullable(),
        json: func(loadJson).notNullable(),
        json5: func(loadJson).notNullable(),
        yaml: func(loadYaml).notNullable(),
        yml: func(loadYaml).notNullable(),
      }).exact(),
      name: string()
        .required()
        .camelCase(),
    };
  }

  /**
   * Find all configuration and environment specific files for an extension,
   * by looping through all the defined extension options.
   * Will only search until the first file is found, and will not return multiple extensions.
   */
  async findConfigFilesInDir(dir: Path, isBranch: boolean = false): Promise<Path[]> {
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
  }

  /**
   * Create and return a config file name, with optional branch and environment variants.
   */
  getConfigFileName(ext: string, isBranch: boolean = false, isEnv: boolean = false): string {
    let { name } = this.options;

    if (isBranch) {
      name = `.${name}`;
    }

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
    const configs: LoadedConfig<T>[] = [];
    let currentDir = Path.resolve(dir);

    if (!currentDir.isDirectory()) {
      throw new Error('Starting path must be a directory.');
    }

    while (currentDir.path() !== '' && currentDir.path() !== '/') {
      let files: Path[] = [];

      if (this.isRootDir(currentDir)) {
        files = await this.findConfigFilesInDir(currentDir.append(CONFIG_FOLDER), true);
      } else {
        files = await this.findConfigFilesInDir(currentDir, true);
      }

      if (files.length > 0) {
        const loadedFiles = await Promise.all(files.map(filePath => this.loadConfig(filePath)));

        configs.unshift(...loadedFiles);
      }

      if (this.isRootDir(currentDir)) {
        break;
      } else {
        currentDir = currentDir.parent();
      }
    }

    return configs;
  }

  loadFromRoot(dir: PortablePath = process.cwd()): Promise<LoadedConfig<T>[]> {
    if (!this.isRootDir(Path.create(dir))) {
      throw new Error('Invalid config root.');
    }

    return this.findConfigsInRoot();
  }

  /**
   * Load configuration from a file path using one of the defined loaders.
   */
  protected async loadConfig(path: Path): Promise<LoadedConfig<T>> {
    if (this.cache[path.path()]) {
      return {
        config: this.cache[path.path()],
        path,
      };
    }

    const { loaders } = this.options;
    const ext = path.ext(true);
    let config: Partial<T> = {};

    switch (ext) {
      case 'js':
        config = await loaders.js(path);
        break;
      case 'json':
      case 'json5':
        config = await loaders.json(path);
        break;
      case 'yml':
      case 'yaml':
        config = await loaders.yaml(path);
        break;
      default:
        throw new Error(`Unsupported loader format "${ext}".`);
    }

    if (config) {
      this.cache[path.path()] = config;
    }

    return { config, path };
  }

  /**
   * Load a configuration block from a `package.json` file, located within
   * a property that matches the `name` option.
   */
  protected async loadConfigFromPackage(path: Path): Promise<Partial<T> | null> {
    if (this.cache[path.path()]) {
      return this.cache[path.path()];
    }

    const { name } = this.options;
    const pkg = await loadJson<PackageStructure & { config: Partial<T> }>(path);
    const config = pkg[name as 'config'] || null;

    if (config) {
      this.cache[path.path()] = config;
    }

    return config;
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
        `Config folder "${CONFIG_FOLDER}" found without a relative \`package.json\`. Both must be located in the project root.`,
      );
    }

    this.pkgPath = pkgPath;

    return true;
  }
}
