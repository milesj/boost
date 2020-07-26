# Common utilities

A collection of common utilities and helpers for general purpose or Boost powered applications.

## Installation

```
yarn add @boost/common
```

## Classes

- [Contract](./common/contract.md)
- [Path](./common/path.md)
- [PathResolver](./common/path-resolver.md)
- [Project](./common/project.md)

## Decorators

### `@Bind`

Automatically binds a class method's `this` context to its current instance, even when the method is
dereferenced, which is the primary use-case for this decorator. This is an alternative to manually
`bind()`ing within the constructor, or using class properties with anonymous functions.

```ts
import { Bind } from '@boost/common';

class Example {
  @Bind
  static test() {
    return this; // Class constructor
  }

  @Bind
  test() {
    return this; // Class instance
  }
}

const example = new Example();
const { test } = example;

example.test() = test(); // true
```

## Helpers

### `createBlueprint`

> createBlueprint\<T>(factory: BlueprintFactory\<T>): Blueprint<T>

Can be used to generate a blueprint object for use within
[optimal](https://github.com/milesj/optimal) checks. All supported optimal predicates are passed as
an object to the factory.

```ts
import { optimal, createBlueprint } from '@boost/common';

const blueprint = createBlueprint(({ string, number }) => ({
  name: string().required(),
  age: number().gt(0),
}));

const data = optimal({}, blueprint);
```

### `formatMs`

> formatMs(time: number, options?: Options): string

Can be used to format a UNIX timestamp in milliseconds into a shorthand human readable format. Wraps
the [pretty-ms](https://www.npmjs.com/package/pretty-ms) package to handle infinite numbers, zeros,
and more.

```ts
import { formatMs } from '@boost/common';

formatMs(1337000000); // 15d 11h 23m 20s
```

### `instanceOf`

> instanceOf(object: unknown, declaration: Constructor, loose?: boolean): boolean

Performs a loose instance check by comparing class names up the prototype chain if `instanceof`
initially fails. To disable this loose check, pass `false` as the 3rd argument.

```ts
import { instanceOf } from '@boost/common';

if (instanceOf(error, Error)) {
  console.log(error.stack);
}
```

Generics can be used to type the object being checked. This will default to the declaration passed
to the 2nd argument.

```ts
instanceOf<ParseError>(error, Error);
```

> Loose checks can be useful if multiple copies of the same class declaration exists in the module
> tree. For example, multiple versions of the same package are imported.

### `isEmpty`

> isEmpty(value: unknown): boolean

Returns `true` if an object has no properties, an array has no items, or the value is falsy,
otherwise, it returns `false`.

```ts
import { isEmpty } from '@boost/common';

isEmpty({}); // true
isEmpty({ name: 'Boost' }); // false

isEmpty([]); // true
isEmpty(['Boost']); // false
```

### `isFilePath`

> isFilePath(path: PortablePath): boolean

Returns `true` if a string or `Path` instance looks like a file system path, by checking for
absolute or relative path markers, or the existence of path separating slashes. Will return `false`
for values that are only the file or folder name.

```ts
import { isFilePath } from '@boost/common';

isFilePath('./path/to/file.ts'); // true
isFilePath(new Path('/path/to/folder')); // true
isFilePath('file.ts'); // false
```

### `isModuleName`

> isModuleName(name: ModuleName): boolean

Returns `true` if a string is a valid Node module package name, according to the rules defined in
[validate-npm-package-name](https://github.com/npm/validate-npm-package-name). Will `return` false
for native builtin modules, like `fs`, and for the old name format.

```ts
import { isModuleName } from '@boost/common';

isModuleName('boost'); // true
isModuleName('@boost/common'); // true
isModuleName('fs'); // false
```

### `isObject`

> isObject\<T>(value: unknown): value is T

Returns `true` if the value is a plain object.

```ts
import { isObject } from '@boost/common';

isObject({}); // true
isObject([]); // false
```

Generics can be used to type the return value of the object (when necessary).

```ts
interface Person {
  name: string;
}

if (isObject<Person>(person)) {
  console.log(person.name);
}
```

### `parseFile`

> parseFile\<T>(path: string): T

Can be used to *sync*hronously parse and return an object for the following file types & extensions:
`js`, `jsx`, `json`, `json5`, `yaml`, `yml`. The function requires an absolute file path, and any
unsupported file type will throw an error.

```ts
import { parseFile } from '@boost/common';

const data: ReturnShape = parseFile('/absolute/file/path');
```

### `requireModule`

> requireModule\<T>(path: string): T

Works in a similar fashion to the native NodeJS `require()`, but also handles files built with Babel
or TypeScript, by properly returning the `default` export, and also allowing the expected type to be
defined.

```ts
import { requireModule } from '@boost/common';

const defaultImport: ReturnShape = requireModule('../../some/module');
```

### `toArray`

> toArray\<T>(value?: T | T[]): T[]

Converts a non-array to an array. If the provided value is falsy, an empty array is returned. If the
provided value is truthy and a non-array, an array of 1 item is returned.

```ts
import { toArray } from '@boost/common';

toArray(123); // [123]
toArray('abc'); // ['abc']
toArray(['a', 'b', 'c']); // ['a', 'b', 'c']
```

## Serializers

### JSON

Powered by the [JSON5](https://www.npmjs.com/package/json5) package, the `json` serializer can be
used to parse and stringify JSON data.

```ts
import { json } from '@boost/common';

json.parse(data);
json.stringify(data);
```

### YAML

Powered by the [YAML](https://www.npmjs.com/package/yaml) package, the `yaml` serializer can be used
to parse and stringify YAML data.

```ts
import { yaml } from '@boost/common';

yaml.parse(data);
yaml.stringify(data);
```
