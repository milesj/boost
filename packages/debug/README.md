# Debugging - Boost

![build status](https://img.shields.io/github/workflow/status/milesj/boost/Build)
![npm version](https://img.shields.io/npm/v/@boost/debug)

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

- [https://boostlib.dev/docs/debug](https://boostlib.dev/docs/debug)
- [https://boostlib.dev/api/debug](https://boostlib.dev/api/debug)
