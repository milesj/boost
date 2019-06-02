# Common Utilities

A collection of common utilities and helpers for general purpose or Boost powered applications.

## Installation

```
yarn add @boost/common
```

## Classes

### `Contract`

A `Contract` is an abstract class that implements the `Optionable` interface, which provides an
options object layer, and is meant to be inherited from as a super class. All classes that extend
`Contract` accept an options object through the constructor, which is validated and built using
[optimal](https://milesj.gitbook.io/optimal).

To start, extend `Contract` with a generic interface that represents the shape of the options
object. Next, implement the abstract `blueprint` method, which is passed
[optimal predicates](https://milesj.gitbook.io/optimal/predicates) as an argument, and must return
an [optimal blueprint](https://milesj.gitbook.io/optimal/usage#blueprint) that matches the generic
interface.

```ts
import { Contract, Predicates } from '@boost/common';

export interface PluginOptions {
  name?: string;
  priority?: number;
}

export default class Plugin extends Contract<PluginOptions> {
  blueprint({ number, string }: Predicates) {
    return {
      name: string().notEmpty(),
      priority: number().gte(0),
    };
  }
}
```

When the class is instantiated, the provided values will be checked and validated using the
blueprint. If invalid, an error will be thrown. Furthermore, the `Contract#options` property is
`readonly`, and will error when mutated.

```ts
const plugin = new Plugin({
  name: 'Boost',
});

// Boost
const { name } = plugin.options;
```

To modify the options object after instantiation, the `Contract#configure` method should be used.

```ts
plugin.configure({ name: 'name' });
```

#### Required Options

By default, the options argument in the constructor is optional, and if your interface has a
required property, it will not be bubbled up in TypeScript. To support this, the constructor will
need to be overridden so that the argument can be marked as non-optional.

```ts
export interface PluginOptions {
  name: string;
  priority?: number;
}

export default class Plugin extends Contract<PluginOptions> {
  constructor(options: PluginOptions) {
    super(options);
  }

  // ...
}
```

## Helpers

### `formatMs`

The `formatMs(time: number, options?: Options)` function can be used to format a UNIX timestamp in
milliseconds into a shorthand human readable format. Wraps the
[pretty-ms](https://www.npmjs.com/package/pretty-ms) package to handle infinite numbers, zeros, and
more.

```ts
import { formatMs } from '@boost/common';

formatMs(1337000000); // 15d 11h 23m 20s
```

### `instanceOf`

The `instanceOf(object: unknown, declaration: Constructor, loose?: boolean)` function performs a
loose instance check by comparing class names up the prototype chain if `instanceof` initially
fails. To disable this loose check, pass `false` as the 3rd argument.

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

The `isEmpty(value: unknown)` function returns `true` if an object has no properties, an array has
no items, or the value is falsy, otherwise, it returns `false`.

```ts
import { isEmpty } from '@boost/common';

isEmpty({}); // true
isEmpty({ name: 'Boost' }); // false

isEmpty([]); // true
isEmpty(['Boost']); // false
```

### `isObject`

The `isObject(value: unknown)` function returns `true` if the value is a plain object.

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

The `parseFile(path: string)` function can be used to *sync*hronously parse and return an object for
the following file types & extensions: `js`, `jsx`, `json`, `json5`, `yaml`, `yml`. The function
requires an absolute file path, and any unsupported file type will throw an error.

```ts
import { parseFile } from '@boost/common';

const data: ReturnShape = parseFile('/absolute/file/path');
```

### `requireModule`

The `requireModule(path: string)` function works in a similar fashion to the native NodeJS
`require()`, but also handles files built with Babel or TypeScript, by properly returning the
`default` export, and also allowing the expected type to be defined.

```ts
import { requireModule } from '@boost/common';

const defaultImport: ReturnShape = requireModule('../../some/module');
```

### `toArray`

The `toArray(value: unknown)` function does exactly as its name states, it converts a non-array to
an array.

```ts
import { toArray } from '@boost/common';

toArray(123); // [123]
toArray('abc'); // ['abc']
toArray(['a', 'b', 'c']); // ['a', 'b', 'c']
```
