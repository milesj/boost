/* eslint-disable no-param-reassign, no-await-in-loop */

import {
  Predicates,
  Path,
  PackageStructure,
  toArray,
  isModuleName,
  isFilePath,
} from '@boost/common';
import { RuntimeError } from '@boost/internal';
import minimatch from 'minimatch';
import loadCjs from './loaders/cjs';
import loadJs from './loaders/js';
import loadJson from './loaders/json';
import loadMjs from './loaders/mjs';
import loadYaml from './loaders/yaml';
import Finder from './Finder';
import createFileName from './helpers/createFileName';
import getEnv from './helpers/getEnv';
import { CONFIG_FOLDER, DEFAULT_EXTS, PACKAGE_FILE } from './constants';
import {
  ConfigFile,
  ConfigFinderOptions,
  ExtendsSetting,
  ExtType,
  OverridesSetting,
} from './types';

export default class ConfigFinder<T extends object> extends Finder<
  ConfigFile<T>,
  ConfigFinderOptions<T>
> {
  blueprint({ array, bool, func, shape, string }: Predicates) {
    return {
      extendsSetting: string(),
      extensions: array(string<ExtType>(), DEFAULT_EXTS),
      includeEnv: bool(true),
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
      overridesSetting: string(),
    };
  }

  /**
   * Determine a files package scope by finding the first parent `package.json`
   * when traversing up directories. We will leverage the cache as much as
   * possible for performance.
   *
   * @see https://nodejs.org/api/esm.html#esm_package_scope_and_file_extensions
   */
  async determinePackageScope(dir: Path): Promise<PackageStructure> {
    let currentDir = dir.isDirectory() ? dir : dir.parent();

    while (!this.isFileSystemRoot(currentDir)) {
      const pkgPath = currentDir.append(PACKAGE_FILE);
      const cache = this.cache.getFileCache<PackageStructure>(pkgPath);

      if (cache) {
        if (cache.exists) {
          return cache.content;
        }
        // Fall-through
      } else if (pkgPath.exists()) {
        return this.cache.cacheFileContents(pkgPath, () => loadJson(pkgPath));
      } else {
        this.cache.markMissingFile(pkgPath);
      }

      currentDir = currentDir.parent();
    }

    throw new RuntimeError('config', 'CFG_PACKAGE_SCOPE_UNKNOWN');
  }

  /**
   * Find all configuration and environment specific files in a directory
   * by looping through all the defined extension options.
   * Will only search until the first file is found, and will not return multiple extensions.
   */
  async findFilesInDir(dir: Path): Promise<Path[]> {
    const isRoot = this.isRootDir(dir);
    const baseDir = isRoot ? dir.append(CONFIG_FOLDER) : dir;

    return this.cache.cacheFilesInDir(baseDir, async () => {
      const paths: Path[] = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const ext of this.options.extensions) {
        const files = [baseDir.append(this.getFileName(ext, !isRoot, false))];

        if (this.options.includeEnv) {
          files.push(baseDir.append(this.getFileName(ext, !isRoot, true)));
        }

        await Promise.all(
          files.map(configPath => {
            if (configPath.exists()) {
              paths.push(configPath);
            }

            return configPath;
          }),
        );

        // Once we find any file, we abort looking for others
        if (paths.length > 0) {
          break;
        }
      }

      return paths;
    });
  }

  /**
   * Create and return a config file name, with optional branch and environment variants.
   */
  getFileName(ext: string, isBranch: boolean, isEnv: boolean): string {
    const { name } = this.options;

    return createFileName(name, ext, {
      envSuffix: isEnv ? getEnv(name) : '',
      leadingDot: isBranch,
    });
  }

  /**
   * Load file and package contents from a list of file paths.
   * Extract and apply extended and override configs based on the base path.
   */
  async resolveFiles(basePath: Path, foundFiles: Path[]): Promise<ConfigFile<T>[]> {
    const configs = await Promise.all(foundFiles.map(filePath => this.loadConfig(filePath)));

    // Overrides take the highest precedence and must appear after everything,
    // including branch level configs. However, they must extract first so that
    // extends functionality can be inherited.
    if (this.options.overridesSetting) {
      const overriddenConfigs = await this.extractOverriddenConfigs(basePath, configs);

      if (overriddenConfigs.length > 0) {
        configs.push(...overriddenConfigs);
      }
    }

    // Configs that have been extended from root configs must
    // appear before everything else, in the order they were defined
    if (this.options.extendsSetting) {
      const extendedConfigs = await this.extractExtendedConfigs(configs);

      if (extendedConfigs.length > 0) {
        configs.unshift(...extendedConfigs);
      }
    }

    return configs;
  }

  /**
   * Extract a list of config files to extend, in order, from the list of previously loaded
   * config files, which is typically from the root. The list to extract can be located within
   * a property that matches the `extendsSetting` option.
   */
  protected extractExtendedConfigs(configs: ConfigFile<T>[]): Promise<ConfigFile<T>[]> {
    const { name, extendsSetting } = this.options;
    const extendsPaths: Path[] = [];

    configs.forEach(({ config, path, source }) => {
      const key = extendsSetting as keyof T;
      const extendsFrom = config[key] as ExtendsSetting | undefined;

      if (source === 'root' || source === 'override') {
        delete config[key];
      } else if (extendsFrom) {
        throw new RuntimeError('config', 'CFG_EXTENDS_ROOT_ONLY', [key]);
      } else {
        return;
      }

      toArray(extendsFrom).forEach(extendsPath => {
        if (isModuleName(extendsPath)) {
          extendsPaths.push(
            new Path(extendsPath, createFileName(name, 'js', { envSuffix: 'preset' })),
          );
        } else if (isFilePath(extendsPath)) {
          extendsPaths.push(path.parent().append(extendsPath));
        } else {
          throw new RuntimeError('config', 'CFG_EXTENDS_UNKNOWN_PATH', [extendsPath]);
        }
      });
    });

    return Promise.all(extendsPaths.map(path => this.loadConfig(path)));
  }

  /**
   * Extract all root config overrides that match the current path used to load with.
   * Overrides are located within a property that matches the `overridesSetting` option.
   */
  protected extractOverriddenConfigs(basePath: Path, configs: ConfigFile<T>[]): ConfigFile<T>[] {
    const { overridesSetting } = this.options;
    const overriddenConfigs: ConfigFile<T>[] = [];

    configs.forEach(({ config, path, source }) => {
      const key = overridesSetting as keyof T;
      const overrides = config[key] as OverridesSetting<T>[] | undefined;

      if (source === 'root') {
        delete config[key];
      } else if (overrides) {
        throw new RuntimeError('config', 'CFG_OVERRIDES_ROOT_ONLY', [key]);
      } else {
        return;
      }

      toArray(overrides).forEach(({ exclude, include, settings }) => {
        const excludePatterns = toArray(exclude);
        const includePatterns = toArray(include);
        const options = { dot: true, matchBase: true };

        if (
          includePatterns.some(pattern => minimatch(basePath.path(), pattern, options)) &&
          !excludePatterns.some(pattern => minimatch(basePath.path(), pattern, options))
        ) {
          overriddenConfigs.push({
            config: settings,
            path,
            source: 'override',
          });
        }
      });
    });

    return overriddenConfigs;
  }

  /**
   * Load config contents from the provided file path using one of the defined loaders.
   */
  protected async loadConfig(path: Path): Promise<ConfigFile<T>> {
    const pkg = await this.determinePackageScope(path);
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
          // Not easily testable yet
          // istanbul ignore next
          return loaders.mjs(path, pkg);
        case 'yaml':
        case 'yml':
          return loaders.yaml(path, pkg);
        default:
          throw new RuntimeError('config', 'CFG_LOADER_UNSUPPORTED', [ext]);
      }
    });

    return {
      config,
      path,
      source: path.path().includes(CONFIG_FOLDER) ? 'root' : 'branch',
    };
  }
}
