# Configuration - Boost

[![Build Status](https://github.com/milesj/boost/workflows/Build/badge.svg)](https://github.com/milesj/boost/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/%40boost%2Fconfig.svg)](https://www.npmjs.com/package/@boost/config)
[![npm deps](https://david-dm.org/milesj/boost.svg?path=packages/config)](https://www.npmjs.com/package/@boost/config)

Powerful convention based finder, loader, and manager of both configuration and ignore files.

```ts
import { Blueprint, Predicates } from '@boost/common';
import { Configuration } from '@boost/config';

interface ConfigFile {
	debug: boolean;
	sourceMaps: boolean;
}

class ConfigManager extends Configuration<ConfigFile> {
	blueprint({ bool }: Predicates): Blueprint<ConfigFile> {
		return {
			debug: bool(),
			sourceMaps: bool(),
		};
	}
}

const configManager = new ConfigManager('boost');

// Load `.config/boost.js`, `boost.production.json`, `.boost.yaml`, etc
const { config } = await configManager.loadConfigFromRoot('.');

// Load `.boostignore` files
const ignore = await configManager.loadIgnoreFromBranchToRoot('./some/deep/path');
```

## Features

- Loads root configs (`.config/<name>.js`) and branch configs (`.<name>.js`).
- Loads ignore files (`.<name>ignore`).
- Supports multiple config types: `js`, `cjs`, `mjs`, `json`, `yaml`
- Supports environment and root-level based overrides.
- Supports extending from other config files.
- Finds files within each branch folder while traversing up the tree.
- Caches finder results for increased efficiency.
- Custom key-value setting processors.

## Installation

```
yarn add @boost/config
```

## Documentation

- [https://boostlib.dev/docs/config](https://boostlib.dev/docs/config)
- [https://boostlib.dev/api/config](https://boostlib.dev/api/config)
