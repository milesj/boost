# Boost Plugin

[![Build Status](https://github.com/milesj/boost/workflows/Build/badge.svg)](https://github.com/milesj/boost/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/%40boost%plugin.svg)](https://www.npmjs.com/package/@boost/plugin)
[![npm deps](https://david-dm.org/milesj/boost.svg?path=packages/plugin)](https://www.npmjs.com/package/@boost/plugin)

TODO

```ts
```

## Features

## Installation

```
yarn add @boost/plugin
```

## Documentation

[https://milesj.gitbook.io/boost/plugin](https://milesj.gitbook.io/boost/plugin)

# References

| Tool                           | Plugin pattern                                 | Options pattern                        | Module names                                                          | Lifecycle events |
| ------------------------------ | ---------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------- | ---------------- |
| [Babel][babel]                 | Function that returns an object                | Function argument                      | babel-plugin-foo, @babel/plugin-foo                                   | pre(), post()    |
| [ESLint][eslint]               | Object                                         | N/A                                    | eslint-plugin-foo                                                     |                  |
| [Gulp][gulp]                   | Function that returns a stream                 | Function argument                      | N/A                                                                   |                  |
| [Parcel asset][parcel-asset]   | Class that extends `Asset`                     | Constructor                            | parcel-asset-foo, @parcel/asset-foo                                   |                  |
| [Parcel plugin][parcel-plugin] | Function that binds events                     | N/A                                    | parcel-plugin-foo, @parcel/plugin-foo                                 |                  |
| [Prettier][prettier]           | Named exports                                  | N/A                                    | prettier-plugin-foo, @prettier/plugin-foo, @scope/prettier-plugin-foo |                  |
| [Webpack][webpack]             | Stand-alone class                              | Constructor (implementation dependent) | N/A                                                                   | apply()          |
| [Yarn][yarn]                   | Object with `factory()` that returns an object | N/A                                    | N/A                                                                   | factory()        |

[babel]:
  https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#toc-writing-your-first-babel-plugin
[eslint]: https://eslint.org/docs/developer-guide/working-with-plugins
[gulp]: https://gulpjs.com/docs/en/getting-started/using-plugins
[parcel-asset]: https://parceljs.org/asset_types.html
[parcel-plugin]: https://parceljs.org/plugins.html
[prettier]: https://prettier.io/docs/en/plugins.html
[webpack]: https://webpack.js.org/contribute/writing-a-plugin/
[yarn]: https://next.yarnpkg.com/advanced/plugin-tutorial
