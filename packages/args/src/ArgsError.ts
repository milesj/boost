import { createScopedError } from '@boost/internal';

const errors = {
  COMMAND_INVALID_FORMAT: 'Invalid "%s" command format. Must be letters, numbers, and dashes.',
  COMMAND_NOT_FIRST: 'Command must be passed as the first non-option, non-param argument.',
  COMMAND_PROVIDED: 'Command has already been provided as "%s", received another "%s".',
  CONTEXT_NOT_PROVIDED: 'Contextual parser options were not provided.',
  GROUP_MISSING_COUNT:
    'Numeric options must have `count` enabled when passed in a short option group.',
  GROUP_UNSUPPORTED_TYPE:
    'Only boolean and countable number options may be used in a short option group.',
  OPTION_NUMBER_COUNT: 'Only numeric options may use the `count` setting.',
  OPTION_UNKNOWN: 'Unknown option "%s" found.',
  OPTION_UNKNOWN_FORMAT: 'Unknown option format.',
  OPTION_UNKNOWN_MORE: 'Unknown option "%s" found. Did you mean "%s"?',
  PARAM_MISORDERED:
    'Optional param(s) %s found before required param "%s". Required must be first.',
  PARAM_REQUIRED: 'Param "%s" is required but value is undefined.',
  PARAM_REQUIRED_NO_DEFAULT: 'Required param "%s" has a default value, which is not allowed.',
  PARAM_UNKNOWN: 'Unknown param "%s" found. Variadic params are not supported.',
  SHORT_DEFINED: 'Short option "%s" has already been defined for "%s".',
  SHORT_SINGLE_CHAR: 'Short option "%s" may only be a single letter.',
  SHORT_UNKNOWN: 'Unknown short option "%s". No associated long option found.',
  VALUE_ARITY_UNMET: 'Not enough arity arguments. Require %d, found %d.',
  VALUE_INVALID_CHOICE: 'Invalid value, must be one of %s, found %s.',
  VALUE_NO_INLINE: 'Flags and short option groups may not use inline values.',
  VALUE_NON_ARRAY: 'Option "%s" is enabled for multiple values, but non-array default value found.',
  VALUE_NON_BOOL: 'Option "%s" is set to boolean, but non-boolean default value found.',
  VALUE_NON_NUMBER: 'Option "%s" is set to number, but non-number default value found.',
  VALUE_NON_STRING: 'Option "%s" is set to string, but non-string default value found.',
};

export type ArgsErrorCode = keyof typeof errors;

export default createScopedError<ArgsErrorCode>('ARG', 'ArgsError', errors);
