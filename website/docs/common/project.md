---
title: Project
---

A `Project` class provides workspace and package metadata for a project. A project is denoted by a
root `package.json` file and abides the NPM and Node.js module pattern. To begin, import and
instantiate the `Project` class with a path to the project's root.

```ts
import { Project } from '@boost/common';

const project = new Project();
```

> Root defaults to `process.cwd()` if not provided.

## Workspaces

The primary feature of this class is to extract metadata about a project's workspaces. Workspaces
are used to support multi-package architectures known as monorepos, typically through
[Yarn](https://yarnpkg.com/features/workspaces), [PNPM](https://pnpm.js.org/en/pnpm-workspace_yaml),
or [Lerna](https://github.com/lerna/lerna#lernajson). In Boost, our implementation of workspaces
aligns with:

- **Project** - Typically a repository with a root `package.json`. Can either be a collection of
  packages, or a package itself.
- **Package** - A folder with a `package.json` file that represents an NPM package. Contains source
  and test files specific to the package.
- **Workspace** - A folder that houses one or many packages.

## API

### `getPackage`

> Project#getPackage<T extends PackageStructure\>(): T

Return the contents of the `package.json` found in the defined root path.

```ts
const pkg = project.getPackage();
```

### `getWorkspaceGlobs`

> Project#getWorkspaceGlobs(options?: ProjectSearchOptions): FilePath[]

Returns a list of all workspaces globs as they are defined in `package.json` (under `workspaces`),
`lerna.json` (under `packages`), or `pnpm-workspace.yaml` (under `packages`).

```ts
const globs = project.getWorkspaceGlobs(); // => ['packages/*']
```

### `getWorkspacePackages`

> Project#getWorkspacePackages<T extends PackageStructure\>(): WorkspacePackage<T\>[]

Return all `package.json`s from all workspace packages. Once loaded, append workspace path metadata.

```ts
const pkgs = project.getWorkspacePackages();
```

### `getWorkspacePackagePaths`

> Project#getWorkspacePackagePaths(options?: ProjectSearchOptions): FilePath[]

Returns a list of file system paths for all workspaces packages.

```ts
const paths = project.getWorkspacePackagePaths(); // => ['packages/foo', 'packages/bar']
```
