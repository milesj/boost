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

const { name } = adapter.options; // => Boost
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

## API

### `blueprint`

> Contract#blueprint(predicates: Predicates, onConstruction: boolean): Blueprint<T\>

Shape of the options object passed to the constructor or to `Contract#configure()`. Utilizes
[optimal](https://github.com/milesj/optimal) for strict and thorough validation checks.

A boolean is passed as the 2nd argument to determine whether this is validating on class
instantiation (first time), or by calling `configure()` (all other times).

### `configure`

> Contract#configure(options?: Partial<T\> | ((options: Required<T\>) => Partial<T\>)):
> Readonly<Required<T\>\>

Use this method to modify the options object after instantiation. This method accepts a partial
object, or a function that receives the current full options object and must return a partial
object.

```ts
adapter.configure({ name: 'Boost' });

adapter.configure((prevOptions) => ({
	nestedObject: {
		...prevOptions.nestedObject,
		some: 'value',
	},
}));
```
