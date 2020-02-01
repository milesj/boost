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
  render(): string | Promise<string>;
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
    return 'Something rendered here?';
  },
};
```

Simple, right? Now let's look at our class example, which is a bit more involved.

```ts
import { Plugin } from '@boost/plugin';

class Renderer extends Plugin implements Renderable {
  name = '@boost/renderer-example';

  render() {
    return 'Something also rendered here!';
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

The 2nd reason is for TypeScript, as we can type our [tool](#tools) that is passed to
[life cycle events](#life-cycles) -- more specifically, the `Pluggable` type. More information on
the tool can be found in later chapters.

```ts
import { Plugin } from '@boost/plugin';
import Tool from './Tool';

class Renderer extends Plugin<Tool> implements Renderable<Tool> {
  // ...
}
```

#### Priority

TODO

#### Life Cycles

A life cycle is an optional method on a plugin that is executed at specific points in the life of a
plugin. Currently, plugins support 2 life cycles, `startup` and `shutdown`. Startup is executed
after a plugin is loaded and validated, but before it's registered in the registry. Shutdown on the
otherhand is executed before a plugin is unregistered from the registry.

All life cycles receive a [tool](#tools) as its only argument.

```ts
import Tool from './Tool';

const renderer = {
  // ...

  startup(tool: Tool) {
    // Do something
  },
  shutdown(tool: Tool) {
    // Do something
  },
};
```

```ts
import { Plugin } from '@boost/plugin';
import Tool from './Tool';

class Renderer extends Plugin<Tool> implements Renderable<Tool> {
  // ...

  startup(tool: Tool) {
    // Do something
  }

  shutdown(tool: Tool) {
    // Do something
  }
}
```

### Packages

Typically plugins are represented as an NPM package for easy consumption. This pattern is first
class in Boost, but there are specific requirements to be followed. The 1st is that all plugin
packages _must_ return a factory function from the default index import. Using a factory function
provides the following benefits:

- The return value of the factory may change without breaking the import contract.
- Option objects are passed to the factory, which allows implementors to handle it however they
  please.
- Runtime and boostrap based logic is encapsulated within the function.
- Multiple instances can be created from a single imported package.

Using our renderer examples, we would have the following factories.

```ts
// Object based plugin
// boost-renderer-example/src/index.ts

export default function(options: RendererOptions): Renderable {
  return {
    name: 'boost-renderer-example',
    render() {
      if (options.async) {
        return Promise.resolve('Ooo, this is a fancy render.');
      }

      return 'Something rendered here?';
    },
  };
}
```

```ts
// Class based plugin
// @boost/renderer-example/src/index.ts

class Renderer extends Plugin implements Renderable {
  // ....
}

export default function(options: RendererOptions): Renderable {
  return new Renderer(options);
}
```

#### Naming Requirements

You may have noticed in the examples above that we've been referencing both scoped and non-scoped
package names. All plugin packages follow the format of `<project>-<type>-<name>` for public
third-party packages, and `@<project>/<type>-<name>` for official project owner packages. A 3rd
format exists for public third-party packages that exist within a scope,
`@<scope>/<project>-<type>-<name>`.

If the plugin name is "example", and our project name is "boost", and our plugin type is "renderer",
the following package names are valid. _No other formats are supported._

| Package       | Name                            |
| ------------- | ------------------------------- |
| Private/Owner | `@boost/renderer-example`       |
| Public        | `boost-renderer-example`        |
| Scoped public | `@scope/boost-renderer-example` |

All name parts should be in kebab-case and abide the official
[NPM package naming guidelines](https://github.com/npm/validate-npm-package-name).

### Tools

TODO

### Loading Plugins

Plugins are either loaded from an NPM package or a relative file system path, using the `Registry`
class. The `load()` method can be used to load a single plugin, while `loadMany()` will load
multiple. Loading accepts 3 different formats, which are outlined with the examples below.

Passing a string will load based on module name. Names can either be short (just the plugin name),
or in the long fully qualified form (project, type, and plugin name). When using the short form, the
loader will attempt to find both the scoped (`@boost/renderer-example`) and non-scoped packages
(`boost-renderer-example`).

```ts
// Load by short name
const renderer = rendererRegistry.load('foo');

// Load by long name with options
const renderer = rendererRegistry.load('boost-renderer-foo', { async: true });

// Load by file path
const renderer = rendererRegistry.load('./renderers/qux.js');
```

Passing an array (tuple) allows for options to also be defined. This will precede the 2nd argument
and is mainly used to load based on a configuration file. An optional 3rd argument can be defined to
set [priority](#priority).

```ts
// Load many by different name forms
const renderers = rendererRegistry.loadMany([
  ['foo', { async: true }],
  ['@boost/renderer-bar', {}, { priority: 1 }],
  '@scope/boost-renderer-baz',
]);
```

And lastly, passing a plugin object directly is also supported. This is primarily a configuration
file feature.

```ts
const renderer = rendererRegistry.load({
  name: '@scope/boost-renderer-baz',
  render() {
    return 'Hello world';
  },
});

// Or
const renderer = rendererRegistry.load(new Renderer());
```

Loaded and registered plugins should then be accessed with `get()`, `getMany()`, or `getAll()`, all
of which check based on the plugin's `name` property.

```ts
const renderer = rendererRegistry.get('boost-renderer-foo');
```

#### Configuration Files

The loader methods were built to support plugins defined in configuration files, as this is a common
use case. Take the following examples that showcase JSON and JS based configurations.

```json
{
  "renderers": [
    ["foo", { "async": true }],
    ["@boost/renderer-bar", {}, { "priority": 1 }],
    "@scope/boost-renderer-baz"
  ]
}
```

```js
module.exports = {
  renderers: [
    ['foo', { async: true }],
    ['@boost/renderer-bar', {}, { priority: 1 }],
    '@scope/boost-renderer-baz',
  ],
};
```

And Webpack/Rollup styled configurations where plugins are instantiated manually.

<!-- prettier-ignore -->
```js
import foo from 'boost-renderer-foo';
import bar from '@boost/renderer-bar';
import baz from '@scope/boost-renderer-baz';
import qux from './renderers/qux';

const barInstance = bar();
barInstance.priority = 1;

export default {
  renderers: [
    foo({ async: true }),
    barInstance,
    baz(),
    qux(),
  ],
};
```

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
