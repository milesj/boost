---
title: Components
---

Boost provides the following components for use within your programs.

## `Header`

The `Header` component is simply that, a header! It renders an inverted background, with bold and
uppercased text, and appropriate margins. It's what the [help](#help) and [failure](#failure) menus
use to separate and denote sections.

```tsx
import { Header } from '@boost/cli';

<Header label="About" />;
```

### Props

- `label` (`string`) - Text to display for the label. _(Required)_
- `marginBottom` (`number`) - The bottom margin. Defaults to `1`.
- `marginTop` (`number`) - The top margin. Defaults to `1`.
- `type` (`StyleType`) - Customize the background color using [Style](#style). Defaults to normal
  text.

## `Help`

The `Help` component can be used to render elegant command usage and help menus. It's a very complex
component that supports everything from command metadata to variadic params, all through the
following props (all optional).

```tsx
import { Help } from '@boost/cli';

<Help
  header="Info"
  config={{ description: 'This is a very cool program', deprecated: true }}
  params={[
    {
      description: 'Name',
      type: 'string',
    },
  ]}
/>;
```

### Props

- `categories` (`Record<string, Category>`) - Mapping of [categories](../cli.mdx#categories) to use
  for command and option grouping.
- `config` (`CommandConfig`) - [Configuration](../cli.mdx#config) metadata about the current
  command.
- `commands` (`Record<string, CommandConfig>`) - Mapping of [commands](../cli.mdx#sub-commands),
  typically sub-commands.
- `header` (`string`) - A [header](#header) to display at the top of the output.
- `options` (`Record<string, OptionConfig>`) - Mapping of [options](../cli.mdx#options).
- `params` (`ParamConfig[]`) - List of [params](../cli.mdx#params).

## `Failure`

The `Failure` component can be used to render a beautiful failure menu, for an error and its stack
trace. The `error` prop must be provided with an `Error` instance.

```tsx
import { Failure } from '@boost/cli';

<Failure error={new Error('Something is broken!')} />;
```

### Props

- `error` (`Error`) - The primary error to display in red. _(Required)_
- `hideStackTrace` (`boolean`) - Hide the primary error stack trace. Defaults to `false`.
- `warnings` (`Error[]`) - Optional errors as warnings to display in yellow.

## `Style`

The `Style` component is special in that it renders and applies colors based on the
[chosen theme](../cli.mdx#themes). It accomplishes this through the `type` prop, which accepts one
of the theme palette names.

```tsx
import { Style } from '@boost/cli';

<Style type="success">Downloaded 123 packages</Style>;
```

Furthermore, it also supports text styling similar to Ink's `Text` component. This uses
[chalk](https://www.npmjs.com/package/chalk) under the hood.

```tsx
<Style bold type="failure">
  Failed to download packages
</Style>
```

> It's highly encouraged to use this component for all color based styling, so that consumers can
> always use their chosen theme!

### Props

- `inverted` (`boolean`) - Invert the colors to style the background instead of foreground. Defaults
  to `false`.
- `type` (`StyleType`) - Theme palette name to style with. Accepts "default", "failure", "info",
  "inverted", "muted", "notice", "success", and "warning". Defaults to none.
