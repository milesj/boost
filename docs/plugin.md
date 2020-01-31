# Plugins

Plugin based architecture that supports module loading, custom types, scopes, and more.

## Installation

```
yarn add @boost/plugin
```

## Events

| Event                   | Arguments                  | Description                                                 |
| ----------------------- | -------------------------- | ----------------------------------------------------------- |
| `Registry#onLoad`       | `Setting<Plugin>, object?` | Called after a plugin is loaded but before it's registered. |
| `Registry#onRegister`   | `Plugin`                   | Called after a plugin is is registered.                     |
| `Registry#onUnregister` | `Plugin`                   | Called before a plugin is unregistered.                     |

## Usage

The plugin system is based around the idea of loading plugins from third-party packages or file
system paths, in which these plugins can be registered and hooked into a tool, project, pipeline, so
on and so forth. Our system is generic and robust enough to be integrated into any and all projects,
with the ability to handle multiple plugins in parallel, and configuration and setting based
approaches.

To begin, we must define a unique plugin type, like "renderer", "engine", "asset", or simply
"plugin" if you're not looking to be creative. We can accomplish this with the `Registry` class,
which requires a project name (used as a package prefix and scope), plugin type name, and
customizable options.

In our examples moving forward, we will use "renderer" as our plugin.

```ts
import { Registry, Pluggable } from '@boost/plugin';

export interface Renderable<T> extends Pluggable<T> {
  render(): string;
}

const rendererRegistry = new Registry<Renderable>('boost', 'renderer', {
  validate(plugin) {
    if (typeof plugin.render !== 'function') {
      throw new TypeError('Renderers require a `render()` method.');
    }
  },
});
```

You may have noticed the `validate` option above. This option is required as it forces you to verify
a plugin being loaded or registered abides the contract you expect. In the example above, we expect
all our renderers to have a `render` method, otherwise, what would happen if an "engine" plugin was
passed instead? Nothing good.

Besides `validate`, the following options can be passed, all of which are optional. For more
information on life cycles, continue to the next [plugins](#plugins) chapter.

- `beforeStartup` (`(plugin: T) => void`) - Callback fired before a plugin's `startup` life cycle is
  executed.
- `beforeShutdown` (`(plugin: T) => void`) - Callback fired before a plugin's `shutdown` life cycle
  is executed.
- `afterStartup` (`(plugin: T) => void`) - Callback fired after a plugin's `startup` life cycle is
  executed.
- `afterShutdown` (`(plugin: T) => void`) - Callback fired after a plugin's `shutdown` life cycle is
  executed.

### Plugins

We keep talking about plugins, but what exactly is a plugin? In the context of this system, a plugin
is either a plain object, or class instance that extends `Plugin`, with both abiding a defined
contract (the `validate` option). A plugin must also have a unique `name` property, which is
typically the NPM package name.

Using our renderer example above, our plain object would look like the following.

```ts
const renderer = {
  name: 'boost-renderer-example',
  render() {
    return 'Something happened here?';
  },
};
```

Simple, right? Now let's look at our class example, which is a bit more involved.

```ts
import { Plugin } from '@boost/plugin';

class Renderer extends Plugin implements Renderable {
  name = '@boost/renderer-example';

  render() {
    return 'Something also happens here!';
  }
}
```

Now why would we use a class instead of an object, as an object seems much simpler? For 2 reasons,
the 1st being that `Plugin` extends from [`Contract`](./common/contract.md), which allows the plugin
to inherit options through its constructor. This automatically happens when loading plugins from a
configuration file.

```ts
import { Predicates } from '@boost/common';
import { Plugin } from '@boost/plugin';

interface RendererOptions {
  async?: boolean;
}

class Renderer extends Plugin<unknown, RendererOptions> implements Renderable {
  // ...

  blueprint({ bool }: Predicates) {
    return {
      async: bool(),
    };
  }
}

const renderer = new Renderer({ async: true });
```

The 2nd reason is for TypeScript, as we can type our "tool" that is passed to
[life cycle events](#life-cycles) -- more specifically, the `Pluggable` type. More information on
the tool can be found in later chapters.

```ts
import { Plugin } from '@boost/plugin';
import Tool from './Tool';

class Renderer extends Plugin<Tool> implements Renderable<Tool> {
  // ...
}
```

#### Life Cycles

### Packages

### Loading Plugins

- from settings
- priority

## Third-party Ecosystem

Below are a list of projects and their current plugin implementations. These were used as a basis
and reference for Boost's plugin system.

| Project                        | Plugin pattern                                 | Options pattern                        | Package names                                                         | Lifecycle events |
| ------------------------------ | ---------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------- | ---------------- |
| [Babel][babel]                 | Function that returns an object                | Function argument                      | babel-plugin-foo, @babel/plugin-foo                                   | pre(), post()    |
| [ESLint][eslint]               | Object                                         |                                        | eslint-plugin-foo                                                     |                  |
| [Gulp][gulp]                   | Function that returns a stream                 | Function argument                      | N/A                                                                   |                  |
| [Parcel asset][parcel-asset]   | Class that extends `Asset`                     | Constructor                            | parcel-asset-foo, @parcel/asset-foo                                   |                  |
| [Parcel plugin][parcel-plugin] | Function that binds events                     |                                        | parcel-plugin-foo, @parcel/plugin-foo                                 |                  |
| [Prettier][prettier]           | Named exports                                  |                                        | prettier-plugin-foo, @prettier/plugin-foo, @scope/prettier-plugin-foo |                  |
| [Rollup][rollup]               | Function that returns an object                | Function argument                      | rollup-plugin-foo                                                     | Many             |
| [Webpack][webpack]             | Stand-alone class                              | Constructor (implementation dependent) |                                                                       | apply()          |
| [Yarn][yarn]                   | Object with `factory()` that returns an object |                                        |                                                                       | factory()        |

[babel]:
  https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#toc-writing-your-first-babel-plugin
[eslint]: https://eslint.org/docs/developer-guide/working-with-plugins
[gulp]: https://gulpjs.com/docs/en/getting-started/using-plugins
[parcel-asset]: https://parceljs.org/asset_types.html
[parcel-plugin]: https://parceljs.org/plugins.html
[prettier]: https://prettier.io/docs/en/plugins.html
[rollup]: https://rollupjs.org/guide/en/#plugins-overview
[webpack]: https://webpack.js.org/contribute/writing-a-plugin/
[yarn]: https://next.yarnpkg.com/advanced/plugin-tutorial
