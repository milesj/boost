# Boost Debugging

[![Build Status](https://github.com/milesj/boost/workflows/Build/badge.svg)](https://github.com/milesj/boost/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/%40boost%debug.svg)](https://www.npmjs.com/package/@boost/debug)
[![npm deps](https://david-dm.org/milesj/boost.svg?path=packages/debug)](https://www.npmjs.com/package/@boost/debug)

Lightweight debugging and crash reporting. Wraps the amazing
[debug](https://www.npmjs.com/package/debug) library to provide additional functionality.

```ts
import { createDebugger } from '@boost/debug';

const debug = createDebugger('boost');

debug('Something is broken!');
```

## Features

- Isolated and namespaced debugger instances, controlled with the `DEBUG` environment variable.
- Crash reporter that logs binary versions, programming languages, running process, system
  information, and much more.
- Standard and verbose debug output.
- Toggleable debugging at runtime.

## Installation

```
yarn add @boost/debug
```

## Documentation

[https://milesj.gitbook.io/boost/debug](https://milesj.gitbook.io/boost/debug)
