---
title: Path
---

A `Path` class is an immutable abstraction around file/module paths and the Node.js `fs` and `path`
modules. It aims to solve cross platform and operating system related issues in a straight forward
way. To begin, import and instantiate the `Path` class, with either a single path, or a list of path
parts that will be joined.

```ts
import { Path } from '@boost/common';

const absPath = new Path('/root/some/path');
const relPath = new Path('some/path', '../move/around', 'again');
```

## Resolved paths

By default, the `Path` class operates on the defined path parts as-is. If you would prefer to
operate against real or resolved paths, use the `Path#realPath()` and `Path#resolve()` methods
respectively. The current path is
[resolved against](https://nodejs.org/api/path.html#path_path_resolve_paths) the defined current
working directory (`process.cwd()`).

```ts
path.path(); // Possibly inaccurate
path.resolve().path(); // Resolved accurately
```

## Static factories

The static `Path.create()` and `Path.resolve()` methods can be used to factory a `Path` instance
from a string or an existing instance. Especially useful when used in combination with the
`PortablePath` type.

```ts
Path.create('some/file/path'); // Path
```

## API

The following methods are available on the class instance. In the examples below, the `PortablePath`
type is a union of `FilePath | Path`, and `FilePath` is a `string`.

### `.create`

> Path.create(filePath: PortablePath): Path

Create and return a new `Path` instance if a string. If already a `Path`, return as is.

```ts
const a = Path.create('foo');
const b = Path.create(new Path('bar'));
```

### `.resolve`

> Path.resolve(filePath: PortablePath, cwd?: PortablePath): Path

Like `create()` but also resolves the path against the current working directory (defaults to
`process.cwd()`).

```ts
const path = Path.resolve('foo', '/cwd'); // => /cwd/foo
```

### `append`

> Path#append(...parts: PortablePath[]): Path

Append path parts to the end of the current path and return a new `Path` instance.

```ts
const a = new Path('foo', 'bar'); // => foo/bar
const b = a.append('baz'); // => foo/bar/baz
```

### `equals`

> Path#equals(path: PortablePath): boolean

Returns true if both paths are equal using strict equality.

```ts
const a = new Path('foo');
const b = new Path('bar');

a.equals(b); // => false
```

### `ext`

> Path#ext(withoutPeriod?: boolean): string

Return the extension (if applicable) with or without leading period.

```ts
const path = new Path('some/path/to/file.js');

path.ext(); // => .js
path.ext(true); // => js
```

### `exists`

> Path#exists(): boolean

Return true if the current path exists on the file system.

```ts
const path = new Path('some/path/to/file.js');

path.exists(); // => false
```

### `isAbsolute`

> Path#isAbsolute(): boolean

Return true if the current path is absolute. _Does not_ verify existence on the file system.

```ts
const nixPath = new Path('/some/path/to/file.js');
const winPath = new Path('C:/some/path/to/file.js');

nixPath.exists(); // => true
winPath.exists(); // => true
```

### `isDirectory`

> Path#isDirectory(): boolean

Return true if the current path is a folder.

```ts
const filePath = new Path('some/path/to/file.js');
const folderPath = new Path('some/path/to/folder');

filePath.isDirectory(); // => false
folderPath.isDirectory(); // => true
```

### `isFile`

> Path#isFile(): boolean

Return true if the current path is a file.

```ts
const filePath = new Path('some/path/to/file.js');
const folderPath = new Path('some/path/to/folder');

filePath.isFile(); // => true
folderPath.isFile(); // => false
```

### `name`

> Path#name(withoutExtension?: boolean): string

Return the file name (with optional extension) or folder name.

```ts
const path = new Path('some/path/to/file.js');

path.name(); // => file.js
path.name(true); // => file
```

### `parent`

> Path#parent(): Path

Return the parent folder as a new `Path` instance.

```ts
const path = new Path('foo/bar/baz');
const parent = path.parent(); // => foo/bar
```

### `path`

> Path#path(): FilePath

Return the current path as a normalized string. Is also triggered when the `Path` instance is cast
to a string.

```ts
const path = new Path('foo/bar/baz');

path.path(); // => foo/bar/bar
```

### `prepend`

> Path#prepend(...parts: PortablePath[]): Path

Prepend path parts to the beginning of the current path and return a new `Path` instance.

```ts
const a = new Path('foo', 'bar'); // => foo/bar
const b = a.append('baz'); // => bar/foo/bar
```

### `relativeTo`

> Path#relativeTo(to: PortablePath): Path

Return a new relative `Path` instance from the current "from" path to the defined "to" path.

```ts
const from = new Path('/foo/bar/baz');
const to = from.relativeTo('/foo/qux'); // => ../../qux
```

### `toString`

> Path#toString(): FilePath

Return the current path as a normalized string. See [path()](#path).
