# Args Parsing

A type-safe and convention based argument and option parsing library, with strict validation checks.

## Installation

```
yarn add @boost/args
```

## Usage

TODO

### Commands

TODO

### Options

An option is an optional argument that accepts a single value or multiple values. It has 2 forms,
the first being the default form, also known as a long option, which starts with `--` and is
followed by a word or phrase (either in camel or kebab case), for example, `--log`, `--log-level`,
or `--logLevel` (preferred). The second form is known as the short form and is represented by a
single alpha character (either lower or uppercase) prefixed with `-`, for example, `-l` or `-L`. The
short option is defined with the `short` setting.

For options to operate properly, they must be defined using a settings object when calling
`parse()`. Each option supports the following settings:

- `type` (`'boolean' | 'number' | 'string'`) - Expected type of the provided value. When a value is
  captured from the command line, it will be type casted. _(Required)_
- `description` (`string`) - A description of what the option does. Primarily used in interfaces.
  _(Required)_
- `hidden` (`boolean`) - Hide the option from interface output. Defaults to `false`.
- `short` (`string`) - Single character used as a the short option alias.
- `usage` (`string`) - Example instructions on how to use the option.
- `validate` (`(value: T) => void`) - An optional function to validate the provided value.

```ts
const args = parse<{ logLevel: number }>(['--logLevel=2'], {
  options: {
    logLevel: {
      description: 'Increase log output verbosity',
      type: 'number',
      short: 'L',
      validate(value) {
        if (value < 0 || value > 10) {
          throw new Error('Log level must be between 0 and 10.');
        }
      },
    },
  },
});

args.options.logLevel; // 2
```

> The name of options used on the command line are derived from the `options` keys (above), which
> are preferred to be camel case. Even though they are defined as camel case, kebab case variants
> are supported on the command line.

#### Single Value

TODO

#### Multiple Values

TODO

### Flags

A flag is a special type of [option](#options) that is boolean and accepts no value, and represents
a binary on-off switch. When the flag is passed on the command line (without a value), for example,
`--color`, the value is assumed to be `true`. To negate a truthy value and pass a falsy one, prefix
the option with `no-`, for example, `--no-color`.

Each flag supports the `type` (required), `description` (required), `default` (is `false` if not
provided), `hidden`, `usage`, and `short` settings mentioned above.

```ts
const args = parse<{ color: boolean }>(['--color'], {
  options: {
    color: {
      description: 'Enable colored output',
      type: 'boolean',
    },
  },
});

args.options.color; // true
```

### Params

TODO

### Rest

TODO

## Advanced Features

### Short Option Groups

### Counter Options

### Validation Checks
