import { createScopedError } from '@boost/internal';

const errors = {
	EXTENDS_ONLY_ROOT: 'Extends setting `{0}` must only be defined in a root config.',
	EXTENDS_UNKNOWN_PATH: 'Cannot extend configuration. Unknown module or file path "{0}".',
	LOADER_UNSUPPORTED: 'Unsupported loader format "{0}".',
	PACKAGE_UNKNOWN_SCOPE: 'Unable to determine package scope. No parent `package.json` found.',
	ROOT_INVALID: 'Cannot find root configuration. Requires a `{0}` folder or a `{1}.config.*` file.',
	ROOT_INVALID_DIR: 'Root must be a directory.',
	ROOT_NO_PACKAGE:
		'Config folder `{0}` found without a relative `package.json`. Both must be located in the project root.',
	ROOT_ONLY_OVERRIDES: 'Overrides setting `{0}` must only be defined in a root config.',
};

export type ConfigErrorCode = keyof typeof errors;

export const ConfigError = createScopedError<ConfigErrorCode>('CFG', 'ConfigError', errors);
