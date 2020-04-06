# Boost CLI

[![Build Status](https://travis-ci.org/milesj/boost.svg?branch=master)](https://travis-ci.org/milesj/boost)
[![npm version](https://badge.fury.io/js/%40boost%cli.svg)](https://www.npmjs.com/package/@boost/cli)
[![npm deps](https://david-dm.org/milesj/boost.svg?path=packages/cli)](https://www.npmjs.com/package/@boost/cli)

A type-safe command line interface built on [Boost][args], [React][react], and [Ink][ink].

```ts
import { Program } from '@boost/cli';
import BuildCommand from './commands/Build';
import CleanCommand from './commands/Clean';

const program = new Program({
  bin: 'boost',
  name: 'Boost',
  version: '1.2.3',
});

program.register(new BuildCommand());
program.register(new CleanCommand());

await program.runAndExit(process.argv);
```

## Features

- Supports common [argument features][args] like commands, options, flags, parameters, and more.
- Export a stand-alone or command-based CLI program binary.
- Write declarative commands with decorators, or imperative commands with static properties.
- Write shorthand proxy commands for small one offs.
- Renders interface using [React][react] and [Ink][ink] at 16 FPS, or output simple strings.
- Outputs beautiful help, usage, error, and index menus.
- Buffers console logs to avoid render tearing.
- Apply middleware to the argv list, or to the parsed arguments.
- Customize output colors using Boost-based terminal themes.

## Installation

```
yarn add @boost/cli react
```

## Documentation

[https://milesj.gitbook.io/boost/cli](https://milesj.gitbook.io/boost/cli)

[args]: https://www.npmjs.com/package/@boost/args
[ink]: https://github.com/vadimdemedes/ink
[react]: https://reactjs.org/
