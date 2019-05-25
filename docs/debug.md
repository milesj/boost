# Debugging

Lightweight debugging and crash reporting. Wraps the amazing
[debug](https://www.npmjs.com/package/debug) library to provide additional functionality.

## Installation

```
yarn add @boost/debug
```

## Environment Variables

- `BOOST_DEBUG_GLOBAL_NAMESPACE` - A prefix to append to all debugger namespaces when created with
  `createDebugger()`. Is commonly set by a Boost `Tool` instance.
- `BOOST_DEBUG_VERBOSE` - Print verbose messages logged from `debugger.verbose()`, otherwise they
  are hidden.

## Usage

TODO

### Invariant Messages

TODO

### Verbose Output

Debug messages are already hidden behind the `DEBUG` environment variable, but Boost takes it a step
further to support verbose debugging. Messages logged with `debug.verbose()` will not be displayed
unless the `BOOST_DEBUG_VERBOSE` environment variable is set -- even if `DEBUG` is set.

```ts
// Will not write!
debug.verbose('We need extra information');

process.env.BOOST_DEBUG_VERBOSE = 'true';

// Will write!
debug.verbose('We need extra information (again)');
```

### Silencing Output

By default, all logged messages are immediately written to `stderr` when `DEBUG` contains the
debugger namespace. To silence output for a specific debugger, call the `disable()` method, and to
re-enable, call `enable()`.

```ts
debug.disable();

// Will not write!
debug('Something is broken!');
```

> Messages that are logged while silenced are _lost_ and are _not_ buffered.

## Crash Reporting

TODO

## Test Utilities

TODO
