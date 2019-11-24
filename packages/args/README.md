# Boost Args

[![Build Status](https://travis-ci.org/milesj/boost.svg?branch=master)](https://travis-ci.org/milesj/boost)
[![npm version](https://badge.fury.io/js/%40boost%args.svg)](https://www.npmjs.com/package/@boost/args)
[![npm deps](https://david-dm.org/milesj/boost.svg?path=packages/args)](https://www.npmjs.com/package/@boost/args)

A type-safe and convention based argument parsing library, with strict validation checks. It _is
not_ a command line interface.

```ts
import { parse } from '@boost/args';

interface Options {
  help: boolean;
  logLevel: 'info' | 'error' | 'warn';
  version: boolean;
}

const { command, errors, options, params, rest } = parse<Options>(process.argv.slice(2), {
  commands: ['build', 'install', 'update'],
  options: {
    help: {
      default: false,
      description: 'Show a help menu',
      type: 'boolean',
      short: 'H',
    },
    logLevel: {
      choices: ['info', 'error', 'warn'],
      default: 'info',
      description: 'Customize logging level',
    },
    version: {
      default: false,
      description: 'Show the version number',
      type: 'boolean',
      short: 'V',
    },
  },
});
```

## Features

- Commands and sub-commands: `cmd`, `cmd:sub`
- Options (long and short) that set a value(s): `--foo value`, `--foo=value`, `-f value`, `-f=value`
  - Camel (preferred) or kebab cased option names.
- Flags (boolean options) that take no value: `--bar`, `-B`
  - With implicit negation support: `--no-bar`
- Parameters that act as standalone values: `foo bar baz`
  - Can be marked as required.
- Rest arguments that are passed to subsequent scripts (aggregated after `--`): `foo -- bar`
- Supports `string`, `number`, `boolean`, and list based values, with the addition of:
  - Single value based on a list of possible choices.
  - Multiple values with optional arity count requirements.
- Group multiple short options under a single argument: `-fBp`
  - Increment a counter each time a short option is found in a group.
- Strict parser and validation checks, allowing for informative interfaces.
  - Custom option and param validation for increased accuracy.

## Installation

```
yarn add @boost/args
```

## Documentation

[https://milesj.gitbook.io/boost/args](https://milesj.gitbook.io/boost/args)
