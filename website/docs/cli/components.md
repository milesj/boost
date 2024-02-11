---
title: Components
---

Boost provides the following components for use within your programs. All components can be imported
from `@boost/cli/react`.

## Header

The [`Header`](/api/cli-react/function/Header) component is simply that, a header! It renders an
inverted background, with bold and uppercased text, and appropriate margins. It's what the
[help](#help) and [failure](#failure) menus use to separate and denote sections.

```tsx
import { Header } from '@boost/cli';

<Header label="About" />;
```

## Help

The [`Help`](/api/cli-react/function/Help) component can be used to render elegant command usage and
help menus. It's a very complex component that supports everything from command metadata to variadic
params, all through the following props (all optional).

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

## Failure

The [`Failure`](/api/cli-react/class/Failure) component can be used to render a beautiful failure
menu, for an error and its stack trace. The `error` prop must be provided with an `Error` instance.

```tsx
import { Failure } from '@boost/cli';

<Failure error={new Error('Something is broken!')} />;
```

## Style

The [`Style`](/api/cli-react/function/Style) component is special in that it renders and applies
colors based on the [chosen theme](../cli.mdx#themes). It accomplishes this through the `type` prop,
which accepts one of the theme palette names.

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
