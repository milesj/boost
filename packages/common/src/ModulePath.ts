import path from 'path';
import { ModuleID, Pathable, PortablePath } from './types';

/**
 * An immutable class for operating on Node.js module IDs, names, and paths.
 */
export class ModulePath implements Pathable {
	protected internalPath: string = '';

	protected isNormalized: boolean = false;

	constructor(...parts: PortablePath[]) {
		this.internalPath = path.join(...parts.map(String));
	}

	/**
	 * Create and return a new `ModulePath` instance.
	 */
	static create(id: PortablePath): ModulePath {
		return new ModulePath(id);
	}

	/**
	 * Convert a module path-like value to a formatted module path string.
	 */
	static path(part: PortablePath): ModuleID {
		return new ModulePath(part).path();
	}

	/**
	 * Append path parts to the end of the current path
	 * and return a new `ModulePath` instance.
	 */
	append(...parts: PortablePath[]): ModulePath {
		return new ModulePath(this.internalPath, ...parts);
	}

	/**
	 * Return true if the module is scoped within a private namespace
	 * (starts with @).
	 *
	 */
	hasScope(): boolean {
		return this.internalPath.startsWith('@');
	}

	/**
	 * Return the module name without any trailing import paths,
	 * or optionally without the private scope.
	 */
	name(withoutScope: boolean = false): string {
		const parts = this.path().split('/');

		if (this.hasScope() && withoutScope) {
			return parts[1];
		}

		return parts.slice(0, this.hasScope() ? 2 : 1).join('/');
	}

	/**
	 * Return the current module path as a normalized string.
	 */
	path(): ModuleID {
		if (!this.isNormalized) {
			this.isNormalized = true;
			this.internalPath = path
				.normalize(this.internalPath)
				// Node modules must always use forward slashes
				.replace(/\\/g, '/');
		}

		return this.internalPath;
	}

	/**
	 * Return the private scope with leading @, or null if not defined.
	 */
	scope(): string | null {
		if (!this.hasScope()) {
			return null;
		}

		return this.path().slice(0, this.path().indexOf('/'));
	}

	toJSON(): ModuleID {
		return this.path();
	}

	toString(): ModuleID {
		return this.path();
	}
}
