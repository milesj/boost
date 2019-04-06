# Common Utilities

A collection of common utilities and helpers for general purpose or Boost powered applications.

## Installation

```
yarn add @boost/common
```

## Classes

### `Optionable`

The `Optionable` class is an abstract class, that provides a configurable options object layer, and
is meant to be the base super class. All classes that extend `Optionable` accept an options object
through the constructor, which is validated and built using
[optimal](https://milesj.gitbook.io/optimal).

To start, extend `Optionable` with an interface that represents the shape of the options object, and
implement the `blueprint` method, which is passed
[optimal predicates](https://milesj.gitbook.io/optimal/predicates) as an argument and must return an
[optimal blueprint](https://milesj.gitbook.io/optimal/usage#blueprint) that matches the interface
shape.

```ts
import { Optionable, Predicates } from '@boost/common';

export interface PluginOptions {
  name?: string;
  priority?: number;
}

export default class Plugin extends Optionable<PluginOptions> {
  blueprint({ number, string }: Predicates) {
    return {
      name: string().notEmpty(),
      priority: number().gte(0),
    };
  }
}
```

When the class is instantiated, the provided values will be checked and validated using the
blueprint. If invalid, an error will be thrown.

```ts
const plugin = new Plugin({
  name: 'Boost',
});
```

#### Configuring Options

Besides options being passed to the constructor, they can also be configured using the
`Optionable#configure` method, which accepts an object. Options passed to this method are checked
and validated using the same optiomal process.

```ts
plugin.configure({
  priority: 100,
});
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

export default class Plugin extends Optionable<PluginOptions> {
  constructor(options: PluginOptions) {
    super(options);
  }

  // ...
}
```
