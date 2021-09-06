/* eslint-disable @typescript-eslint/member-ordering */

import glob from 'fast-glob';
import { Memoize } from '@boost/decorators';
import { CommonError } from './CommonError';
import { Path } from './Path';
import * as json from './serializers/json';
import * as yaml from './serializers/yaml';
import { PackageStructure, PortablePath, WorkspaceMetadata, WorkspacePackage } from './types';

export interface ProjectSearchOptions {
	relative?: boolean;
}

export class Project {
	readonly root: Path;

	constructor(root: PortablePath = process.cwd()) {
		this.root = Path.create(root);
	}

	/**
	 * Normalize a glob pattern or path for use on POSIX and Windows machines.
	 * @link https://github.com/mrmlnc/fast-glob#how-to-write-patterns-on-windows
	 */
	static normalizeGlob(pattern: string): string {
		return pattern.replace(/\\/g, '/');
	}

	/**
	 * Create a workspace metadata object composed of absolute file paths.
	 */
	createWorkspaceMetadata(jsonPath: PortablePath): WorkspaceMetadata {
		const metadata: Partial<WorkspaceMetadata> = {};
		const filePath = Path.create(jsonPath);
		const pkgPath = filePath.parent();
		const wsPath = pkgPath.parent();

		metadata.jsonPath = filePath;
		metadata.packagePath = pkgPath;
		metadata.packageName = pkgPath.name();
		metadata.workspacePath = wsPath;
		metadata.workspaceName = wsPath.name();

		return metadata as WorkspaceMetadata;
	}

	/**
	 * Return the contents of the root `package.json`.
	 */
	getPackage<T extends PackageStructure>(): T {
		const pkgPath = this.root.append('package.json');

		if (!pkgPath.exists()) {
			throw new CommonError('PROJECT_NO_PACKAGE');
		}

		return json.load<T>(pkgPath);
	}

	/**
	 * Return a list of all workspace globs as they are configured
	 * in `package.json` or `lerna.json`. Glob patterns will _always_
	 * use forward slashes, regardless of OS.
	 */
	@Memoize()
	getWorkspaceGlobs(options: ProjectSearchOptions = {}): string[] {
		const pkgPath = this.root.append('package.json');
		const lernaPath = this.root.append('lerna.json');
		const pnpmPath = this.root.append('pnpm-workspace.yaml');
		const workspacePaths = [];

		// Yarn
		if (pkgPath.exists()) {
			const pkg = json.load<PackageStructure>(pkgPath);

			if (pkg.workspaces) {
				if (Array.isArray(pkg.workspaces)) {
					workspacePaths.push(...pkg.workspaces);
				} else if (Array.isArray(pkg.workspaces.packages)) {
					workspacePaths.push(...pkg.workspaces.packages);
				}
			}
		}

		// Lerna
		if (workspacePaths.length === 0 && lernaPath.exists()) {
			const lerna = json.load<{ packages: string[] }>(lernaPath);

			if (Array.isArray(lerna.packages)) {
				workspacePaths.push(...lerna.packages);
			}
		}

		// PNPM
		if (workspacePaths.length === 0 && pnpmPath.exists()) {
			const pnpm = yaml.load<{ packages: string[] }>(pnpmPath);

			if (Array.isArray(pnpm.packages)) {
				workspacePaths.push(...pnpm.packages);
			}
		}

		return workspacePaths.map((workspace) => {
			const path = options.relative
				? new Path(workspace).path()
				: this.root.append(workspace).path();

			return Project.normalizeGlob(path);
		});
	}

	/**
	 * Return all `package.json`s across all workspaces and their packages.
	 * Once loaded, append workspace path metadata.
	 */
	@Memoize()
	getWorkspacePackages<T extends PackageStructure>(): WorkspacePackage<T>[] {
		return glob
			.sync(this.getWorkspaceGlobs({ relative: true }), {
				absolute: true,
				cwd: this.root.path(),
				onlyDirectories: true,
			})
			.map((pkgPath) => {
				const filePath = new Path(pkgPath, 'package.json');

				return {
					metadata: this.createWorkspaceMetadata(filePath),
					package: json.load<T>(filePath),
				};
			});
	}

	/**
	 * Return a list of all workspace package paths, resolved against the file system.
	 * Absolute file paths are returned unless the `relative` option is true.
	 */
	@Memoize()
	getWorkspacePackagePaths(options: ProjectSearchOptions = {}): Path[] {
		return glob
			.sync(this.getWorkspaceGlobs({ relative: true }), {
				absolute: !options.relative,
				cwd: this.root.path(),
				onlyDirectories: true,
				onlyFiles: false,
			})
			.map(Path.create);
	}
}
