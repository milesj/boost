---
title: Prompts
---

Prompts are specialized [React components](./components.md) for handling `process.stdin` input.

All prompt components share most of the following props.

- `label` (`string | React.ReactElement`) - Label to display before or above the prompt itself.
  _(Required)_
- `prefix` (`string`) - Single character symbol to display before the label. Defaults to `?`.
- `onSubmit` (`(value: T) => void`) - Callback triggered when the value is submitted.
- `validate` (`(value: T) => void`) - Function to validate the value on submit. To trigger a failed
  state, thrown an `Error`.

## `Confirm`

The `Confirm` component provides a binary choice through the input of a single character. On
submission, either a `true` or `false` value will be passed.

- `invalidError` (`string`) - Error message to display when an invalid character is pressed.
  Defaults to a custom message.
- `no` (`string`) - Character that triggers a falsy state when pressed. Defaults to `N`.
- `yes` (`string`) - Character that triggers a truthy state when pressed. Defaults to `y`.

```tsx
import { Confirm } from '@boost/cli';

<Confirm label="Do you want to continue?" onSubmit={handleSubmit} />;
```

> Does not support the `validate` prop.

![Confirm example](/img/cli/prompts/confirm.gif)

## `HiddenInput`

The `HiddenInput` component is a specialized [Input](#input) that accepts user input, hides it from
the console, and returns the entered string on a submission.

- Inherits all the same props as [Input](#input) except for `hideCursor`.

```tsx
import { HiddenInput } from '@boost/cli';

<HiddenInput label="What is your secret key?" placeholder="<key>" onSubmit={handleSubmit} />;
```

![Hidden input example](/img/cli/prompts/hidden-input.gif)

## `Input`

The `Input` component is a simple text prompt that takes user input and returns a string. Supports
standard typing, backspacing. On submission, the final `string` will be trimmed of whitespace.

- `defaultValue` (`string`) - A default value. If none provided, will use an empty state.
- `hideCursor` (`boolean`) - Hide the cursor in the console. Will remove the background color, but
  still functions.
- `placeholder` (`string`) - Custom string to display when the value is empty and non-dirty.
- `onChange` (`(value: string) => void`) - Callback triggered when the value changes.

```tsx
import { Input } from '@boost/cli';

<Input
  label="What is your name?"
  placeholder="<name>"
  onChange={handleChange}
  onSubmit={handleSubmit}
/>;
```

![Input example](/img/cli/prompts/input.gif)

## `MultiSelect`

The `MultiSelect` component works in a similar fashion to [Select](#select), but allows for multiple
values to be selected before submission. To select or unselect multiple values, press the space bar.

- `defaultSelected` (`T[]`) - List of option values selected by default.
- `onChange` (`(values: T[]) => void`) - Callback triggered when a value is selected or unselected.
- Inherits all the same props as [Select](#select).

```tsx
import { MultiSelect } from '@boost/cli';

<MultiSelect
  label="What is your favorite fruits?"
  defaultSelected={['banana']}
  onChange={handleChange}
  onSubmit={handleSubmit}
  options={[
    { label: '🍎 Apple', value: 'apple' },
    { label: '🍌 Banana', value: 'banana' },
    { label: '🥥 Coconut', value: 'coconut' },
    { label: '🍇 Grapes', value: 'grapes' },
    { label: '🥝 Kiwi', value: 'kiwi' },
    { label: '🍋 Lemon', value: 'lemon' },
    { label: '🍈 Melon', value: 'melon' },
    { label: '🍊 Orange', value: 'orange' },
    { label: '🍑 Peach', value: 'peach' },
    { label: '🍐 Pear', value: 'pear' },
    { label: '🍍 Pineapple', value: 'pineapple' },
    { label: '🍓 Strawberry', value: 'strawberry' },
    { label: '🍉 Watermelon', value: 'watermelon' },
  ]}
/>;
```

![Multiple select example](/img/cli/prompts/multiselect.gif)

## `PasswordInput`

The `PasswordInput` component is a specialized [Input](#input) that masks user input and replaces
each character with a star (`*`).

- Inherits all the same props as [Input](#input).

```tsx
import { PasswordInput } from '@boost/cli';

<PasswordInput label="What is your password?" placeholder="<pass>" onSubmit={handleSubmit} />;
```

![Password input example](/img/cli/prompts/password-input.gif)

## `Select`

The `Select` component allows a value to be selected from a pre-defined list of options. Supports
standard keyboard navigation. To select or unselect a value, press the space bar, or on submission,
the currently highlighted option will be chosen.

- `limit` (`number`) - Number of options to display before scrolling. Defaults to console height.
- `options` (`(T | SelectOption<T>)[]`) - List of options to choose from. Can either be a string,
  number, or object with a `label` and `value`. _(Required)_
- `overflowAfterLabel` (`string | (count: number) => string`) - Label to display above scrollable
  options with the number of overflowing options.
- `overflowBeforeLabel` (`string | (count: number) => string`) - Label to display below scrollable
  options with the number of overflowing options.
- `scrollType` (`cycle | overflow`) - The pattern in which to limit options when scrolling. Defaults
  to `overflow`.
  - `cycle` - Will continously cycle through options, even when navigating to and past edges.
  - `overflow` - Will display options bound to an edge, with the number of options hidden above and
    below.

```tsx
import { Select } from '@boost/cli';

<Select
  label="What is your favorite fruit?"
  onSubmit={handleSubmit}
  options={[
    'apple',
    'banana',
    'coconut',
    'grapes',
    'kiwi',
    'lemon',
    'melon',
    'orange',
    'peach',
    'pear',
    'pineapple',
    'strawberry',
    'watermelon',
  ]}
/>;
```

![Select example](/img/cli/prompts/select.gif)

Options can also be customized with objects, allowing a more unique `label` to be provided. Options
can also be grouped by inserting `divider` only options.

```tsx
import { Select } from '@boost/cli';

<Select
  label="What is your favorite fruit?"
  onSubmit={handleSubmit}
  options={[
    { label: '🍎 Apple', value: 'apple' },
    { label: '🍌 Banana', value: 'banana' },
    { label: '🥥 Coconut', value: 'coconut' },
    { label: '🍇 Grapes', value: 'grapes' },
    { label: '🥝 Kiwi', value: 'kiwi' },
    { label: '🍋 Lemon', value: 'lemon' },
    { label: '🍈 Melon', value: 'melon' },
    { label: '🍊 Orange', value: 'orange' },
    { label: '🍑 Peach', value: 'peach' },
    { label: '🍐 Pear', value: 'pear' },
    { label: '🍍 Pineapple', value: 'pineapple' },
    { label: '🍓 Strawberry', value: 'strawberry' },
    { label: '🍉 Watermelon', value: 'watermelon' },
  ]}
/>;
```

![Select with labels example](/img/cli/prompts/select-labels.gif)

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
