import { createScopedError } from '@boost/internal';

const errors = {
  COMMAND_EXISTS: 'A command already exists with the canonical path "%s".',
  COMMAND_INVALID_REGISTER: 'Invalid command type being registered.',
  COMMAND_INVALID_RUN: 'Failed to determine a command to run.',
  COMMAND_INVALID_SUBPATH: 'Sub-command "%s" must start with "%s:".',
  COMMAND_MIXED_DEFAULT:
    'A default command has been registered. Cannot mix default and non-default commands.',
  COMMAND_MIXED_NONDEFAULT:
    'Other commands have been registered. Cannot mix default and non-default commands.',
  COMMAND_NO_PROGRAM: 'No program found. Must be ran within the context of a parent program.',
  COMMAND_NONE_REGISTERED: 'No commands have been registered. At least 1 is required.',
  COMMAND_UNKNOWN: 'Unknown command "%s". Did you mean "%s"?',
  MIDDLEWARE_INVALID: 'Middleware must be a function.',
  NO_NESTED_REACT_RENDER:
    'A React render process already exists. Unable to render current command. This usually occurs by triggering nested program calls.',
  OPTION_RESERVED: 'Option "%s" is a reserved name and cannot be used.',
  PARAMS_RUN_ONLY: 'Parameters must be defined on the `run()` method.',
};

export type CLIErrorCode = keyof typeof errors;

export default createScopedError<CLIErrorCode>('CLI', 'CLIError', errors);
