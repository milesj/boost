import fs from 'fs';
import path from 'path';
import { FilePath, Pathable, PortablePath } from './types';

/**
 * An immutable class for operating on file system paths.
 * Will normalize path separators based on the operating system,
 * "/" on Linux/MacOS, and "\\" on Windows.
 */
export class Path implements Pathable {
	static DELIMITER = path.delimiter;

	static SEP = path.sep;

	protected internalPath: string = '';

	protected isNormalized: boolean = false;

	constructor(...parts: PortablePath[]) {
		this.internalPath = path.join(...parts.map(String));
	}

	/**
	 * Create and return a new `Path` instance.
	 */
	static create(filePath: PortablePath): Path {
		return new Path(filePath);
	}

	/**
	 * Convert a path-like value to a formatted path string.
	 */
	static path(part: PortablePath): FilePath {
		return new Path(part).path();
	}

	/**
	 * Like `create()` but also resolves the path against a working directory.
	 */
	static resolve(filePath: PortablePath, cwd?: PortablePath): Path {
		return Path.create(filePath).resolve(cwd);
	}

	/**
	 * Append path parts to the end of the current path
	 * and return a new `Path` instance.
	 */
	append(...parts: PortablePath[]): Path {
		return new Path(this.internalPath, ...parts);
	}

	/**
	 * Returns true if both paths are equal using strict equality.
	 */
	equals(filePath: PortablePath): boolean {
		return this.path() === Path.create(filePath).path();
	}

	/**
	 * Return the extension (if applicable) with or without leading period.
	 */
	ext(withoutPeriod: boolean = false): string {
		const ext = path.extname(this.path());

		return withoutPeriod && ext.startsWith('.') ? ext.slice(1) : ext;
	}

	/**
	 * Return true if the current path exists.
	 */
	exists(): boolean {
		return fs.existsSync(this.path());
	}

	/**
	 * Return true if the current path is absolute.
	 */
	isAbsolute(): boolean {
		return path.isAbsolute(this.path());
	}

	/**
	 * Return true if the current path is a folder.
	 */
	isDirectory(): boolean {
		return fs.statSync(this.path()).isDirectory();
	}

	/**
	 * Return true if the current path is a file.
	 */
	isFile(): boolean {
		return fs.statSync(this.path()).isFile();
	}

	/**
	 * Return the file name (with optional extension) or folder name.
	 */
	name(withoutExtension: boolean = false): string {
		let name = path.basename(this.path());

		if (withoutExtension) {
			name = name.replace(this.ext(), '');
		}

		return name;
	}

	/**
	 * Return the parent folder as a new `Path` instance.
	 */
	parent(): Path {
		return new Path(path.dirname(this.internalPath));
	}

	/**
	 * Return the current path as a normalized string.
	 */
	path(): FilePath {
		if (!this.isNormalized) {
			this.isNormalized = true;
			this.internalPath = path.normalize(this.internalPath);
		}

		return this.internalPath;
	}

	/**
	 * Prepend path parts to the beginning of the current path
	 * and return a new `Path` instance.
	 */
	prepend(...parts: PortablePath[]): Path {
		return new Path(...parts, this.internalPath);
	}

	/**
	 * Returns a canonical path by resolving directories and symlinks.
	 */
	// istanbul ignore next
	realPath(): FilePath {
		return fs.realpathSync.native(this.path());
	}

	/**
	 * Return a new relative `Path` instance from the current
	 * "from" path to the defined "to" path.
	 */
	relativeTo(to: PortablePath): Path {
		return new Path(path.relative(this.internalPath, String(to)));
	}

	/**
	 * Return a new `Path` instance where the current path is accurately
	 * resolved against the defined working directory.
	 */
	resolve(cwd?: PortablePath): Path {
		return new Path(path.resolve(String(cwd ?? process.cwd()), this.internalPath));
	}

	toJSON(): FilePath {
		return this.path();
	}

	toString(): FilePath {
		return this.path();
	}
}
