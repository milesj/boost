import path from 'path';
import { Path } from './Path';
import { FilePath } from './types';

/**
 * An immutable class for operating on file system paths,
 * that always normalize using a forward slash ("/") for path separators.
 * Useful for paths found in configurations, globs, etc.
 */
export class VirtualPath extends Path {
	/**
	 * Return the current module path as a normalized string,
	 * converting all path separators to "/".
	 */
	override path(): FilePath {
		if (!this.isNormalized) {
			this.isNormalized = true;
			this.internalPath = path.normalize(this.internalPath).replace(/\\/g, '/');
		}

		return this.internalPath;
	}
}
