/* eslint-disable no-param-reassign, no-await-in-loop */

import { minimatch } from 'minimatch';
import {
	isFilePath,
	isModuleName,
	PackageStructure,
	Path,
	PathResolver,
	toArray,
} from '@boost/common';
import { Blueprint, Schemas } from '@boost/common/optimal';
import { color } from '@boost/internal';
import { ConfigError } from './ConfigError';
import {
	DEFAULT_EXTS,
	PACKAGE_FILE,
	ROOT_CONFIG_DIR_REGEX,
	ROOT_CONFIG_FILE_REGEX,
} from './constants';
import { Finder } from './Finder';
import { createFileName } from './helpers/createFileName';
import { getEnv } from './helpers/getEnv';
import { loadCjs } from './loaders/cjs';
import { loadJs } from './loaders/js';
import { loadJson } from './loaders/json';
import { loadMjs } from './loaders/mjs';
import { loadTs } from './loaders/ts';
import { loadYaml } from './loaders/yaml';
import {
	ConfigFile,
	ConfigFinderOptions,
	ExtType,
	FileSource,
	FileType,
	OverridesSetting,
} from './types';

export class ConfigFinder<T extends object> extends Finder<ConfigFile<T>, ConfigFinderOptions<T>> {
	blueprint(schemas: Schemas): Blueprint<ConfigFinderOptions<T>> {
		const { array, bool, func, shape, string } = schemas;

		return {
			errorIfNoRootFound: bool(true),
			extendsSetting: string(),
			extensions: array(DEFAULT_EXTS).of(string<ExtType>()),
			includeEnv: bool(true),
			loaders: shape({
				cjs: func(() => loadCjs).notNullable(),
				js: func(() => loadJs).notNullable(),
				json: func(() => loadJson).notNullable(),
				json5: func(() => loadJson).notNullable(),
				mjs: func(() => loadMjs).notNullable(),
				ts: func(() => loadTs).notNullable(),
				yaml: func(() => loadYaml).notNullable(),
				yml: func(() => loadYaml).notNullable(),
			}).exact(),
			name: string().required().camelCase(),
			overridesSetting: string(),
			resolver: func(() => PathResolver.defaultResolver).notNullable(),
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

		this.debug('Determining package scope for %s', color.filePath(dir.path()));

		while (!this.isFileSystemRoot(currentDir)) {
			const pkgPath = currentDir.append(PACKAGE_FILE);
			const cache = this.cache.getFileCache<PackageStructure>(pkgPath);

			if (cache) {
				if (cache.exists) {
					this.debug('Scope found at %s', color.filePath(pkgPath.path()));

					return cache.content;
				}

				// Fall-through
			} else if (pkgPath.exists()) {
				this.debug('Scope found at %s', color.filePath(pkgPath.path()));

				return this.cache.cacheFileContents(pkgPath, () => loadJson(pkgPath));
			} else {
				this.cache.markMissingFile(pkgPath);
			}

			currentDir = currentDir.parent();
		}

		throw new ConfigError('PACKAGE_UNKNOWN_SCOPE');
	}

	/**
	 * Find all configuration and environment specific files in a directory
	 * by looping through all the defined extension options.
	 * Will only search until the first file is found, and will not return multiple extensions.
	 */
	async findFilesInDir(dir: Path): Promise<Path[]> {
		const { extensions, includeEnv } = this.options;
		const isRoot = this.isRootDir(dir);
		const hash = isRoot ? '#root' : '#branch';

		return this.cache.cacheFilesInDir(dir, hash, async () => {
			const paths: Path[] = [];

			for (const ext of extensions) {
				const files: (Path | false)[] = [];

				if (isRoot) {
					files.push(
						dir.append(this.getFileName('root-file', ext, false)),
						includeEnv && dir.append(this.getFileName('root-file', ext, true)),
						dir.append(this.getFileName('root-folder', ext, false)),
						includeEnv && dir.append(this.getFileName('root-folder', ext, true)),
					);
				} else {
					files.push(
						dir.append(this.getFileName('branch', ext, false)),
						includeEnv && dir.append(this.getFileName('branch', ext, true)),
					);
				}

				await Promise.all(
					files.filter(Boolean).map((configPath) => {
						if ((configPath as Path).exists()) {
							paths.push(configPath as Path);
						}

						return configPath;
					}),
				);

				// Once we find any file, we abort looking for others
				if (paths.length > 0) {
					break;
				}
			}

			this.debug.invariant(
				paths.length > 0,
				`Finding config files in ${color.filePath(dir.path())}`,
				paths.map((path) => path.name()).join(', '),
				'No files',
			);

			// Make sure env takes higher precedence
			paths.sort((a, b) => a.path().length - b.path().length);

			return paths;
		});
	}

	/**
	 * Create and return a config file name, with optional branch and environment variants.
	 */
	getFileName(type: FileType, ext: string, isEnv: boolean): string {
		const { name } = this.options;

		return createFileName(type, name, ext, isEnv ? getEnv(name) : '');
	}

	/**
	 * Load file and package contents from a list of file paths.
	 * Extract and apply extended and override configs based on the base path.
	 */
	async resolveFiles(basePath: Path, foundFiles: Path[]): Promise<ConfigFile<T>[]> {
		this.debug('Resolving %d config files', foundFiles.length);

		const configs = await Promise.all(foundFiles.map((filePath) => this.loadConfig(filePath)));

		// Overrides take the highest precedence and must appear after everything,
		// including branch level configs. However, they must extract first so that
		// extends functionality can be inherited (below).
		if (this.options.overridesSetting) {
			const overriddenConfigs = await this.extractOverriddenConfigs(basePath, configs);

			this.debug('Overriding %d configs', overriddenConfigs.length);

			if (overriddenConfigs.length > 0) {
				configs.push(...overriddenConfigs);
			}
		}

		// Configs that have been extended from root configs must
		// appear before everything else, in the order they were defined
		if (this.options.extendsSetting) {
			const extendedConfigs = await this.extractExtendedConfigs(configs);

			this.debug('Extending %d configs', extendedConfigs.length);

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
	protected async extractExtendedConfigs(configs: ConfigFile<T>[]): Promise<ConfigFile<T>[]> {
		const { name, extendsSetting, resolver } = this.options;
		const extendsPaths: Path[] = [];

		this.debug('Extracting configs to extend from');

		for (const { config, path, source } of configs) {
			const key = extendsSetting as keyof typeof config;
			const extendsFrom = config[key];

			if (source === 'root' || source === 'overridden') {
				delete config[key];
			} else if (extendsFrom) {
				throw new ConfigError('EXTENDS_ONLY_ROOT', [key]);
			} else {
				// eslint-disable-next-line no-continue
				continue;
			}

			const extendedPaths = await Promise.all(
				(toArray(extendsFrom) as unknown as string[]).map(async (extendsPath) => {
					// Node module
					if (isModuleName(extendsPath)) {
						const modulePath = new Path(
							extendsPath,
							createFileName('preset', name, 'js', 'preset'),
						);

						this.debug(
							'Extending config from node module: %s',
							color.moduleName(modulePath.path()),
						);

						return new Path(await resolver(modulePath.path()));
					}

					// File path
					if (isFilePath(extendsPath)) {
						let filePath = new Path(extendsPath);

						// Relative to the config file its defined in
						if (!filePath.isAbsolute()) {
							filePath = path.parent().append(extendsPath);
						}

						this.debug('Extending config from file path: %s', color.filePath(filePath.path()));

						return filePath;
					}

					// Unknown
					throw new ConfigError('EXTENDS_UNKNOWN_PATH', [extendsPath]);
				}),
			);

			extendsPaths.push(...extendedPaths);
		}

		return Promise.all(extendsPaths.map((path) => this.loadConfig(path, 'extended')));
	}

	/**
	 * Extract all root config overrides that match the current path used to load with.
	 * Overrides are located within a property that matches the `overridesSetting` option.
	 */
	protected extractOverriddenConfigs(basePath: Path, configs: ConfigFile<T>[]): ConfigFile<T>[] {
		const { overridesSetting } = this.options;
		const overriddenConfigs: ConfigFile<T>[] = [];

		this.debug(
			'Extracting configs to override with (matching against %s)',
			color.filePath(basePath.path()),
		);

		configs.forEach(({ config, path, source }) => {
			const key = overridesSetting as keyof typeof config;
			const overrides = config[key];

			if (source === 'root') {
				delete config[key];
			} else if (overrides) {
				throw new ConfigError('ROOT_ONLY_OVERRIDES', [key]);
			} else {
				return;
			}

			(toArray(overrides) as unknown as OverridesSetting<T>).forEach(
				({ exclude, include, settings }) => {
					const options = { dot: true, matchBase: true };
					const excludePatterns = toArray(exclude);
					const excluded = excludePatterns.some((pattern) =>
						minimatch(basePath.path(), pattern, options),
					);
					const includePatterns = toArray(include);
					const included = includePatterns.some((pattern) =>
						minimatch(basePath.path(), pattern, options),
					);
					const passes = included && !excluded;

					this.debug.invariant(
						passes,
						`Matching with includes "${includePatterns}" and excludes "${excludePatterns}"`,
						'Matched',
						// eslint-disable-next-line no-nested-ternary
						excluded ? 'Excluded' : included ? 'Not matched' : 'Not included',
					);

					if (passes) {
						overriddenConfigs.push({
							config: settings,
							path,
							source: 'overridden',
						});
					}
				},
			);
		});

		return overriddenConfigs;
	}

	/**
	 * Load config contents from the provided file path using one of the defined loaders.
	 */
	protected async loadConfig(path: Path, source?: FileSource): Promise<ConfigFile<T>> {
		const pkg = await this.determinePackageScope(path);
		const config = await this.cache.cacheFileContents(path, async () => {
			const { loaders } = this.options;
			const ext = path.ext(true);

			this.debug('Loading config %s with type %s', color.filePath(path.path()), color.symbol(ext));

			switch (ext) {
				case 'cjs':
					return loaders.cjs(path, pkg);
				case 'js':
					return loaders.js(path, pkg);
				case 'json':
				case 'json5':
					return loaders.json(path, pkg);
				case 'mjs':
					// Not easily testable yet
					// istanbul ignore next
					return loaders.mjs(path, pkg);
				case 'ts':
				case 'tsx':
					return loaders.ts(path, pkg);
				case 'yaml':
				case 'yml':
					return loaders.yaml(path, pkg);
				default:
					throw new ConfigError('LOADER_UNSUPPORTED', [ext]);
			}
		});

		const isRoot =
			ROOT_CONFIG_DIR_REGEX.test(path.path()) || ROOT_CONFIG_FILE_REGEX.test(path.path());

		return {
			config,
			path,
			source: source ?? (isRoot ? 'root' : 'branch'),
		};
	}
}
