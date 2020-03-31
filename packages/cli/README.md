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

await program.run(process.argv.slice(2));
```

## Features

- Supports common [argument features][args] like commands, sub-commands, options, flags, parameters,
  and more.
- Export a single command or multi-command binary.
- Write declarative commands with decorators, or imperative commands with static properties.
- Render beautiful interfaces using [React][react] and [Ink][ink] at 16 FPS, or output simple
  strings.
- Buffers console logs to avoid render tearing.
- Customize output colors using Boost-based terminal themes.

## Installation

```
yarn add @boost/cli react ink
```

## Documentation

[https://milesj.gitbook.io/boost/cli](https://milesj.gitbook.io/boost/cli)

[args]: https://github.com/milesj/boost/tree/master/packages/args
[ink]: https://github.com/vadimdemedes/ink
[react]: https://reactjs.org/
