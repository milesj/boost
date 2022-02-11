import fs from 'fs';
import { Contract, Path, PortablePath } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { color } from '@boost/internal';
import { Cache } from './Cache';
import { ConfigError } from './ConfigError';
import { CONFIG_FOLDER, PACKAGE_FILE, ROOT_CONFIG_FILE_REGEX } from './constants';
import { File } from './types';

export abstract class Finder<
	T extends File,
	Options extends { name: string },
> extends Contract<Options> {
	protected readonly debug: Debugger;

	protected readonly cache: Cache;

	constructor(options: Options, cache: Cache) {
		super(options);

		this.cache = cache;
		this.debug = createDebugger([this.constructor.name.toLowerCase(), this.options.name]);
	}

	/**
	 * Traverse upwards from the branch directory, until the root directory is found,
	 * or we reach to top of the file system. While traversing, find all files.
	 */
	async loadFromBranchToRoot(dir: PortablePath): Promise<T[]> {
		const filesToLoad: Path[] = [];
		const branch = Path.resolve(dir);
		let currentDir = branch.isDirectory() ? branch : branch.parent();

		this.debug('Loading files from branch %s to root', color.filePath(branch.path()));

		while (!this.isFileSystemRoot(currentDir)) {
			// eslint-disable-next-line no-await-in-loop
			const files = await this.findFilesInDir(currentDir);

			if (files.length > 0) {
				filesToLoad.unshift(...files);
			}

			// eslint-disable-next-line no-await-in-loop
			if (await this.isRootDir(currentDir)) {
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
		this.debug('Loading files from possible root %s', color.filePath(String(dir)));

		const root = await this.getRootDir(dir);
		const files = await this.findFilesInDir(root);

		return this.resolveFiles(root, files);
	}

	/**
	 * Return the root directory path or throw an error.
	 */
	protected async getRootDir(dir: PortablePath): Promise<Path> {
		const root = Path.resolve(dir);

		if (!(await this.isRootDir(root))) {
			throw new ConfigError('ROOT_INVALID', [CONFIG_FOLDER, this.options.name]);
		}

		return root;
	}

	protected async hasRootFile(dir: Path): Promise<Path | null> {
		const results = await this.cache.cacheFilesInDir(dir, async () => {
			const files = await new Promise<string[]>((resolve, reject) => {
				fs.readdir(dir.path(), (error, list) => {
					if (error) {
						reject(error);
					} else {
						resolve(list);
					}
				});
			});

			console.log(files);

			// Filter down to files that match our root config format
			return files.filter((file) => ROOT_CONFIG_FILE_REGEX.test(file)).map(Path.create);
		});

		if (results.length > 1) {
			throw new ConfigError('ROOT_FILE_ONLY_ONE', [results.length]);
		} else if (results.length === 1) {
			return results[0];
		}

		return null;
	}

	/**
	 * Return true if the path represents the root of the file system.
	 */
	protected isFileSystemRoot(path: Path): boolean {
		return /^(\/|[A-Z]:(?:\\|\/))$/u.test(path.path());
	}

	/**
	 * Detect the root directory, config file/directory, and `package.json`
	 * path from the provided directory path, and return true if valid.
	 */
	protected async isRootDir(dir: Path, abort: boolean = false): Promise<boolean> {
		if (dir.path() === this.cache.rootDir?.path()) {
			return true;
		}

		if (!dir.isDirectory() || abort) {
			return false;
		}

		// Check for `<name>.config.<ext>` file first
		const configFile = await this.hasRootFile(dir);

		if (configFile) {
			this.cache.configFile = configFile;
			this.cache.rootDir = dir;

			this.debug('Project root found at %s', color.filePath(dir.path()));

			return true;
		}

		// Then check for `.config/<name>.<ext>` second
		const configDir = dir.append(CONFIG_FOLDER);
		const isValid = configDir.exists() && configDir.isDirectory();

		if (!isValid) {
			return false;
		}

		this.cache.configDir = configDir;
		this.cache.rootDir = dir;

		const pkgPath = dir.append(PACKAGE_FILE);

		if (!pkgPath.exists()) {
			throw new ConfigError('ROOT_NO_PACKAGE', [CONFIG_FOLDER]);
		}

		this.cache.pkgPath = pkgPath;

		this.debug('Project root found at %s', color.filePath(dir.path()));

		return true;
	}

	abstract findFilesInDir(dir: Path): Promise<Path[]>;

	abstract getFileName(...args: unknown[]): string;

	abstract resolveFiles(basePath: Path, foundFiles: Path[]): Promise<T[]>;
}
