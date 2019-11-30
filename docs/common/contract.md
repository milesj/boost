# `Contract`

A `Contract` is an abstract class that implements the `Optionable` interface, which provides an
options object layer, and is meant to be inherited from as a super class. All classes that extend
`Contract` accept an options object through the constructor, which is validated and built using
[optimal](https://milesj.gitbook.io/optimal).

To start, extend `Contract` with a generic interface that represents the shape of the options
object. Next, implement the abstract `Contract#blueprint()` method, which is passed
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

To modify the options object after instantiation, the `Contract#configure()` method should be used.

```ts
plugin.configure({ name: 'Boost' });
```

## Required Options

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
