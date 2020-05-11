/* eslint-disable no-await-in-loop */

import { Predicates, PortablePath, Path, PackageStructure, toArray } from '@boost/common';
import minimatch from 'minimatch';
import loadCjs from './loaders/cjs';
import loadJs from './loaders/js';
import loadJson from './loaders/json';
import loadMjs from './loaders/mjs';
import loadYaml from './loaders/yaml';
import Finder from './Finder';
import createFileName from './helpers/createFileName';
import getEnv from './helpers/getEnv';
import {
  ConfigFile,
  ConfigFinderOptions,
  ExtendsSetting,
  ExtType,
  OverridesSetting,
} from './types';
import { CONFIG_FOLDER, DEFAULT_EXTS, PACKAGE_FILE } from './constants';

function isModuleName(path: PortablePath) {
  return true;
}

function isFilePath(path: PortablePath) {
  return true;
}

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
        return this.loadPackageContents(pkgPath);
      } else {
        this.cache.markMissingFile(pkgPath);
      }

      if (this.isRootDir(currentDir, true)) {
        break;
      } else {
        currentDir = currentDir.parent();
      }
    }

    throw new Error('Unable to determine package scope. No parent `package.json` found.');
  }

  /**
   * Find all configuration and environment specific files in a directory
   * by looping through all the defined extension options.
   * Will only search until the first file is found, and will not return multiple extensions.
   */
  async findFilesInDir(dir: Path): Promise<Path[]> {
    const isRoot = this.isRootDir(dir);
    const baseDir = isRoot ? dir.append(CONFIG_FOLDER) : dir;
    const files = await this.cache.cacheFilesInDir(baseDir, async () => {
      const paths: Path[] = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const ext of this.options.extensions) {
        await Promise.all(
          [
            baseDir.append(this.getFileName(ext, !isRoot)),
            baseDir.append(this.getFileName(ext, !isRoot, true)),
          ].map(configPath => {
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

    if (isRoot && this.cache.pkgPath) {
      files.unshift(this.cache.pkgPath);
    }

    return files;
  }

  /**
   * Create and return a config file name, with optional branch and environment variants.
   */
  getFileName(ext: string, isBranch: boolean = false, isEnv: boolean = false): string {
    const { name, includeEnv } = this.options;

    return createFileName(name, ext, {
      envSuffix: isEnv && includeEnv ? getEnv(this.options.name) : '',
      leadingDot: isBranch,
    });
  }

  /**
   * Load file and package contents from a list of file paths.
   * Extract and apply extended and override configs based on the base path.
   */
  async resolveFiles(basePath: Path, foundFiles: Path[]): Promise<ConfigFile<T>[]> {
    const configs = await Promise.all(
      foundFiles.map(filePath =>
        filePath.path().endsWith(PACKAGE_FILE)
          ? this.loadConfigFromPackage(filePath)
          : this.loadConfig(filePath),
      ),
    );
    const rootConfigs = configs.filter(config => config.path.path().includes(CONFIG_FOLDER));

    // Configs that have been extended from root configs must
    // appear before everything else, in the order they were defined
    const extendedConfigs = await this.extractExtendedConfigs(rootConfigs);

    if (extendedConfigs.length > 0) {
      configs.unshift(...extendedConfigs);
    }

    // Overrides take the highest precedence and must appear after everything,
    // including branch level configs
    const overriddenConfigs = await this.extractOverriddenConfigs(basePath, rootConfigs);

    if (overriddenConfigs.length > 0) {
      configs.push(...overriddenConfigs);
    }

    return configs;
  }

  /**
   * Extract a list of config files to extend, in order, from the list of previously loaded
   * config files, which is typically from the root. The list to extract can be located within
   * a property that matches the `extendsSetting` option.
   */
  protected extractExtendedConfigs(rootConfigs: ConfigFile<T>[]): Promise<ConfigFile<T>[]> {
    const { name, extendsSetting } = this.options;
    const extendsPaths: Path[] = [];

    rootConfigs.forEach(({ config, path }) => {
      const extendsFrom = config[extendsSetting as keyof T] as ExtendsSetting | undefined;

      toArray(extendsFrom).forEach(extendsPath => {
        if (isModuleName(extendsPath)) {
          extendsPaths.push(
            new Path(extendsPath, createFileName(name, 'js', { envSuffix: 'preset' })),
          );
        } else if (isFilePath(extendsPath)) {
          extendsPaths.push(path.parent().append(extendsPath));
        } else {
          throw new Error(
            `Cannot extend configuration. Unknown module or file path "${extendsPath}".`,
          );
        }
      });
    });

    return Promise.all(extendsPaths.map(path => this.loadConfig(path)));
  }

  /**
   * Extract all root config overrides that match the current path used to load with.
   * Overrides are located within a property that matches the `overridesSetting` option.
   */
  protected extractOverriddenConfigs(
    basePath: Path,
    rootConfigs: ConfigFile<T>[],
  ): ConfigFile<T>[] {
    const { overridesSetting } = this.options;
    const overriddenConfigs: ConfigFile<T>[] = [];

    rootConfigs.forEach(({ config, path }) => {
      const overrides = config[overridesSetting as keyof T] as OverridesSetting<T>[] | undefined;

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
    const pkg = await this.loadPackageContents<PackageStructure & { config: Partial<T> }>(path);

    return {
      config: pkg[this.options.name as 'config'] || {},
      path,
    };
  }

  /**
   * Load and cache a `package.json` file's contents.
   */
  protected loadPackageContents<P extends PackageStructure>(path: Path): Promise<P> {
    return this.cache.cacheFileContents(path, () => loadJson<P>(path));
  }
}
