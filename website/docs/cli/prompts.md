---
title: Prompts
---

Prompts are specialized [React components](./components.md) for handling stdin input.

All prompt components share the following props.

- `defaultValue` (`T`) - A default value. If none provided, will use an empty state.
- `label` (`string | React.ReactElement`) - Label to display before or above the prompt itself.
  _(Required)_
- `prefix` (`string`) - Single character symbol to display before the label. Defaults to `?`.
- `onChange` (`(value: T) => void`) - Callback triggered when the value changes.
- `onSubmit` (`(value: T) => void`) - Callback triggered when the value is submitted.
- `validate` (`(value: T) => void`) - Function to validate the value on submit. To trigger a failed
  state, thrown an `Error`.

## `Input`

The `Input` component is a simple prompt that takes user input and returns a string. Supports
standard typing, backspacing. On submission, the final string will be trimmed of whitespace.

- `placeholder` (`string`) - Custom string to display when the value is empty and non-dirty.

```tsx
import { Input } from '@boost/cli';

<Input
  label="What is your name?"
  placeholder="<name>"
  onChange={handleChange}
  onSubmit={handleSubmit}
/>;
```

## Non-React

If you would like to use prompts outside of React components and within the command space, sadly,
there is no built-in Boost solution. However, you can easily use a third-party solution like
[enquirer](https://github.com/enquirer/enquirer). Just be sure to set `stdin` and `stdout` streams
correctly!

```tsx
import { prompt } from 'enquirer';
import { Command } from '@boost/cli';

export default class InitCommand extends Command {
  async run() {
    const { stdin, stdout } = this.getProgram().streams;

    const { username } = await prompt({
      type: 'input',
      name: 'username',
      message: 'What is your username?',
      stdin,
      stdout,
    });
  }
}
```
