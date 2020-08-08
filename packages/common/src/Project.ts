/* eslint-disable @typescript-eslint/member-ordering */

import glob from 'fast-glob';
import { Memoize } from '@boost/decorators';
import CommonError from './CommonError';
import parseFile from './helpers/parseFile';
import Path from './Path';
import {
  FilePath,
  PackageStructure,
  WorkspaceMetadata,
  WorkspacePackage,
  PortablePath,
} from './types';

export interface ProjectSearchOptions {
  relative?: boolean;
}

export default class Project {
  readonly root: Path;

  constructor(root: PortablePath = process.cwd()) {
    this.root = Path.create(root);
  }

  /**
   * Create a workspace metadata object composed of absolute file paths.
   */
  createWorkspaceMetadata(jsonPath: PortablePath): WorkspaceMetadata {
    const metadata: Partial<WorkspaceMetadata> = {};
    const filePath = Path.create(jsonPath);
    const pkgPath = filePath.parent();
    const wsPath = pkgPath.parent();

    metadata.jsonPath = filePath.path();
    metadata.packagePath = pkgPath.path();
    metadata.packageName = pkgPath.name();
    metadata.workspacePath = wsPath.path();
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

    return parseFile<T>(pkgPath);
  }

  /**
   * Return a list of all workspace globs as they are configured
   * in `package.json` or `lerna.json`.
   */
  @Memoize()
  // eslint-disable-next-line complexity
  getWorkspaceGlobs(options: ProjectSearchOptions = {}): FilePath[] {
    const pkgPath = this.root.append('package.json');
    const lernaPath = this.root.append('lerna.json');
    const pnpmPath = this.root.append('pnpm-workspace.yaml');
    const workspacePaths = [];

    // Yarn
    if (pkgPath.exists()) {
      const pkg = parseFile<PackageStructure>(pkgPath);

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
      const lerna = parseFile<{ packages: string[] }>(lernaPath);

      if (Array.isArray(lerna.packages)) {
        workspacePaths.push(...lerna.packages);
      }
    }

    // PNPM
    if (workspacePaths.length === 0 && pnpmPath.exists()) {
      const pnpm = parseFile<{ packages: string[] }>(pnpmPath);

      if (Array.isArray(pnpm.packages)) {
        workspacePaths.push(...pnpm.packages);
      }
    }

    if (options.relative) {
      return workspacePaths;
    }

    return workspacePaths.map((workspace) => this.root.append(workspace).path());
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
          package: parseFile<T>(filePath),
        };
      });
  }

  /**
   * Return a list of all workspace package paths, resolved against the file system.
   */
  @Memoize()
  getWorkspacePackagePaths(options: ProjectSearchOptions = {}): FilePath[] {
    return glob.sync(this.getWorkspaceGlobs({ relative: true }), {
      absolute: !options.relative,
      cwd: this.root.path(),
      onlyDirectories: true,
      onlyFiles: false,
    });
  }
}
