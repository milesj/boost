# Modules - Boost

![build status](https://img.shields.io/github/workflow/status/milesj/boost/Build)
![npm version](https://img.shields.io/npm/v/@boost/module)

Load and resolve custom file types at runtime with a more powerful Node.js `require` replacement.

```ts
import { requireModule } from '@boost/module';

const result = requireModule('./some/non-js/file.ts');
```

Or with next-generation [Node.js hooks](https://nodejs.org/api/module.html#customization-hooks).

```bash
node --import @boost/module/register ./path/to/entry-point.mjs
```

## Features

- CommonJS based importing with `requireModule()`
- CommonJS interoperability with ESM-like files
- ECMAScript module based importing with a custom Node.js hook
- Supported file types: TypeScript

## Installation

```
yarn add @boost/module
```

## Documentation

- [https://boostlib.dev/docs/module](https://boostlib.dev/docs/module)
- [https://boostlib.dev/api/module](https://boostlib.dev/api/module)
