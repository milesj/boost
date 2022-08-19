# Events - Boost

![build status](https://img.shields.io/github/workflow/status/milesj/boost/Build)
![npm version](https://img.shields.io/npm/v/@boost/event)

A strict event system with multiple emitter patterns.

```ts
import { Event } from '@boost/event';

const event = new Event<[string, number]>('name');

event.listen(listener);
event.emit(['abc', 123]);
```

## Features

- Isolated event instances for proper type-safety.
- Supports 4 event types: standard, bail, concurrent, and waterfall.
- Listener scopes for targeted emits.

## Installation

```
yarn add @boost/event
```

## Documentation

- [https://boostlib.dev/docs/event](https://boostlib.dev/docs/event)
- [https://boostlib.dev/api/event](https://boostlib.dev/api/event)
