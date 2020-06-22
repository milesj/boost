import { createScopedError } from '@boost/internal';

const errors = {
  EXTENDS_ROOT_ONLY: 'Extends setting `%s` must only be defined in a root config.',
  EXTENDS_UNKNOWN_PATH: 'Cannot extend configuration. Unknown module or file path "%s".',
  LOADER_UNSUPPORTED: 'Unsupported loader format "%s".',
  OVERRIDES_ROOT_ONLY: 'Overrides setting `%s` must only be defined in a root config.',
  PACKAGE_SCOPE_UNKNOWN: 'Unable to determine package scope. No parent `package.json` found.',
  ROOT_INVALID: 'Invalid configuration root. Requires a `%s` folder and `%s`.',
  ROOT_MISSING_PACKAGE:
    'Config folder `%s` found without a relative `%s`. Both must be located in the project root.',
};

export type ConfigErrorCode = keyof typeof errors;

export default createScopedError<ConfigErrorCode>('CFG', 'ConfigError', errors);
