# Logging

Lightweight level based logging system.

## Installation

```
yarn add @boost/log
```

## Environment variables

- `BOOSTJS_LOG_DEFAULT_LEVEL` (`LogLevel`) - The default log level to use when calling the logger
  function stand alone (the usage examples below). Defaults to the lowest level, `log`.
- `BOOSTJS_LOG_MAX_LEVEL` (`LogLevel`) - The maximum level, based on priority, to write to a stream.
  All levels higher than the maximum will be ignored. Defaults to allowing all levels.

## Usage

Logging is based around the concept of a "logger", which provides a set of functions of variable
levels to log with. Logs are written to a provided transport, or `console` if not defined. To begin,
instantiate a logger with `createLogger`, which returns a function that can be used for standard
level logging.

```ts
import { createLogger } from '@boost/log';

const log = createLogger({ name: 'boost' });

log('Something has happened…');
```

Each function that logs requires a message string as the 1st argument, and an optional rest of
arguments to interpolate into the message using
[util.format()](https://nodejs.org/api/util.html#util_util_format_format_args).

```ts
log('Name: %s %s', user.first_name, user.last_name);
log('Object: %O', data);
```

If you would prefer to interact with a class instance, you may use the `Logger` class. The major
difference between the class and the function, is that the class only has 1 logging method, `log()`.

```ts
import { Logger } from '@boost/log';

const logger = new Logger({ name: 'boost' });

logger.log({
  level: 'info',
  message: 'Something else has happened…',
});
```

### Options

The following options can be defined when creating a logger. They _cannot_ be customized after the
fact.

- `labels` (`object`) - A mapping of log level names to strings to use as the level label. Can be
  used with [chalk](https://www.npmjs.com/package/chalk).
- `name` (`string`) - Unique name of this logger instance, for debugging purposes.
- `transports` (`Transportable`) - List of transports in which to write formatted log messages to.

```ts
import chalk from 'chalk';
import { createLogger, StreamTransport } from '@boost/log';

const log = createLogger({
  name: 'boost',
  labels: {
    error: chalk.bgRed.black.bold(' FAIL '),
  },
  transports: [new StreamTransport({ levels: ['error'], stream: process.stderr })],
});
```

### Log levels

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

### Silencing output

By default, all logged messages are immediately written to the configured transports. To silence
output and disable writes, call the `logger.disable()` function, and to re-enable, call
`logger.enable()`.

```ts
log.disable();

// Will not write!
log.debug('Something is broken!');
```

> Messages that are logged while silenced are _lost_ and are _not_ buffered.

## Transport types

There are 2 types of transports that can be used within a logger.

### `ConsoleTransport`

Logs messages to the native `console` according to the corresponding level. This is the default
transport when no transports are defined.

```ts
import { ConsoleTransport } from '@boost/log';

const transport = new ConsoleTransport();
```

### `StreamTransport`

Logs messages to any writeable stream or an object that defines a `write(message: string)` method.

```ts
import { StreamTransport } from '@boost/log';

const transport = new StreamTransport({
  levels: ['error', 'warn'],
  stream: process.stderr,
});
```

## Test utilities

The following [Jest](https://github.com/facebook/jest) utilities are available in the
`@boost/log/lib/testing` module.

### `mockLogger`

> mockLogger(): Logger

Returns a Jest spy that matches the return value shape of `createLogger`.

```ts
import { mockLogger } from '@boost/log/lib/testing';

it('calls the logger', () => {
  const log = mockLogger();

  log('Something has happened');

  expect(log).toHaveBeenCalled();
});
```
