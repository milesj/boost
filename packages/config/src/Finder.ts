import fs from 'fs';
import { Contract, Path, PortablePath } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { color } from '@boost/internal';
import { Cache } from './Cache';
import { ConfigError } from './ConfigError';
import { CONFIG_FOLDER, PACKAGE_FILE, ROOT_CONFIG_FILE_REGEX } from './constants';
import { File, FileType } from './types';

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

		await this.findRootDir(currentDir);

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
		await this.findRootDir(Path.resolve(dir));

		this.debug('Loading files from possible root %s', color.filePath(String(dir)));

		const files = await this.findFilesInDir(this.cache.configDir ?? this.cache.rootDir!);

		return this.resolveFiles(this.cache.rootDir!, files);
	}

	/**
	 * Find the root directory by searching for a `.config` folder,
	 * or a `*.config.*` file. Throw an error if none found.
	 */
	protected async findRootDir(dir: Path) {
		if (this.cache.rootDir) {
			return;
		}

		if (this.isFileSystemRoot(dir)) {
			throw new ConfigError('ROOT_INVALID', [CONFIG_FOLDER, this.options.name]);
		}

		const files = await new Promise<string[]>((resolve, reject) => {
			fs.readdir(dir.path(), (error, list) => {
				if (error) {
					reject(error);
				} else {
					resolve(list);
				}
			});
		});

		for (const file of files) {
			if (file === CONFIG_FOLDER) {
				const configDir = dir.append(CONFIG_FOLDER);

				if (configDir.isDirectory()) {
					const pkgPath = dir.append(PACKAGE_FILE);

					if (!pkgPath.exists()) {
						throw new ConfigError('ROOT_NO_PACKAGE', [CONFIG_FOLDER]);
					}

					this.cache.rootDir = dir;
					this.cache.configDir = configDir;
					this.cache.pkgPath = pkgPath;

					break;
				}
			}

			if (ROOT_CONFIG_FILE_REGEX.test(file)) {
				this.cache.rootDir = dir;
				this.cache.configFile = dir.append(file);

				break;
			}
		}

		if (this.cache.rootDir) {
			this.debug('Project root found at %s', color.filePath(this.cache.rootDir.path()));
		} else {
			await this.findRootDir(dir.parent());
		}
	}

	/**
	 * Return true if the path represents the root of the file system.
	 */
	protected isFileSystemRoot(path: Path): boolean {
		return /^(\/|[A-Z]:(?:\\|\/))$/u.test(path.path());
	}

	/**
	 * Return true if the provided dir matches the root dir.
	 */
	protected isRootDir(dir: Path): boolean {
		return dir.path() === this.cache.rootDir?.path();
	}

	abstract findFilesInDir(dir: Path): Promise<Path[]>;

	abstract getFileName(...args: unknown[]): string;

	abstract resolveFiles(basePath: Path, foundFiles: Path[]): Promise<T[]>;
}
