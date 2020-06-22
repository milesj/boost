import { createScopedError } from '@boost/internal';

const errors = {
  EXTENDS_ONLY_ROOT: 'Extends setting `%s` must only be defined in a root config.',
  EXTENDS_UNKNOWN_PATH: 'Cannot extend configuration. Unknown module or file path "%s".',
  LOADER_UNSUPPORTED: 'Unsupported loader format "%s".',
  PACKAGE_UNKNOWN_SCOPE: 'Unable to determine package scope. No parent `package.json` found.',
  ROOT_INVALID: 'Invalid configuration root. Requires a `%s` folder and `package.json`.',
  ROOT_NO_PACKAGE:
    'Config folder `%s` found without a relative `package.json`. Both must be located in the project root.',
  ROOT_ONLY_OVERRIDES: 'Overrides setting `%s` must only be defined in a root config.',
};

export type ConfigErrorCode = keyof typeof errors;

export default createScopedError<ConfigErrorCode>('CFG', 'ConfigError', errors);
