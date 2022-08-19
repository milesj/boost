# Logging - Boost

![build status](https://img.shields.io/github/workflow/status/milesj/boost/Build)
![npm version](https://img.shields.io/npm/v/@boost/log)

Lightweight level based logging system.

```ts
import { createLogger } from '@boost/log';

const log = createLogger();

log('Something has happened…');
```

## Features

- Isolated logger instances.
- Supports 6 logging levels, in order of priority: log, trace, debug, info, warn, error.
- Handles default and max logging levels.
- Customizable transports with writable streams.
- Toggleable logging at runtime.

## Installation

```
yarn add @boost/log
```

## Documentation

- [https://boostlib.dev/docs/log](https://boostlib.dev/docs/log)
- [https://boostlib.dev/api/log](https://boostlib.dev/api/log)
