---
title: Prompts
---

Prompts are specialized [React components](./components.md) for handling `process.stdin` input. All
components can be imported from `@boost/cli/react`.

## Confirm

The [`Confirm`](/api/cli/function/Confirm) component provides a binary choice through the input of a
single character. On submission, either a `true` or `false` value will be passed.

```tsx
import { Confirm } from '@boost/cli';

<Confirm label="Do you want to continue?" onSubmit={handleSubmit} />;
```

![Confirm example](/img/cli/prompts/confirm.gif)

## HiddenInput

The [`HiddenInput`](/api/cli/function/HiddenInput) component is a specialized [`Input`](#input) that
accepts user input, hides it from the console, and returns the entered string on submission.

```tsx
import { HiddenInput } from '@boost/cli';

<HiddenInput label="What is your secret key?" placeholder="<key>" onSubmit={handleSubmit} />;
```

![Hidden input example](/img/cli/prompts/hidden-input.gif)

### Controls

- Inherits all the same keyboard controls as [Input](#input).

## Input

The [`Input`](/api/cli/function/Input) component is a simple text prompt that takes user input and
returns a string. Supports standard typing, backspacing. On submission, the final `string` will be
trimmed of whitespace.

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

### Controls

- <kbd>↑</kbd>, <kbd>↓</kbd> - Move cursor to the beginning or end of the entered text.
- <kbd>←</kbd>, <kbd>→</kbd> - Move cursor forward or backward 1 character.
- <kbd>delete</kbd>, <kbd>backspace</kbd> - Remove the previous character at the current cursor
  position.
- <kbd>return</kbd> - Submit the currently entered text.

## MultiSelect

The [`MultiSelect`](/api/cli/function/MultiSelect) component works in a similar fashion to
[`Select`](#select), but allows for multiple values to be selected before submission.

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

### Controls

- <kbd>↑</kbd>, <kbd>↓</kbd> - Move forward or backward through options in the list.
- <kbd>←</kbd>, <kbd>→</kbd> - Move to the beginning or end of the list.
- <kbd>space</kbd> - Select or unselect the currently highlighted option.
- <kbd>return</kbd> - Submit the currently selected options.

## PasswordInput

The [`PasswordInput`](/api/cli/function/PasswordInput) component is a specialized [`Input`](#input)
that masks user input and replaces each character with a star (`*`).

```tsx
import { PasswordInput } from '@boost/cli';

<PasswordInput label="What is your password?" placeholder="<pass>" onSubmit={handleSubmit} />;
```

![Password input example](/img/cli/prompts/password-input.gif)

### Controls

- Inherits all the same keyboard controls as [Input](#input).

## Select

The [`Select`](/api/cli/function/Select) component allows a value to be selected from a pre-defined
list of options. Supports standard keyboard navigation. To select or unselect a value, press the
space bar, or on submission, the currently highlighted option will be chosen.

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

### Controls

- <kbd>↑</kbd>, <kbd>↓</kbd> - Move forward or backward through options in the list.
- <kbd>←</kbd>, <kbd>→</kbd> - Move to the beginning or end of the list.
- <kbd>space</kbd> - Select or unselect the currently highlighted option.
- <kbd>return</kbd> - Submit the currently selected option, or the currently highlighted option if
  none are selected.

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
