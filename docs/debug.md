# Debugging

Lightweight debugging and crash reporting. Wraps the amazing
[debug](https://www.npmjs.com/package/debug) library to provide additional functionality.

## Installation

```
yarn add @boost/debug
```

## Environment Variables

- `BOOST_DEBUG_GLOBAL_NAMESPACE` (`string`) - A prefix to append to all debugger namespaces when
  created with `createDebugger()`. Is commonly set by a command line application or Boost `Tool`
  instance.
- `BOOST_DEBUG_VERBOSE` (`boolean`) - Print verbose messages logged from `debugger.verbose()`,
  otherwise they are hidden.

## Usage

Like [logging](./log.md), a "debugger" is a collection of functions that write to `process.stderr`.
The key difference is that debug messages are only displayed if the `DEBUG` environment variable
contains the debugger's namespace (logic provided by the
[debug](https://www.npmjs.com/package/debug) package). The namespace can be defined when
instantiating a debugger using `createDebugger`.

```ts
import { createDebugger } from '@boost/debug';

const debug = createDebugger('boost');

process.env.DEBUG = 'boost:*';

debug('Something is broken!');
```

> A namespace can either be a string or an array of strings.

Each debug function that logs (excluding invariants) requires a message string as the 1st argument,
and an optional rest of arguments to interpolate into the message using
[util.format()](https://nodejs.org/api/util.html#util_util_format_format_args).

```ts
debug('Name: %s %s', user.first_name, user.last_name);
debug('Object: %O', data);
```

### Invariant Messages

Invariant debugging logs either a success or a failure message, depending on the truthy evaluation
of a condition. This can be achieved with `debugger.invariant()`, which requires the condition to
evaluate, a message to always display, and a success and failure message.

```ts
debug.invariant(fs.existsSync(filePath), 'Does file exist?', 'Yes!', 'No');
```

### Verbose Output

Debug messages are already hidden behind the `DEBUG` environment variable, but Boost takes it a step
further to support verbose debugging. Messages logged with `debugger.verbose()` will not be
displayed unless the `BOOST_DEBUG_VERBOSE` environment variable is set -- even if `DEBUG` is set.

```ts
// Will not write!
debug.verbose('We need extra information');

process.env.BOOST_DEBUG_VERBOSE = 'true';

// Will write!
debug.verbose('We need extra information (again)');
```

### Silencing Output

By default, all logged messages are immediately written when `DEBUG` contains the debugger
namespace. To silence output for a specific debugger, call the `debugger.disable()` function, and to
re-enable, call `debugger.enable()`.

```ts
debug.disable();

// Will not write!
debug('Something is broken!');
```

> Messages that are logged while silenced are _lost_ and are _not_ buffered.

## Crash Reporting

Sometimes an application or script fails. Sometimes we want to write an error log with environmental
information about the failure. Boost supports this exact scenario. Take advantage of crash reporting
by importing and instantiating the `CrashReporter` class.

```ts
import { CrashReporter } from '@boost/debug';

const reporter = new CrashReporter();
```

The reporter supports a collection of chainable methods that log targeted information, grouped into
sections. The following methods are available.

- `reportBinaries()` - Reports binary versions and paths for Node, NPM, and Yarn.
- `reportEnvVars()` - Sorts and reports all environment variables.
- `reportLanguages()` - Reports versions and paths for common programming languages, like Java,
  Python, Ruby, and more.
- `reportProcess()` - Reports information about the currently running process.
- `reportStackTrace(error: Error)` - Reports the stack trace for the provided `Error`.
- `reportSystem()`- Reports information about the system, OS, and platform.

```ts
reporter
  .reportBinaries()
  .reportEnvVars()
  .reportSystem();
```

If you'd like to add your own section and label value pairs, use `addSection()` which requires a
title, and `add()` which accepts a label and one or many values.

```ts
reporter
  .addSection('User')
  .add('ID', user.id)
  .add('Name', user.name)
  .add('Location', user.address, user.country);
```

Once all the information has been buffered, we can write the content to a log file by using the
`write()` method, which requires an absolute file path.

```ts
reporter.write(path.join(process.cwd(), 'error.log'));
```

## Test Utilities

The following [Jest](https://github.com/facebook/jest) utilities are available in the
`@boost/debug/lib/testing` module.

### Mocking Debugger

The `mockDebugger` function returns a Jest spy that matches the return value shape of
`createDebugger`.

```ts
import { mockDebugger } from '@boost/debug/lib/testing';

it('calls the debugger', () => {
  const debug = mockDebugger();

  debug('Something is broken!');

  expect(debug).toHaveBeenCalled();
});
```
