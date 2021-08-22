# Modules - Boost

[![Build Status](https://github.com/milesj/boost/workflows/Build/badge.svg)](https://github.com/milesj/boost/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/%40boost%2Fmodule.svg)](https://www.npmjs.com/package/@boost/module)
[![npm deps](https://david-dm.org/milesj/boost.svg?path=packages/module)](https://www.npmjs.com/package/@boost/module)

Load and resolve custom file types at runtime with a more powerful Node.js `require` replacement.

```ts
import { requireModule } from '@boost/module';

const result = requireModule('./some/non-js/file.ts');
```

Or with next-generation [loaders](https://nodejs.org/api/esm.html#esm_loaders).

```bash
node --experimental-loader @boost/module/loader.mjs ./path/to/entry-point.mjs
```

## Features

- CommonJS based importing with `requireModule()`
- CommonJS interoperability with ESM-like files
- ECMAScript module based importing with a custom ESM loader
- Supported file types: TypeScript (`.ts`, `.tsx`)

## Installation

```
yarn add @boost/module
```

## Documentation

- [https://boostlib.dev/docs/module](https://boostlib.dev/docs/module)
- [https://boostlib.dev/api/module](https://boostlib.dev/api/module)
