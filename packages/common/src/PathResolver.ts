import { CommonError } from './CommonError';
import { Path } from './Path';
import { Lookup, LookupType, ModuleResolver, PortablePath } from './types';

export class PathResolver {
	private lookups: Lookup[] = [];

	private resolver: ModuleResolver;

	constructor(resolver?: ModuleResolver) {
		this.resolver = resolver ?? require.resolve;
	}

	/**
	 * Return a list of all lookup paths.
	 */
	getLookupPaths(): string[] {
		return this.lookups.map((lookup) => lookup.path.path());
	}

	/**
	 * Add a file system path to look for, resolved against the defined current
	 * working directory (or `process.cwd()` otherwise).
	 */
	lookupFilePath(filePath: PortablePath, cwd?: PortablePath): this {
		this.lookups.push({
			path: Path.resolve(filePath, cwd),
			raw: Path.create(filePath),
			type: 'file-system',
		});

		return this;
	}

	/**
	 * Add a Node.js module, either by name or relative path, to look for.
	 */
	lookupNodeModule(modulePath: PortablePath): this {
		const path = Path.create(modulePath);

		this.lookups.push({
			path,
			raw: path,
			type: 'node-module',
		});

		return this;
	}

	/**
	 * Given a list of lookups, attempt to find the first real/existing path and
	 * return a resolved absolute path. If a file system path, will check using `fs.exists`.
	 * If a node module path, will check using `require.resolve`.
	 */
	resolve(): {
		originalPath: Path;
		resolvedPath: Path;
		type: LookupType;
	} {
		let resolvedPath: PortablePath = '';
		let resolvedLookup: Lookup | undefined;

		this.lookups.some((lookup) => {
			// Check that the file exists on the file system.
			if (lookup.type === 'file-system') {
				if (lookup.path.exists()) {
					resolvedPath = lookup.path;
					resolvedLookup = lookup;
				} else {
					return false;
				}

				// Check that the module path exists using Node's module resolution.
				// The `require.resolve` function will throw an error if not found.
			} else if (lookup.type === 'node-module') {
				try {
					resolvedPath = this.resolver(lookup.path.path());
					resolvedLookup = lookup;
				} catch {
					return false;
				}
			}

			return true;
		});

		if (!resolvedPath || !resolvedLookup) {
			throw new CommonError('PATH_RESOLVE_LOOKUPS', [
				this.lookups
					.map((lookup) => `  - ${lookup.path} (${lookup.type.replace('-', ' ')})`)
					.join('\n'),
			]);
		}

		return {
			originalPath: resolvedLookup.raw,
			resolvedPath: Path.create(resolvedPath),
			type: resolvedLookup.type,
		};
	}

	/**
	 * Like `resolve()` but only returns the resolved path.
	 */
	resolvePath(): Path {
		return this.resolve().resolvedPath;
	}
}
