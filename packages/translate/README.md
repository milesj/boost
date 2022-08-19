# Translate - Boost

![build status](https://img.shields.io/github/workflow/status/milesj/boost/Build)
![npm version](https://img.shields.io/npm/v/@boost/translate)

Package and application level translations made easy. Wraps the powerful
[i18next](https://www.npmjs.com/package/i18next) library to abstract complexity away and define
common server-side settings.

```ts
import { createTranslator } from '@boost/translate';

const msg = createTranslator(['common', 'errors'], '../path/to/resources');

msg('common:welcome', { name: 'Boost' }); // Hello Boost!
```

## Features

- Isolated translator instances.
- Namespace aware resource bundles.
- Automatic locale detection, from command line options, or from the operating system.
- Supports multiple file types: JavaScript, JSON, YAML.
- Message interpolation, pluralization, nesting, and more.
- Plus all other features found in [i18next](https://www.i18next.com/)!

## Installation

```
yarn add @boost/translate
```

## Documentation

- [https://boostlib.dev/docs/translate](https://boostlib.dev/docs/translate)
- [https://boostlib.dev/api/translate](https://boostlib.dev/api/translate)
