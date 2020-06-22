import glob from 'fast-glob';
import { RuntimeError } from '@boost/internal';
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
      throw new RuntimeError('common', 'CM_PROJECT_NO_PACKAGE');
    }

    return parseFile<T>(pkgPath);
  }

  /**
   * Return a list of all workspace globs as they are configured
   * in `package.json` or `lerna.json`.
   */
  getWorkspaceGlobs(options: ProjectSearchOptions = {}): FilePath[] {
    const pkgPath = this.root.append('package.json');
    const lernaPath = this.root.append('lerna.json');
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

    if (options.relative) {
      return workspacePaths;
    }

    return workspacePaths.map((workspace) => this.root.append(workspace).path());
  }

  /**
   * Return all `package.json`s across all workspaces and their packages.
   * Once loaded, append workspace path metadata.
   */
  getWorkspacePackages<T extends PackageStructure>(): WorkspacePackage<T>[] {
    return glob
      .sync(
        this.getWorkspaceGlobs({
          relative: true,
        }).map((ws) => `${ws}/package.json`),
        {
          absolute: true,
          cwd: this.root.path(),
        },
      )
      .map((filePath) => ({
        metadata: this.createWorkspaceMetadata(filePath),
        package: parseFile<T>(filePath),
      }));
  }

  /**
   * Return a list of all workspace package paths, resolved against the file system.
   */
  getWorkspacePackagePaths(options: ProjectSearchOptions = {}): FilePath[] {
    return glob.sync(this.getWorkspaceGlobs({ relative: true }), {
      absolute: !options.relative,
      cwd: this.root.path(),
      onlyDirectories: true,
      onlyFiles: false,
    });
  }
}
