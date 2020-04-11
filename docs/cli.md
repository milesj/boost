# CLI

A type-safe and interactive command line program builder, powered by [Boost][args], [React][react],
and [Ink][ink].

## Installation

```
yarn add @boost/cli react
```

## Events

| Event                                                  | Arguments                                            | Description                                                                |
| ------------------------------------------------------ | ---------------------------------------------------- | -------------------------------------------------------------------------- |
| `Command#onAfterRegister`, `Program#onAfterRegister`   | `path: CommandPath, command: Commadable`             | Called after a command has been registered.                                |
| `Command#onBeforeRegister`, `Program#onBeforeRegister` | `path: CommandPath, command: Commadable`             | Called before a command has been registered.                               |
| `Program#onAfterRender`                                |                                                      | Called after a component has rendered.                                     |
| `Program#onAfterRun`                                   | `error?: Error`                                      | Called after the program and command have been ran.                        |
| `Program#onBeforeRender`                               | `result: RunResult`                                  | Called after a command has run but before a component will render.         |
| `Program#onBeforeRun`                                  | `argv: Argv`                                         | Called before the program and command will run.                            |
| `Program#onCommandFound`                               | `argv: Argv, path: CommandPath, command: Commadable` | Called when a command has been found after parsing argv.                   |
| `Program#onCommandNotFound`                            | `argv: Argv, path: CommandPath`                      | Called when a command wasn't found after parsing argv.                     |
| `Program#onExit`                                       | `message: string, code: number`                      | Called when the `exit()` handler is executed but before the process exits. |

## Usage

TODO

> The CLI makes heavy usage of the [args](./args.md) package, which will be continually referenced
> throughout this documentation. It's encouraged to read and understand it first.

### Program

The entry point of the command line is commonly referred to as the binary, or script, and is managed
by the `Program` class. This class handles the registration of commands, applying middleware to argv
(`process.argv`), parsing argv into [arguments](./args.md#usage) (options, flags, etc), running the
found command with these argument, outputing to the terminal, and finally cleaning up or handling
failures.

Begin by importing and instantiating the `Program` class.

```ts
import { Program } from '@boost/cli';
import pkg from './package.json';

const program = new Program({
  bin: 'boost',
  name: 'Boost',
  version: pkg.version,
});

program.runAndExit(process.argv);
```

It supports the following options:

- `banner` (`string`) - A large banner to appear at the top of the index help interface.
  _(optional)_
- `bin` (`string`) - The name of the binary consumers enter on the command line. Must be in
  kebab-case.
- `footer` (`string`) - A string of text to display at the bottom of the index help interface.
  _(optional)_
- `header` (`string`) - A string of text to display at the top of the index help interface, below
  the banner (if present). _(optional)_
- `name` (`string`) - A human readable name for your program.
- `version` (`string`) - Current version of your CLI program. Typically the version found in your
  `package.json`. This is output when `--version` is passed.

#### Package Integration

Now that you have the basics of a program, you can set the
[bin](https://docs.npmjs.com/files/package.json#bin) field in your `package.json`. This should point
to the program file you have defined previously, for example, if my program was called `boost`.

```json
{
  "bin": {
    "boost": "./bin/boost.js"
  }
}
```

If you're writing your program in TypeScript, or non-Node compatible JavaScript, you'll need to
down-level compile before releasing your package. A simple alternative approach is to point your
binary file to where the compiled program would be found.

```js
// bin/boost.js
#!/usr/bin/env node

require('../lib/program.js');
```

#### Stand-alone

Boost offers 2 implementations for how the binary can be executed, the 1st is known as a stand-alone
program. This implementation only supports 1 [command](#commands) known as the default command,
which is immediately ran when the binary is. It does not support sub-commands.

To utilize a stand-alone binary, create and instantiate a command, then pass it to
`Command#default`. The command's `path` is ignored for this situation.

```ts
import { Program } from '@boost/cli';
import StandAloneCommand from './commands/StandAloneCommand';

const program = new Program({
  // ...
});

program.default(new StandAloneCommand()).runAndExit(process.argv);
```

Some good examples of stand-alone binaries are `babel`, `webpack`, and `tsc`.

#### Multi-command

#### Middleware

### Commands

TODO

#### Config

- markdown

#### Options

#### Params

#### Sub-commands

#### Categories

### Shorthand Commands

### Logging

### Themes

## Components

TODO

### Ink

TODO

### Header

TODO

### Help

TODO

### Failure

TODO

### Style

[args]: https://www.npmjs.com/package/@boost/args
[ink]: https://github.com/vadimdemedes/ink
[react]: https://reactjs.org/
