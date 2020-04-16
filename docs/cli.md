# CLI

A type-safe and interactive command line program, powered [React][react] and [Ink][ink].

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
by the `Program` class. This class handles the registration of commands, applying
[middleware](#middleware) to argv (`process.argv`), parsing argv into [arguments](./args.md#usage)
(options, flags, etc), running the found command with these argument, outputing to the terminal, and
finally cleaning up or handling failures.

Begin by importing and instantiating the `Program` class, while passing required and optional
options.

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

```ts
import { Program } from '@boost/cli';
import pkg from './package.json';

const program = new Program({
  bin: 'boost',
  name: 'Boost',
  version: pkg.version,
});
```

Once [commands](#commands) and optional [middleware](#middleware) have been registered, you must run
the program with `Program#run()` or `Program#runAndExit()`, with the latter automatically passing
the exit code to `process.exitCode`. Both methods require an argv list to run.

```ts
program.runAndExit(process.argv);
```

#### Package Integration

Now that you have the basics of a program, you can set the
[bin](https://docs.npmjs.com/files/package.json#bin) field in your `package.json`. This should point
to the program-aware file you have defined previously. For example, if my program will be called
`boost`.

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

To create a stand-alone binary, create and instantiate a command, then pass it to
`Command#default()`. The command's `path` is ignored for this situation.

```ts
import { Program } from '@boost/cli';
import StandAloneCommand from './commands/StandAloneCommand';

const program = new Program({
  // ...
});

program.default(new StandAloneCommand()).runAndExit(process.argv);
```

> Some good examples of stand-alone binaries are `babel`, `webpack`, and `tsc`.

#### Multi-command

The 2nd implementation is opposite the stand-alone program, and is known as a multi-command program.
When the binary is ran, and no arguments are passed, a help menu is displayed instead of executing
the default command. Otherwise, if arguments _are_ passed, a registered command will be ran based on
matching path name.

To create a multi-command binary, create and instantiate multiple commands, and pass them all to
`Command#register`. In the example below, the `boost` binary would support the `boost install`,
`boost uninstall`, and `boost build` commands.

```ts
import { Program } from '@boost/cli';
import InstallCommand from './commands/InstallCommand';
import UninstallCommand from './commands/UninstallCommand';
import BuildCommand from './commands/BuildCommand';

const program = new Program({
  // ...
});

program
  .register(new InstallCommand())
  .register(new UninstallCommand())
  .register(new BuildCommand())
  .runAndExit(process.argv);
```

> Some good examples of stand-alone binaries are `npm`, `yarn`, and `docker`.

#### Middleware

Boost will parse provided argv (a list of string arguments, typically from `process.argv`) into
[args][args] (an object of options, flags, params, etc) for easier consumption. This process can be
intercepted with `Program#middleware()`, which allows both argv and args to be read and mutated.

Middleware is a function, that receives the argv list as the 1st argument, and a parse callback as
the 2nd argument. It _must_ return an args object, which can be built by executing the parse
callback. This allows both before, middle, and after implementations to be possible, as demonstrated
below.

```ts
import { Program, Middleware } from '@boost/cli';

const example: Middleware = (argv, parse) => {
  if (argv.includes('--help')) {
    argv.push('--all');
  }

  return parse();
};

const program = new Program({
  // ...
});

program
  // Function reference
  .middleware(example)
  // Inline async function
  .middleware(async (argv, parse) => {
    const args = await parse();

    args.options.flag = true;

    return args;
  })
  .runAndExit(process.argv);
```

Middleware is async, so the parse callback _must be_ awaited! This also means you can implement your
own async functionality, like file system access, or network requests.

### Commands

TODO

Commands may be defined with a declarative approach using TypeScript decorators, or an imperative
approach with static class properties. Both variants will be demonstrated in the examples below.

#### Config

All commands support the following metadata configuration, with `path` and `description` being
mandatory.

- `aliases` (`string[]`) - A list of aliased paths. Will not show up in the help menu, but will
  match on the command line.
- `allowUnknownOptions` (`boolean`) - Allow [unknown options](./args.md#unknown-options) to be
  parsed, otherwise an error is thrown. Defaults to `false`.
- `allowVariadicParams` (`boolean`) - Allow [variadic params](./args.md#variadic-params) to be
  parsed, otherwise an error is thrown. Defaults to `false`.
- `categories` (`object`) - A mapping of sub-command and option [categories](#categories) for this
  command only. [Global options](#global-options) are automatically defined under the `global`
  category.
- `category` (`string`) - The category this command belongs to. Will be used to group in the parent
  command or program. Defaults to no category.
- `deprecated` (`boolean`) - Whether the command is deprecated or not. Will display a tag in the
  help menu. Defaults to `false`.
- `description` (`string`) - A description of what the command is and does. Supports basic markdown
  for bold, italics, and underline. _(required)_
- `hidden` (`boolean`) - Whether the command should be hidden from the help menu or not. Will still
  match on the command line. Defaults to `false`.
- `path` (`string`) - A unique name in which to match the command on the command line amongst a list
  of arguments (argv). _(required)_
- `usage` (`string | string[]`) - Define one or many usage examples to display in the help menu.

When using decorators, import the `Config` decorator and apply it to the `Command` class. The path
and description are required, while all other metadata can be passed as an object.

```ts
import { Command, Config } from '@boost/cli';

@Config('build', 'Build a project', {
  aliases: ['make'],
  deprecated: true,
})
class BuildCommand extends Command {}
```

Otherwise, just define static class properties of the same name!

```ts
import { Command } from '@boost/cli';

class BuildCommand extends Command {
  static path: string = 'build';

  static aliases: string[] = ['make'];

  static description: string = 'Build a project';

  static deprecated: boolean = true;
}
```

#### Options

[Options](./args.md#options) are optional arguments that accept a value on the command line. When a
command is ran, each option is set as a class property based on the matching command line value, or
the provided default value. Like configuration above, options can be defined declaratively or
imperatively, with option types being passed to the 1st `Command` generic slot.

There are 5 decorators to choose from when defining options (in the example below), all of which are
defined on a class property, where the property name becomes the option name. For example, a
property of `save` would become the `--save` option. Depending on the decorator, they support many
[option settings](./args.md#options), excluding `type` and `description`, which are inferred, and
`default` which comes from the property value.

```ts
import { Command, Arg, GlobalOptions } from '@boost/cli';

interface CustomOptions extends GlobalOptions {
  flag: boolean;
  number: number;
  numbers: number[];
  string: string;
  strings: string[];
}

class CustomCommand extends Command<CustomOptions> {
  @Arg.Flag('Boolean flag')
  flag: boolean = false;

  @Arg.Number('Single number', { count: true, short: 'N' })
  number: number = 0;

  @Arg.Numbers('List of numbers', { deprecated: true })
  numbers: number[] = [];

  @Arg.String('Single string', { choices: ['a', 'b', 'c'], hidden: true })
  string: string = '';

  @Arg.Strings('List of strings', { arity: 5, short: 'S' })
  strings: string[] = [];

  run() {
    const { flag, strings } = this;
  }
}
```

If you prefer to use static properties, all options are defined through the single static `options`
property, which requires a mapping of option names to [option settings](./args.md#options). With
this approach, `type` and `description` are required, with `default` either being configured with a
setting, or coming from the class property value.

For easier type safety, the `Options` collection type can be used to type the static property.

```ts
import { Command, GlobalOptions, Options } from '@boost/cli';

interface CustomOptions extends GlobalOptions {
  flag: boolean;
  number: number;
  numbers: number[];
  string: string;
  strings: string[];
}

class CustomCommand extends Command<CustomOptions> {
  static options: Options<CustomOptions> = {
    flag: {
      description: 'Boolean flag',
      type: 'boolean',
    },
    number: {
      count: true,
      description: 'Single number',
      short: 'N',
      type: 'number',
    },
    numbers: {
      deprecated: true,
      description: 'List of numbers',
      multiple: true,
      type: 'number',
    },
    string: {
      choices: ['a', 'b', 'c'],
      description: 'Single string',
      hidden: true,
      type: 'string',
    },
    strings: {
      arity: 5,
      description: 'List of strings',
      multiple: true,
      short: 'S',
      type: 'string',
    },
  };

  flag: boolean = false;

  number: number = 0;

  numbers: number[] = [];

  string: string = '';

  strings: string[] = [];

  run() {
    const { flag, strings } = this;
  }
}
```

##### Global Options

Boost provides the follow options that are always available to all commands.

- `--help`, `-h` (`boolean`) - Displays a help menu for the chosen command or the program itself.
  Available under the `help` class property.
- `--locale` (`string`) - Display errors, messages, and the interface in the chosen locale (if
  supported). Locale must be in the format of "en" or "en-US". Available under the `locale` class
  property.
- `--version`, `-v` (`boolean`) - Display the current program version and exit. Available under the
  `version` class property.

#### Params

#### Sub-commands

### Shorthand Commands

### Categories

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
