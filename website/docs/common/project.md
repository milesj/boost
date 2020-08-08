---
title: Project
---

A `Project` class provides workspace and package metadata for a project. A project is denoted by a
root `package.json` file and abides the NPM and Node.js module pattern. To begin, import and
instantiate the `Project` class with a path to the project's root.

```ts
import { Project } from '@boost/common';

const project = new Project();

// Access package.json contents
const pkg = project.getPackage();
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

Information about workspaces and packages can be accessed with following methods:

- `getWorkspaceGlobs(): string[]` - Returns a list of all workspaces globs as they are defined in
  `package.json` (under `workspaces`) or `lerna.json` (under `packages`).
- `getWorkspacePackages(): WorkspacePackage[]` - Returns a list of all workspace packages, their
  `package.json` content, and associated metadata.
- `getWorkspacePackagePaths(): string[]` - Returns a list of file system paths for all workspaces
  packages.
