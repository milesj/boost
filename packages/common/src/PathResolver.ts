import doResolve from 'resolve';
import { CommonError } from './CommonError';
import { ModulePath } from './ModulePath';
import { Path } from './Path';
import { Lookup, ModuleResolver, Pathable, PortablePath, ResolvedLookup } from './types';

export class PathResolver {
	private lookups: Lookup[] = [];

	private resolver: ModuleResolver;

	constructor(resolver?: ModuleResolver) {
		this.resolver = resolver ?? PathResolver.defaultResolver;
	}

	static async defaultResolver(path: string, startDir?: string): Promise<string> {
		return new Promise((resolve, reject) => {
			// eslint-disable-next-line promise/prefer-await-to-callbacks
			doResolve(path, { basedir: startDir, includeCoreModules: false }, (error, foundPath) => {
				if (error || !foundPath) {
					reject(error);
				} else {
					resolve(foundPath);
				}
			});
		});
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
	 * Add a file system path with a list of possible extensions to look for,
	 * resolved against the defined current working directory (or `process.cwd()` otherwise).
	 */
	lookupFilePathWithExts(filePath: PortablePath, exts: string[], cwd?: PortablePath): this {
		exts.forEach((ext) => {
			const extWithPeriod = ext.startsWith('.') ? ext : `.${ext}`;

			this.lookupFilePath(`${filePath}${extWithPeriod}`, cwd);
		});

		return this;
	}

	/**
	 * Add a Node.js module, either by name or relative path, to look for.
	 */
	lookupNodeModule(moduleId: PortablePath): this {
		this.lookups.push({
			path: ModulePath.create(moduleId),
			raw: ModulePath.create(moduleId),
			type: 'node-module',
		});

		return this;
	}

	/**
	 * Given a list of lookups, attempt to find the first real/existing path and
	 * return a resolved absolute path. If a file system path, will check using `fs.exists`.
	 * If a node module path, will check using the provided resolver.
	 */
	async resolve(startDir?: PortablePath): Promise<ResolvedLookup> {
		let resolvedPath: PortablePath = '';
		let resolvedLookup: Lookup | undefined;

		// TODO: Switch to Promise.any() in Node.js v15
		for (const lookup of this.lookups) {
			// Check that the file exists on the file system.
			if (lookup.type === 'file-system' && (lookup.path as Path).exists()) {
				resolvedPath = lookup.path;
				resolvedLookup = lookup;
				break;
			}

			// Check that the module path exists using Node's module resolution.
			// The resolver function will throw an error if not found.
			if (lookup.type === 'node-module') {
				try {
					// eslint-disable-next-line no-await-in-loop
					resolvedPath = await this.resolver(
						lookup.path.path(),
						startDir ? String(startDir) : undefined,
					);
					resolvedLookup = lookup;
					break;
				} catch {
					// Display errors?
				}
			}
		}

		if (!resolvedPath || !resolvedLookup) {
			throw new CommonError('PATH_RESOLVE_LOOKUPS', [
				this.lookups
					.map((lookup) => `  - ${lookup.path} (${lookup.type.replace('-', ' ')})`)
					.join('\n'),
			]);
		}

		return {
			originalSource: resolvedLookup.raw,
			resolvedPath: Path.create(resolvedPath),
			type: resolvedLookup.type,
		};
	}

	/**
	 * Like `resolve()` but only returns the resolved file path.
	 */
	async resolvePath(): Promise<Pathable> {
		return (await this.resolve()).resolvedPath;
	}
}
