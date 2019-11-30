# `Path`

A `Path` class is an immutable abstraction around file/module paths and the Node.js `fs` and `path`
modules. It aims to solve cross platform and operating system related issues in a straight forward
way. To begin, import and instantiate the `Path` class, with either a single path, or a list of path
parts that will be joined.

```ts
import { Path } from '@boost/common';

const absPath = new Path('/root/some/path');
const relPath = new Path('some/path', '../move/around', 'again');
```

The following methods are available on the class instance. The `PortablePath` type is a union of
`string | Path`.

- `append(...parts: PortablePath[]): Path` - Append path parts to the end of the current path and
  return a new `Path` instance.
- `equals(path: PortablePath): boolean` - Returns true if both paths are equal using strict
  equality.
- `ext(withoutPeriod?: boolean): string` - Return the extension (if applicable) with or without
  leading period.
- `exists(): boolean` - Return true if the current path exists on the file system.
- `isAbsolute(): boolean` - Return true if the current path is absolute.
- `isDirectory(): boolean` - Return true if the current path is a folder.
- `isFile(): boolean` - Return true if the current path is a file.
- `name(withoutExtension?: boolean): string` - Return the file name (with optional extension) or
  folder name.
- `parent(): Path` - Return the parent folder as a new `Path` instance.
- `path(): FilePath` - Return the current path as a normalized string.
- `prepend(...parts: PortablePath[]): Path` - Prepend path parts to the beginning of the current
  path and return a new `Path` instance.
- `relativeTo(to: PortablePath): Path` - Return a new relative `Path` instance from the current
  "from" path to the defined "to" path.
- `toString(): FilePath` - Return the current path as a normalized string.

## Resolved Paths

By default, the `Path` class operates on the defined path parts as-is. If you would prefer to
operate against real or resolved paths, use the `Path#realPath()` and `Path#resolve()` methods
respectively. The current path is
[resolved against](https://nodejs.org/api/path.html#path_path_resolve_paths) the defined current
working directory (`process.cwd()`).

```ts
path.path(); // Possibly inaccurate
path.resolve().path(); // Resolved accurately
```

## Static Factories

The static `Path.create()` and `Path.resolve()` methods can be used to factory a `Path` instance
from a string or an existing instance. Especially useful when used in combination with the
`PortablePath` type.

```ts
Path.create('some/file/path'); // Path
```
