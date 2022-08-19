# CLI - Boost

![build status](https://img.shields.io/github/workflow/status/milesj/boost/Build)
![npm version](https://img.shields.io/npm/v/@boost/cli)

An interactive command line program builder, powered by [React][react] and [Ink][ink].

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

- [https://boostlib.dev/docs/cli](https://boostlib.dev/docs/cli)
- [https://boostlib.dev/api/cli](https://boostlib.dev/api/cli)

![CLI example](https://raw.githubusercontent.com/milesj/boost/master/website/static/img/cli/program.png)

[args]: https://www.npmjs.com/package/@boost/args
[ink]: https://github.com/vadimdemedes/ink
[react]: https://reactjs.org/
