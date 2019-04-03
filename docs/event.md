# Events

A strict type-safe event system with multiple emitter patterns.

## Installation

```
yarn add @boost/event
```

## Usage

The event system is built around individual `Event` classes that can be instantiated in isolation,
register and unregister their own listeners, and emit values by executing each listener with
arguments. There are multiple [types of events](#types), so choose the best one for each use case.

To begin using events, instantiate an `Event` with a unique name -- the name is purely for debugging
purposes.

```ts
const event = new Event<[string]>('example');
```

`Event`s utilize TypeScript generics for typing the arguments passed to listener functions. This can
be defined using a tuple or an array.

```ts
// One argument of type number
new Event<[number]>('foo');

// Two arguments of type number and string
new Event<[number, string]>('bar');

// Three arguments with the last item being optional
new Event<[object, boolean, string?]>('baz');

// Array of any type or size
new Event<unknown[]>('foo');
```

### Registering Listeners

Listeners are simply functions that can be registered to an event using `Event#listen`. The same
listener function reference will only be registered once.

```ts
event.listen(listener);
```

A listener can also be registered to execute only once, using `Event#once`, regardless of how many
times the event has been emitted.

```ts
event.once(listener);
```

### Unregistering Listeners

A listener can be unregistered from an event using `Event#unlisten`. The same listener reference
used to register must also be used for unregistering.

```ts
event.unlisten(listener);
```

### Emitting Events

Emitting is the concept of executing all registered listeners with a set of arguments. This can be
achieved through the `Event#emit` method, which requires an array of values to pass to each listener
as arguments.

```ts
event.emit(['abc']);
```

> The array values and its types should match the [generics defined](#usage) on the constructor.

## Scopes

TODO

## Types

There are 4 types of events that can be instantiated and emitted.

### `Event`

Standard event that executes listeners in the order they were registered.

```ts
const event = new Event<[string, number]>('standard');

event.listen(listener);

event.emit(['abc', 123]);
```

### `BailEvent`

Like `Event` but can bail the execution loop early if a listener returns `false`. The `emit` method
will return `true` if a bail occurs.

```ts
const event = new BailEvent<[object]>('bail');

// Will execute
event.listen(() => {});

// Will execute and bail
event.listen(() => false);

// Will not execute
event.listen(() => {});

const bailed = event.emit([{ example: true }]);
```

### `ParallelEvent`

Executes listeners in parallel and returns a promise with the result of all listeners.

```ts
const event = new ParallelEvent<[]>('parallel');

event.listen(doHeavyProcess);
event.listen(doBackgroundJob);

// Async/await
const result = await event.emit([]);

// Promise
event.emit([]).then(result => {});
```

### `WaterfallEvent`

Executes each listener in order, passing the previous listeners return value as an argument to the
next listener.

```ts
const event = new WaterfallEvent<number>('waterfall');

event.listen(num => num * 2);
event.listen(num => num * 3);

const result = event.emit(10); // 60
```

> This event only accepts a single argument. The generic type should not be an array, as it types
> the only argument and the return type.
