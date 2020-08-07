---
title: Contract
---

A `Contract` is an abstract class that implements the `Optionable` interface, which provides an
options object layer, and is meant to be inherited from as a super class. All classes that extend
`Contract` accept an options object through the constructor, which is validated and built using
[optimal](https://github.com/milesj/optimal).

To start, extend `Contract` with a generic interface that represents the shape of the options
object. Next, implement the abstract `Contract#blueprint()` method, which is passed
[optimal predicates](https://github.com/milesj/optimal/blob/master/docs/predicates.md) as an
argument, and must return an
[optimal blueprint](https://github.com/milesj/optimal/blob/master/docs/usage.md#blueprint) that
matches the generic interface.

```ts
import { Contract, Blueprint, Predicates } from '@boost/common';

export interface AdapterOptions {
  name?: string;
  priority?: number;
}

export default class Adapter extends Contract<AdapterOptions> {
  blueprint({ number, string }: Predicates): Blueprint<AdapterOptions> {
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
const adapter = new Adapter({
  name: 'Boost',
});

// Boost
const { name } = adapter.options;
```

To modify the options object after instantiation, the `Contract#configure()` method should be used.
This method accepts a partial object, or a function that receives the current full options object
and must return a partial object.

```ts
adapter.configure({ name: 'Boost' });

adapter.configure((prevOptions) => ({
  nestedObject: {
    ...prevOptions.nestedObject,
    some: 'value',
  },
}));
```

## Required options

By default, the options argument in the constructor is optional, and if your interface has a
required property, it will not be bubbled up in TypeScript. To support this, the constructor will
need to be overridden so that the argument can be marked as non-optional.

```ts
export interface AdapterOptions {
  name: string;
  priority?: number;
}

export default class Adapter extends Contract<AdapterOptions> {
  constructor(options: AdapterOptions) {
    super(options);
  }

  // ...
}
```
