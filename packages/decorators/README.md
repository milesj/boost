# Decorators - Boost

[![Build Status](https://github.com/milesj/boost/workflows/Build/badge.svg)](https://github.com/milesj/boost/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/%40boost%2Fdecorators.svg)](https://www.npmjs.com/package/@boost/decorators)
[![npm deps](https://david-dm.org/milesj/boost.svg?path=packages/decorators)](https://www.npmjs.com/package/@boost/decorators)

Experimental decorators for common patterns.

```ts
import { Bind, Memoize } from '@boost/decorators';

class Example {
  @Bind()
  referencedMethod() {
    return this; // Class instance
  }

  @Memoize()
  someExpensiveOperation() {
    // Do something heavy
  }
}
```

## Features

- `@Bind` - Autobind a method's `this` to the class context.
- `@Debounce` - Defer the execution of a method in milliseconds.
- `@Deprecate` - Mark a property, method, or class as deprecated.
- `@Memoize` - Cache and return the result of a method execution.
- `@Throttle` - Throttle the execution of a method to a timeframe in milliseconds.

## Installation

```
yarn add @boost/decorators
```

## Documentation

- [https://boostlib.dev/docs/decorators](https://boostlib.dev/docs/decorators)
- [https://boostlib.dev/api/decorators](https://boostlib.dev/api/decorators)
