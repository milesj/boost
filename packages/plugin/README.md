# Boost Plugin

[![Build Status](https://github.com/milesj/boost/workflows/Build/badge.svg)](https://github.com/milesj/boost/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/%40boost%plugin.svg)](https://www.npmjs.com/package/@boost/plugin)
[![npm deps](https://david-dm.org/milesj/boost.svg?path=packages/plugin)](https://www.npmjs.com/package/@boost/plugin)

Plugin based architecture that supports module loading, custom types, scopes, and more.

```ts
import { Registry, Pluggable } from '@boost/plugin';

export interface Renderable<T> extends Pluggable<T> {
  render(): string | Promise<string>;
}

const registry = new Registry<Renderable>('boost', 'plugin', {
  validate(plugin) {
    if (typeof plugin.render !== 'function') {
      throw new TypeError('Plugins require a `render()` method.');
    }
  },
});

const plugin = registry.load('boost-plugin-example');
```

## Features

- Custom plugin types and registries.
- Node module, file path, and configuration file loading strategies.
- Multiple module name formats: public, scoped public, scoped private.
- Structural contracts with life cycle events.
- Factory function pattern for plugin creation.

## Installation

```
yarn add @boost/plugin
```

## Documentation

[https://milesj.gitbook.io/boost/plugin](https://milesj.gitbook.io/boost/plugin)