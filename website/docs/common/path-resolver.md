---
title: PathResolver
---

A `PathResolver` can be used to find a real path amongst a list of possible lookups. A lookup is
either a file system path or a Node.js module. If a path is found, an absolute resolved
[`Path`](./path.md) instance is returned, otherwise an error is thrown.

A perfect scenario for this mechanism would be finding a valid configuration file, which we'll
demonstrate below. Import and instantiate the class to begin.

```ts
import { PathResolver } from '@boost/common';

const resolver = new PathResolver();
```

To add a file system lookup, use the `PathResolver#lookupFilePath()` method, which requires a path
and an optional current working directory (defaults to `process.cwd()`).

```ts
// Look in current directory
resolver
  .lookupFilePath('tool.config.js')
  .lookupFilePath('tool.config.json')
  .lookupFilePath('tool.config.yaml');

// Look in a folder
resolver.lookupFilePath('configs/tool.js');

// Look in user's home directory
resolver.lookupFilePath('tool.config.js', os.homedir());
```

And to add a Node.js module lookup, use the `PathResolver#lookupNodeModule()` method, which accepts
a module name or path.

```ts
// Look in module (assuming index export)
resolver.lookupNodeModule('tool-config-module');

// Look in module with sub-path
resolver.lookupNodeModule('tool-config-module/lib/configs/tool.js');
```

Once all the lookup paths have been defined, the `PathResolver#resolve()` method will iterate
through them in order until one is found. If a file system path, `fs.existsSync()` will be used to
check for existence, while `require.resolve()` will be used for Node.js modules. If found, a result
object will be returned with the resolved `Path` and original lookup parts.

```ts
const { originalPath, resolvedPath, type } = resolver.resolve();
```

If you'd prefer to only have the resolved path returned, the `PathResolver#resolvePath()` method can
be used instead.

```ts
const resolvedPath = resolver.resolvePath();
```

## API

### `getLookupPaths`

> PathResolver#getLookupPaths(): string[]

Return a list of all lookup paths that have been registered.

```ts
resolver.lookupFilePath('file.js').lookupNodeModule('module-name');

const paths = resolver.getLookupPaths(); // => ['file.js', 'module-name']
```

### `lookupFilePath`

> PathResolver#lookupFilePath(filePath: PortablePath, cwd?: PortablePath): this

Add a file system path to look for, resolved against the defined current working directory (or
`process.cwd()` otherwise).

```ts
resolver.lookupFilePath('./some/path/to/file.js');
```

### `lookupNodeModule`

> PathResolver#lookupNodeModule(modulePath: PortablePath): this

Add a Node.js module, either by name or relative path, to look for.

```ts
resolver.lookupNodeModule('module-name');
```

### `resolve`

> PathResolver#resolve(): { originalPath: Path; resolvedPath: Path; type: LookupType; }

Given a list of lookups, attempt to find the first real/existing path and return a resolved absolute
path. If a file system path, will check using `fs.exists`. If a node module path, will check using
`require.resolve`.

```ts
const { originalPath, resolvedPath, type } = resolver.resolve();
```

### `resolvePath`

> PathResolver#resolvePath(): Path

Like `resolve()` but only returns the resolved path.

```ts
const resolvedPath = resolver.resolvePath();
```
