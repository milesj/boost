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

export interface Renderable extends Pluggable {
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

### Packages

### Loading Plugins

- from settings

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
