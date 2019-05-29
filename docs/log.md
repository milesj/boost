# Logging

Lightweight level based logging system.

## Installation

```
yarn add @boost/log
```

## Usage

Logging is based around the concept of a "logger", which provides a set of functions of variable
levels to log with. Logs are written to a defined writable stream, or `process.stdout` and
`process.stderr` if not defined. To begin, instantiate a logger with `createLogger`, which returns a
function that can be used for standard level logging.

```ts
import { createLogger } from '@boost/log';

const log = createLogger();

log('Something has happened…');
```

Each function that logs requires a message string as the 1st argument, and an optional rest of
arguments to interpolate into the message using
[util.format()](https://nodejs.org/api/util.html#util_util_format_format_args).

```ts
log('Name: %s %s', user.first_name, user.last_name);
log('Object: %O', data);
```

### Options

The following options can be defined when creating a logger. They _cannot_ be customized after the
fact.

- `defaultLevel` (`LogLevel`) - The default log level to use when calling the logger function as-is
  (the examples above). Defaults to the lowest level, `log`.
- `labels` (`object`) - A mapping of log level names to strings to use as the message prefix. Can be
  used with [chalk](https://www.npmjs.com/package/chalk).
- `maxLevel` (`LogLevel`) - The maximum level, based on priority, to write to a stream. All levels
  higher than the maximum will be ignored. Defaults to allowing all levels.
- `stderr` (`WriteStream`) - The writable stream to log error-like output. Defaults to
  `process.stderr`.
- `stdout` (`WriteStream`) - The writable stream to log standard output. Defaults to
  `process.stdout`.

```ts
import chalk from 'chalk';
import { createLogger } from '@boost/log';

const log = createLogger({
  labels: {
    error: chalk.bgRed.black.bold(' FAIL '),
  },
  stderr: customStream,
});
```

### Log Levels

There are 5 distinct logging levels outside the standard level, each represented as a unique
function on the logger instance. The levels in order of **priority** are `trace`, `debug`, `info`,
`warn`, and `error`. Each function requires a message as the 1st argument, and an optional rest of
arguments to interpolate into the message.

```ts
log.trace('Code path hit?');
log.debug('What is going on here?');
log.info('Systems are stable');
log.warn('Something is definitely going on…');
log.error('Systems are down! %s', error.message);
```

> Log, trace, and info functions write to `stdout`, while debug, warn, and error write to `stderr`.

### Silencing Output

By default, all logged messages are immediately written to the configured streams. To silence output
and disable stream writes, call the `logger.disable()` function, and to re-enable, call
`logger.enable()`.

```ts
log.disable();

// Will not write!
log.debug('Something is broken!');
```

> Messages that are logged while silenced are _lost_ and are _not_ buffered.
